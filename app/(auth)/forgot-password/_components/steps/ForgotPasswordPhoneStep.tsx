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

import Link from 'next/link';
import { Controller } from 'react-hook-form';
import { motion } from 'framer-motion';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { AUTH, COMMON } from '@/lib/strings';
import type { ForgotPasswordFlowState } from '../../_hooks/useForgotPasswordFlow';

interface ForgotPasswordPhoneStepProps {
  flow: ForgotPasswordFlowState;
}

export function ForgotPasswordPhoneStep({ flow }: ForgotPasswordPhoneStepProps) {
  const { phoneForm, loading, error, handlePhoneSubmit } = flow;

  return (
    <form
      className="space-y-5"
      onSubmit={phoneForm.handleSubmit(handlePhoneSubmit)}
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

      <div className="text-center">
        <Link
          href="/login"
          className="text-muted hover:text-body inline-flex items-center gap-1 text-sm transition-colors"
        >
          <IonIcon name="arrow-back-outline" size="xs" />
          {AUTH.FORGOT_PASSWORD.BACK_TO_LOGIN}
        </Link>
      </div>
    </form>
  );
}
