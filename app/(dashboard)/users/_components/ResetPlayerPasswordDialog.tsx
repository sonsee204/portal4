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
import { useMutation } from '@apollo/client/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ADMIN_RESET_USER_PASSWORD } from '@/graphql/mutations/admin';
import type { AdminResetUserPasswordMutation } from '@/graphql/generated';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import {
  adminResetPasswordSchema,
  type AdminResetPasswordFormData,
} from '@/lib/validation/schemas';
import { USERS, COMMON } from '@/lib/strings';
import { CredentialsModal, type CredentialField } from './CredentialsModal';

interface ResetPlayerPasswordDialogProps {
  open: boolean;
  userId: string;
  userName: string;
  onClose: () => void;
}

export function ResetPlayerPasswordDialog({
  open,
  userId,
  userName,
  onClose,
}: ResetPlayerPasswordDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [credentialFields, setCredentialFields] = useState<CredentialField[]>(
    []
  );

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<AdminResetPasswordFormData>({
    resolver: zodResolver(adminResetPasswordSchema),
    defaultValues: {
      newPassword: '',
      autoGeneratePassword: true,
    },
  });

  const autoGeneratePassword = watch('autoGeneratePassword');

  const [resetPassword, { loading }] =
    useMutation<AdminResetUserPasswordMutation>(ADMIN_RESET_USER_PASSWORD);

  const handleClose = () => {
    setError(null);
    reset();
    onClose();
  };

  const onSubmit = async (data: AdminResetPasswordFormData) => {
    setError(null);

    try {
      const result = await resetPassword({
        variables: {
          input: {
            userId,
            newPassword: data.autoGeneratePassword
              ? undefined
              : data.newPassword || undefined,
          },
        },
      });

      const payload = result.data?.adminResetUserPassword;
      if (!payload?.success) {
        setError('Không thể đặt lại mật khẩu');
        return;
      }

      if (payload.generatedPassword) {
        setCredentialFields([
          { label: 'Người dùng', value: userName },
          { label: 'Mật khẩu mới', value: payload.generatedPassword },
        ]);
        setCredentialsOpen(true);
      }

      handleClose();
    } catch (err) {
      setError(formatMutationError(err));
    }
  };

  const handleCredentialsClose = () => {
    setCredentialsOpen(false);
    setCredentialFields([]);
  };

  if (!open && !credentialsOpen) return null;

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          />

          <div className="glass-card border-surface-border relative z-10 w-full max-w-md rounded-2xl border p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading text-lg font-semibold">
                  {USERS.RESET_PASSWORD.TITLE}
                </h2>
                <p className="text-muted mt-1 text-sm">
                  {USERS.RESET_PASSWORD.DESCRIPTION}: {userName}
                </p>
              </div>
              <button
                type="button"
                onClick={handleClose}
                className="text-muted hover:text-heading transition-colors"
              >
                <IonIcon name="close-outline" size="md" />
              </button>
            </div>

            {error && (
              <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Controller
                name="autoGeneratePassword"
                control={control}
                render={({ field }) => (
                  <label className="flex cursor-pointer items-center gap-3">
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="accent-primary h-4 w-4 rounded"
                    />
                    <span className="text-heading text-sm">
                      {USERS.RESET_PASSWORD.AUTO_PASSWORD}
                    </span>
                  </label>
                )}
              />

              {!autoGeneratePassword && (
                <Controller
                  name="newPassword"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={USERS.RESET_PASSWORD.LABEL_NEW_PASSWORD}
                      type="password"
                      placeholder="Tối thiểu 8 ký tự"
                      leftIcon="lock-closed-outline"
                      error={errors.newPassword?.message}
                      disabled={loading}
                    />
                  )}
                />
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1"
                  onClick={handleClose}
                  disabled={loading}
                >
                  {COMMON.CANCEL}
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  iconLeft="key-outline"
                  disabled={loading}
                >
                  {loading
                    ? USERS.RESET_PASSWORD.SUBMITTING
                    : USERS.RESET_PASSWORD.CONFIRM}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      <CredentialsModal
        open={credentialsOpen}
        title={USERS.RESET_PASSWORD.CREDENTIALS_TITLE}
        hint={USERS.PROVISION.CREDENTIALS_HINT}
        fields={credentialFields}
        warning={USERS.PROVISION.OTP_WARNING}
        onClose={handleCredentialsClose}
      />
    </>
  );
}
