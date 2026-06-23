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
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApolloClient } from '@apollo/client/react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useAuthStore } from '@/stores/auth';
import { setClientAccessToken } from '@/lib/apollo/client';
import { changePasswordAction } from '@/lib/auth/password-actions';
import { showSuccess, showError } from '@/lib/toast';
import { clearStoredFcmToken } from '@/hooks/notification';
import { AUTH } from '@/lib/strings';
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from '@/lib/validation/schemas';

const STR = AUTH.CHANGE_PASSWORD;

export function ChangePasswordForm() {
  const router = useRouter();
  const apolloClient = useApolloClient();
  const [submitting, setSubmitting] = useState(false);
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    if (submitting) return;
    setSubmitting(true);

    const result = await changePasswordAction(
      data.currentPassword,
      data.newPassword
    );

    if (!result.success) {
      showError(result.error ?? STR.FAILED);
      setSubmitting(false);
      return;
    }

    // Every session was revoked + push tokens cleared on the backend, and the
    // portal cookies are already gone. Tear down client state and re-login.
    clearStoredFcmToken();
    try {
      await apolloClient.clearStore();
    } catch {
      // clearStore can throw with active queries; safe to ignore on logout.
    }
    useAuthStore.getState().clearAuth();
    setClientAccessToken(null);

    showSuccess(STR.SUCCESS);
    router.replace('/login');
  };

  return (
    <GlassPanel card className="max-w-2xl space-y-6">
      <div className="space-y-1">
        <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
          <IonIcon
            name="lock-closed-outline"
            size="sm"
            className="text-primary"
          />
          {STR.TITLE}
        </h3>
        <p className="text-faint text-xs leading-relaxed">{STR.DESCRIPTION}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <Input
          type={show.current ? 'text' : 'password'}
          label={STR.CURRENT_PASSWORD_LABEL}
          placeholder={STR.CURRENT_PASSWORD_PLACEHOLDER}
          leftIcon="key-outline"
          rightIcon={show.current ? 'eye-off-outline' : 'eye-outline'}
          onRightIconClick={() =>
            setShow((s) => ({ ...s, current: !s.current }))
          }
          autoComplete="current-password"
          disabled={submitting}
          error={errors.currentPassword?.message}
          {...register('currentPassword')}
        />

        <Input
          type={show.next ? 'text' : 'password'}
          label={STR.NEW_PASSWORD_LABEL}
          placeholder={STR.NEW_PASSWORD_PLACEHOLDER}
          leftIcon="lock-closed-outline"
          rightIcon={show.next ? 'eye-off-outline' : 'eye-outline'}
          onRightIconClick={() => setShow((s) => ({ ...s, next: !s.next }))}
          autoComplete="new-password"
          disabled={submitting}
          error={errors.newPassword?.message}
          {...register('newPassword')}
        />

        <Input
          type={show.confirm ? 'text' : 'password'}
          label={STR.CONFIRM_PASSWORD_LABEL}
          placeholder={STR.CONFIRM_PASSWORD_PLACEHOLDER}
          leftIcon="lock-closed-outline"
          rightIcon={show.confirm ? 'eye-off-outline' : 'eye-outline'}
          onRightIconClick={() =>
            setShow((s) => ({ ...s, confirm: !s.confirm }))
          }
          autoComplete="new-password"
          disabled={submitting}
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <div className="border-surface-border flex items-center justify-end border-t pt-4">
          <Button
            type="submit"
            size="sm"
            iconLeft="shield-checkmark-outline"
            disabled={submitting}
          >
            {submitting ? STR.SUBMITTING : STR.SUBMIT}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
}
