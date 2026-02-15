'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from '@/lib/auth/actions';
import {
  setupRecaptcha,
  sendOtp,
  verifyOtp,
  cleanup as cleanupRecaptcha,
} from '@/lib/firebase/phone-auth';
import {
  forgotPasswordPhoneSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotPasswordPhoneData,
  type OtpFormData,
  type ResetPasswordFormData,
} from '@/lib/validation/schemas';
import { OTP_LENGTH } from '@/lib/validation/constants';
import type { ConfirmationResult } from 'firebase/auth';

// ==================== Constants ====================
const RESEND_DELAY_S = 60;
const RECAPTCHA_CONTAINER_ID = 'recaptcha-container';

// ==================== Types ====================
type Step = 'phone' | 'otp' | 'password';

// ==================== Helpers ====================

/** Normalise Vietnamese phone to E.164 (+84…) */
function toE164(phone: string): string {
  const cleaned = phone.replace(/\s/g, '').replace(/^0/, '');
  return cleaned.startsWith('+') ? cleaned : `+84${cleaned}`;
}

/** Format phone for display: 098 765 4321 */
function formatPhone(phone: string): string {
  const local = phone.replace(/^\+84/, '0');
  return local.replace(/(\d{3,4})(\d{3})(\d{3,4})/, '$1 $2 $3');
}

// ==================== Component ====================
export function ForgotPasswordForm() {
  const router = useRouter();

  // Step state
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState(''); // Keep for display in later steps
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Async state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Firebase refs
  const confirmationRef = useRef<ConfirmationResult | null>(null);
  const idTokenRef = useRef<string | null>(null);

  // Resend timer
  const [resendTimer, setResendTimer] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Form instances for each step
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

  // ==================== Effects ====================

  // Cleanup reCAPTCHA on unmount
  useEffect(() => {
    return () => {
      cleanupRecaptcha();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Countdown tick
  useEffect(() => {
    if (resendTimer <= 0) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }
    timerRef.current = setInterval(() => setResendTimer((t) => t - 1), 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [resendTimer > 0]); // eslint-disable-line react-hooks/exhaustive-deps

  // ==================== Handlers ====================

  /** Step 1: validate user + send OTP */
  const handlePhoneSubmit = useCallback(
    async (data: ForgotPasswordPhoneData) => {
      setError(null);
      setLoading(true);
      try {
        const e164 = toE164(data.phone.trim());
        setPhone(data.phone); // Store for display in later steps

        // 1. Backend: validate user exists
        const result = await requestPasswordResetAction(e164);
        if (!result.success) {
          setError(result.error ?? 'Không thể xác thực tài khoản');
          return;
        }

        // 2. Firebase: send OTP
        setupRecaptcha(RECAPTCHA_CONTAINER_ID);
        const confirmation = await sendOtp(e164);
        confirmationRef.current = confirmation;

        // 3. Start resend timer + move to step 2
        setResendTimer(RESEND_DELAY_S);
        setStep('otp');
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Lỗi gửi mã xác thực';
        setError(msg);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  /** Step 2: verify OTP */
  const handleOtpSubmit = useCallback(async (data: OtpFormData) => {
    setError(null);

    if (!confirmationRef.current) {
      setError('Phiên xác thực hết hạn. Vui lòng thử lại.');
      setStep('phone');
      return;
    }

    setLoading(true);
    try {
      const token = await verifyOtp(confirmationRef.current, data.otp);
      idTokenRef.current = token;
      setStep('password');
    } catch {
      setError('Mã xác thực không đúng. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, []);

  /** Resend OTP */
  const handleResend = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const e164 = toE164(phone.trim());
      setupRecaptcha(RECAPTCHA_CONTAINER_ID);
      const confirmation = await sendOtp(e164);
      confirmationRef.current = confirmation;
      setResendTimer(RESEND_DELAY_S);
      otpForm.reset({ otp: '' });
    } catch {
      setError('Không thể gửi lại mã. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  }, [phone, otpForm]);

  /** Step 3: reset password */
  const handlePasswordSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setError(null);

      if (!idTokenRef.current) {
        setError('Phiên xác thực hết hạn. Vui lòng thử lại.');
        setStep('phone');
        return;
      }

      setLoading(true);
      try {
        const result = await resetPasswordAction(
          idTokenRef.current,
          data.newPassword
        );
        if (!result.success) {
          setError(result.error ?? 'Đặt lại mật khẩu thất bại');
          return;
        }

        // Success — redirect to login with success message
        router.push('/login?reset=success');
      } catch {
        setError('Không thể kết nối đến máy chủ. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  // ==================== Render helpers ====================

  const renderError = () =>
    error ? (
      <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
        {error}
      </div>
    ) : null;

  const renderBackLink = (target: Step | 'login') => (
    <div className="text-center">
      {target === 'login' ? (
        <Link
          href="/login"
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-body"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          Quay lại đăng nhập
        </Link>
      ) : (
        <button
          type="button"
          disabled={loading}
          onClick={() => {
            setError(null);
            setStep(target);
          }}
          className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-body disabled:opacity-50"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          Quay lại
        </button>
      )}
    </div>
  );

  // ==================== Step renders ====================

  const renderPhoneStep = () => (
    <form
      className="space-y-5"
      onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
    >
      {renderError()}

      <p className="text-center text-sm text-muted">
        Nhập số điện thoại đã đăng ký để nhận mã xác thực
      </p>

      <Controller
        name="phone"
        control={phoneForm.control}
        render={({ field }) => (
          <Input
            {...field}
            label="Số điện thoại"
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
        {loading ? 'Đang xử lý...' : 'Tiếp tục'}
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
        <p className="text-sm text-muted">Mã xác thực đã được gửi đến</p>
        <p className="text-primary text-sm font-semibold">
          {formatPhone(phone)}
        </p>
      </div>

      <Controller
        name="otp"
        control={otpForm.control}
        render={({ field }) => (
          <Input
            {...field}
            label="Mã xác thực"
            type="text"
            inputMode="numeric"
            placeholder="000000"
            leftIcon="lock-closed-outline"
            error={otpForm.formState.errors.otp?.message}
            disabled={loading}
            maxLength={OTP_LENGTH}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '').slice(0, OTP_LENGTH);
              field.onChange(v);
            }}
            autoFocus
            autoComplete="one-time-code"
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
        {loading ? 'Đang xác thực...' : 'Xác thực'}
      </Button>

      <div className="text-center">
        {resendTimer > 0 ? (
          <span className="text-xs text-faint">
            Gửi lại sau {resendTimer}s
          </span>
        ) : (
          <button
            type="button"
            disabled={loading}
            onClick={handleResend}
            className="text-primary hover:text-primary-light text-xs transition-colors disabled:opacity-50"
          >
            Gửi lại mã xác thực
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
        <p className="text-sm text-muted">Đặt mật khẩu mới cho tài khoản</p>
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
              label="Mật khẩu mới"
              type={showPassword ? 'text' : 'password'}
              placeholder="Tối thiểu 6 ký tự"
              leftIcon="lock-closed-outline"
              rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
              error={passwordForm.formState.errors.newPassword?.message}
              disabled={loading}
              autoComplete="new-password"
              autoFocus
            />
          )}
        />
        <button
          type="button"
          className="mt-1 text-xs text-faint hover:text-muted"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
        >
          {showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        </button>
      </div>

      <div>
        <Controller
          name="confirmPassword"
          control={passwordForm.control}
          render={({ field }) => (
            <Input
              {...field}
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Nhập lại mật khẩu"
              leftIcon="lock-closed-outline"
              rightIcon={
                showConfirmPassword ? 'eye-off-outline' : 'eye-outline'
              }
              error={passwordForm.formState.errors.confirmPassword?.message}
              disabled={loading}
              autoComplete="new-password"
            />
          )}
        />
        <button
          type="button"
          className="mt-1 text-xs text-faint hover:text-muted"
          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          tabIndex={-1}
        >
          {showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
        </button>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        iconLeft="refresh-outline"
        disabled={loading}
      >
        {loading ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
      </Button>

      {renderBackLink('otp')}
    </form>
  );

  // ==================== Main render ====================
  return (
    <>
      {step === 'phone' && renderPhoneStep()}
      {step === 'otp' && renderOtpStep()}
      {step === 'password' && renderPasswordStep()}

      {/* Invisible reCAPTCHA container — required by Firebase Phone Auth */}
      <div id={RECAPTCHA_CONTAINER_ID} />
    </>
  );
}
