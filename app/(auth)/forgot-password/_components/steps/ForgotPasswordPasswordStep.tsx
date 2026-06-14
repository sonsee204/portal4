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

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PasswordStrengthMeter } from '@/app/(auth)/_components/PasswordStrengthMeter';
import { AUTH, COMMON } from '@/lib/strings';
import {
  formatPhone,
  type ForgotPasswordFlowState,
} from '../../_hooks/useForgotPasswordFlow';

interface ForgotPasswordPasswordStepProps {
  flow: ForgotPasswordFlowState;
}

export function ForgotPasswordPasswordStep({
  flow,
}: ForgotPasswordPasswordStepProps) {
  const {
    passwordForm,
    phone,
    watchPassword,
    loading,
    error,
    handlePasswordSubmit,
    goToStep,
  } = flow;

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <form
      className="space-y-5"
      onSubmit={passwordForm.handleSubmit(handlePasswordSubmit)}
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

      <div className="text-center">
        <button
          type="button"
          disabled={loading}
          onClick={() => goToStep('otp')}
          className="text-muted hover:text-body inline-flex items-center gap-1 text-sm transition-colors disabled:opacity-50"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          {AUTH.FORGOT_PASSWORD.BACK}
        </button>
      </div>
    </form>
  );
}
