/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  forgotPasswordPhoneSchema,
  otpSchema,
  resetPasswordSchema,
  type ForgotPasswordPhoneData,
  type OtpFormData,
  type ResetPasswordFormData,
} from '@/lib/validation/schemas';
import {
  requestPasswordResetAction,
  resetPasswordAction,
} from '@/lib/auth/actions';
import { useOtpFlow } from '@/hooks/auth/useOtpFlow';
import { AUTH } from '@/lib/strings';

export type ForgotPasswordStep = 'phone' | 'otp' | 'password';

export const STEP_INDEX: Record<ForgotPasswordStep, number> = {
  phone: 0,
  otp: 1,
  password: 2,
};

export const RESEND_DELAY_S = 60;
export const RECAPTCHA_CONTAINER_ID = 'recaptcha-forgot';

export function formatPhone(phone: string): string {
  const local = phone.replace(/^\+84/, '0');
  return local.replace(/(\d{3,4})(\d{3})(\d{3,4})/, '$1 $2 $3');
}

export const slideVariants = {
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

export function useForgotPasswordFlow() {
  const router = useRouter();

  const [step, setStep] = useState<ForgotPasswordStep>('phone');
  const [direction, setDirection] = useState(1);
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const otpFlow = useOtpFlow({
    recaptchaContainerId: RECAPTCHA_CONTAINER_ID,
  });

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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      void otpFlow.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    (target: ForgotPasswordStep) => {
      setDirection(STEP_INDEX[target] > STEP_INDEX[step] ? 1 : -1);
      setError(null);
      setStep(target);
    },
    [step]
  );

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

        const r = await otpFlow.start({
          phone: data.phone,
          purpose: 'PASSWORD_RESET_PHONE',
        });
        if (!r.success) {
          setError(r.error || AUTH.FORGOT_PASSWORD.ERROR_SEND_OTP);
          return;
        }

        setResendTimer(RESEND_DELAY_S);
        goToStep('otp');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_SEND_OTP);
      } finally {
        setLoading(false);
      }
    },
    [goToStep, otpFlow]
  );

  const handleOtpSubmit = useCallback(
    async (data: OtpFormData) => {
      setError(null);
      setLoading(true);
      try {
        const r = await otpFlow.submitCode(data.otp);
        if (!r.success || !r.proof) {
          setError(r.error || AUTH.FORGOT_PASSWORD.ERROR_INVALID_OTP);
          return;
        }
        goToStep('password');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_INVALID_OTP);
      } finally {
        setLoading(false);
      }
    },
    [goToStep, otpFlow]
  );

  const handleResend = useCallback(async () => {
    setError(null);
    setLoading(true);
    try {
      const r = await otpFlow.resend();
      if (!r.success) {
        setError(r.error || AUTH.FORGOT_PASSWORD.ERROR_RESEND_OTP);
        return;
      }
      setResendTimer(RESEND_DELAY_S);
      otpForm.reset({ otp: '' });
    } catch {
      setError(AUTH.FORGOT_PASSWORD.ERROR_RESEND_OTP);
    } finally {
      setLoading(false);
    }
  }, [otpForm, otpFlow]);

  const handlePasswordSubmit = useCallback(
    async (data: ResetPasswordFormData) => {
      setError(null);

      const phoneProof = otpFlow.proof;
      if (!phoneProof) {
        setError(AUTH.FORGOT_PASSWORD.ERROR_SESSION_EXPIRED);
        goToStep('phone');
        return;
      }

      setLoading(true);
      try {
        const result = await resetPasswordAction(
          {
            phoneVerificationToken: phoneProof.phoneVerificationToken,
            firebaseIdToken: phoneProof.firebaseIdToken,
          },
          data.newPassword
        );

        if (!result.success) {
          setError(result.error || AUTH.FORGOT_PASSWORD.ERROR_RESET_FAILED);
          return;
        }

        void otpFlow.reset();
        router.push('/login?reset=success');
      } catch {
        setError(AUTH.FORGOT_PASSWORD.ERROR_RESET_FAILED);
      } finally {
        setLoading(false);
      }
    },
    [router, goToStep, otpFlow]
  );

  return {
    step,
    direction,
    phone,
    loading,
    error,
    otpFlow,
    resendTimer,
    phoneForm,
    otpForm,
    passwordForm,
    watchPassword,
    goToStep,
    handlePhoneSubmit,
    handleOtpSubmit,
    handleResend,
    handlePasswordSubmit,
  };
}

export type ForgotPasswordFlowState = ReturnType<typeof useForgotPasswordFlow>;
