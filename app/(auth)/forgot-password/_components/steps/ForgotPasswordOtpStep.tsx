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

import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { OtpInput } from '../OtpInput';
import { OTP_LENGTH } from '@/lib/validation/constants';
import { AUTH } from '@/lib/strings';
import { getOtpDeliveryHint } from '@/lib/utils/otp-channel-message';
import {
  formatPhone,
  type ForgotPasswordFlowState,
} from '../../_hooks/useForgotPasswordFlow';

interface ForgotPasswordOtpStepProps {
  flow: ForgotPasswordFlowState;
}

export function ForgotPasswordOtpStep({ flow }: ForgotPasswordOtpStepProps) {
  const {
    otpForm,
    phone,
    otpFlow,
    loading,
    error,
    resendTimer,
    handleOtpSubmit,
    handleResend,
    goToStep,
  } = flow;

  return (
    <form
      className="space-y-5"
      onSubmit={otpForm.handleSubmit(handleOtpSubmit)}
    >
      {error ? (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400"
        >
          {error}
        </motion.div>
      ) : null}

      <div className="space-y-1 text-center">
        <p className="text-muted text-sm">{AUTH.FORGOT_PASSWORD.OTP_SENT_TO}</p>
        <p className="text-primary text-sm font-semibold">
          {formatPhone(phone)}
        </p>
        <p
          className={
            otpFlow.channel === 'ZNS'
              ? 'text-primary text-xs'
              : 'text-muted text-xs'
          }
        >
          {getOtpDeliveryHint(otpFlow.channel)}
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

      <div className="text-center">
        <button
          type="button"
          disabled={loading}
          onClick={() => goToStep('phone')}
          className="text-muted hover:text-body inline-flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          {AUTH.FORGOT_PASSWORD.BACK}
        </button>
      </div>
    </form>
  );
}
