'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Stepper } from '@/components/molecules/Stepper';
import { OtpInput } from './OtpInput';
import { PasswordStrengthMeter } from '@/app/(auth)/_components/PasswordStrengthMeter';
import {
  forgotPasswordPhoneSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotPasswordPhoneData,
  type OtpFormData,
  type ResetPasswordFormData,
} from '@/lib/validation/schemas';
import { OTP_LENGTH } from '@/lib/validation/constants';
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from '@/lib/auth/actions';
import {
  setupRecaptcha,
  sendOtp,
  verifyOtp,
  cleanup,
} from '@/lib/firebase/phone-auth';
import type { ConfirmationResult } from 'firebase/auth';
import { AUTH, COMMON } from '@/lib/strings';

type Step = 'phone' | 'otp' | 'password';

const STEP_INDEX: Record<Step, number> = { phone: 0, otp: 1, password: 2 };
const RESEND_DELAY_S = 60;
const RECAPTCHA_CONTAINER_ID = 'recaptcha-forgot';

const STEPPER_STEPS = [
  { label: AUTH.FORGOT_PASSWORD.STEP_PHONE },
  { label: AUTH.FORGOT_PASSWORD.STEP_OTP },
  { label: AUTH.FORGOT_PASSWORD.STEP_PASSWORD },
];

function toE164(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('0')) {
    return `+84${cleaned.slice(1)}`;
  }
  if (cleaned.startsWith('84')) {
    return `+${cleaned}`;
  }
  return `+${cleaned}`;
}

function formatPhone(phone: string): string {
  const local = phone.replace(/^\+84/, '0');
  return local.replace(/(\d{3,4})(\d{3})(\d{3,4})/, '$1 $2 $3');
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 60 : -60,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: { duration: 0.3, ease: 'easeOut' as const },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -60 : 60,
    opacity: 0,
    transition: { duration: 0.2, ease: 'easeIn' as const },
  }),
};

// ==================== Component ====================

export function ForgotPasswordForm() {
  const router = useRouter();

  const [step, setStep] = useState<Step>('phone');
  const [direction, setDirection] = useState(1);
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const idTokenRef = useRef<string | null>(null);

  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const phoneForm = useForm<ForgotPasswordPhoneData>({
    resolver: zodResolver(forgotPasswordPhoneSchema),
    defaultValues: { phone: '' },
  });

  const otpForm = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const passwordForm = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const watchPassword = passwordForm.watch('newPassword');

  useEffect(() => {
    setupRecaptcha(RECAPTCHA_CONTAINER_ID);
    return () => {
      cleanup();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) return;

    timerRef.current = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [resendTimer > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  const goToStep = useCallback(
    (target: Step) => {
      setDirection(STEP_INDEX[target] > STEP_INDEX[step] ? 1 : -1);
      setError(null);
      setStep(target);
    },
    [step]
  );

  // ==================== Handlers ====================

  const handlePhoneSubmit = useCallback(
    async (data: ForgotPasswordPhoneData) => {
      setError(null);
      setLoading(true);
      try {
        setPhone(data.phone);

        const resetResult = await requestPasswordResetAction(data.phone);
        if (!resetResult.success) {
          setError(
            resetResult.error || AUTH.FORGOT_PASSWORD.ERROR_VERIFY_ACCOUNT
          );
          return;
        }

        const e164 = toE164(data.phone);
        const confirmation = await sendOtp(e164);
        confirmationRef.current = confirmation;

        setResendTimer(RESEND_DELAY_S);
        goToStep('otp');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_SEND_OTP);
      } finally {
        setLoading(false);
      }
    },
    [goToStep]
  );

  const handleOtpSubmit = useCallback(
    async (data: OtpFormData) => {
      setError(null);
      setLoading(true);
      try {
        if (!confirmationRef.current) {
          setError(AUTH.FORGOT_PASSWORD.ERROR_SESSION_EXPIRED);
          goToStep('phone');
          return;
        }

        const idToken = await verifyOtp(confirmationRef.current, data.otp);
        idTokenRef.current = idToken;
        goToStep('password');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_INVALID_OTP);
      } finally {
        setLoading(false);
      }
    },
    [goToStep]
  );

  const handleResend = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const e164 = toE164(phone);
      const confirmation = await sendOtp(e164);
      confirmationRef.current = confirmation;
      setResendTimer(RESEND_DELAY_S);
      otpForm.reset({ otp: '' });
    } catch {
      setError(AUTH.FORGOT_PASSWORD.ERROR_RESEND_OTP);
    } finally {
      setLoading(false);
    }
  }, [phone, otpForm]);

  const handlePasswordSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setError(null);

      if (!idTokenRef.current) {
        setError(AUTH.FORGOT_PASSWORD.ERROR_SESSION_EXPIRED);
        goToStep('phone');
        return;
      }

      setLoading(true);
      try {
        const result = await resetPasswordAction(
          idTokenRef.current,
          data.newPassword
        );

        if (!result.success) {
          setError(result.error || AUTH.FORGOT_PASSWORD.ERROR_RESET_FAILED);
          return;
        }

        router.push('/login?reset=success');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_RESET_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [router, goToStep]
  );

  // ==================== Render Helpers ====================

  const renderError = () =>
    error ? (
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
      >
        {error}
      </motion.div>
    ) : null;

  const renderBackLink = (target: Step | 'login') => (
    <div className="text-center">
      {target === 'login' ? (
        <Link
          href="/login"
          className="text-muted hover:text-body inline-flex items-center gap-1 text-sm transition-colors"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          {AUTH.FORGOT_PASSWORD.BACK_TO_LOGIN}
        </Link>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => goToStep(target)}
          className="text-muted hover:text-body inline-flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          {AUTH.FORGOT_PASSWORD.BACK}
        </button>
      )}
    </div>
  );

  // ==================== Step Renders ====================

  const renderPhoneStep = () => (
    <form
      className="space-y-5"
      onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
    >
      {renderError()}

      <p className="text-muted text-center text-sm">
        {AUTH.FORGOT_PASSWORD.PHONE_DESCRIPTION}
      </p>

      <Controller
        name="phone"
        control={phoneForm.control}
        render={({ field }) => (
          <Input
            {...field}
            label={AUTH.FORGOT_PASSWORD.PHONE_LABEL}
            type="tel"
            placeholder="0987654321"
            leftIcon="call-outline"
            error={phoneForm.formState.errors.phone?.message}
            disabled={loading}
            autoFocus
          />
        )}
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        iconLeft="arrow-forward-outline"
        disabled={loading}
      >
        {loading ? COMMON.PROCESSING : AUTH.FORGOT_PASSWORD.PHONE_CONTINUE}
      </Button>

      {renderBackLink('login')}
    </form>
  );

  const renderOtpStep = () => (
    <form
      className="space-y-5"
      onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
    >
      {renderError()}

      <div className="space-y-1 text-center">
        <p className="text-muted text-sm">{AUTH.FORGOT_PASSWORD.OTP_SENT_TO}</p>
        <p className="text-primary text-sm font-semibold">
          {formatPhone(phone)}
        </p>
      </div>

      <Controller
        name="otp"
        control={otpForm.control}
        render={({ field }) => (
          <OtpInput
            value={field.value}
            onChange={field.onChange}
            disabled={loading}
            error={otpForm.formState.errors.otp?.message}
            length={OTP_LENGTH}
          />
        )}
      />

      <Button
        type="submit"
        className="w-full"
        size="lg"
        iconLeft="checkmark-circle-outline"
        disabled={loading}
      >
        {loading
          ? AUTH.FORGOT_PASSWORD.OTP_VERIFYING
          : AUTH.FORGOT_PASSWORD.OTP_VERIFY}
      </Button>

      <div className="text-center">
        {resendTimer > 0 ? (
          <span className="text-faint text-xs">
            {AUTH.FORGOT_PASSWORD.OTP_RESEND_TIMER(resendTimer)}
          </span>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="text-primary hover:text-primary-light text-xs transition-colors disabled:opacity-50"
          >
            {AUTH.FORGOT_PASSWORD.OTP_RESEND}
          </button>
        )}
      </div>

      {renderBackLink('phone')}
    </form>
  );

  const renderPasswordStep = () => (
    <form
      className="space-y-5"
      onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
    >
      {renderError()}

      <div className="space-y-1 text-center">
        <p className="text-muted text-sm">
          {AUTH.FORGOT_PASSWORD.NEW_PASSWORD_DESCRIPTION}
        </p>
        <p className="text-primary text-sm font-semibold">
          {formatPhone(phone)}
        </p>
      </div>

      <div>
        <Controller
          name="newPassword"
          control={passwordForm.control}
          render={({ field }) => (
            <Input
              {...field}
              label={AUTH.FORGOT_PASSWORD.NEW_PASSWORD_LABEL}
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 6 ký tự"
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              onRightIconClick={() => setShowPassword((v) => !v)}
              error={passwordForm.formState.errors.newPassword?.message}
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
          )}
        />
        <button
          type="button"
          className="text-faint hover:text-muted mt-1 text-xs"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? AUTH.LOGIN.HIDE_PASSWORD : AUTH.LOGIN.SHOW_PASSWORD}
        </button>
      </div>

      <PasswordStrengthMeter password={watchPassword || ''} />

      <div>
        <Controller
          name="confirmPassword"
          control={passwordForm.control}
          render={({ field }) => (
            <Input
              {...field}
              label={AUTH.FORGOT_PASSWORD.CONFIRM_PASSWORD_LABEL}
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              leftIcon="lock-closed-outline"
              rightIcon={
                showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
              }
              onRightIconClick={() => setShowConfirmPassword((v) => !v)}
              error={passwordForm.formState.errors.confirmPassword?.message}
              disabled={loading}
              autoComplete="new-password"
            />
          )}
        />
        <button
          type="button"
          className="text-faint hover:text-muted mt-1 text-xs"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          {showConfirmPassword
            ? AUTH.LOGIN.HIDE_PASSWORD
            : AUTH.LOGIN.SHOW_PASSWORD}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        iconLeft="refresh-outline"
        disabled={loading}
      >
        {loading ? COMMON.PROCESSING : AUTH.FORGOT_PASSWORD.RESET_BUTTON}
      </Button>

      {renderBackLink('otp')}
    </form>
  );

  // ==================== Main Render ====================

  return (
    <div className="space-y-6">
      <div id={RECAPTCHA_CONTAINER_ID} />

      <Stepper
        steps={STEPPER_STEPS}
        currentStep={STEP_INDEX[step]}
        className="justify-center"
      />

      {/* Step content with slide transitions */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={step}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
        >
          {step === 'phone' && renderPhoneStep()}
          {step === 'otp' && renderOtpStep()}
          {step === 'password' && renderPasswordStep()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
