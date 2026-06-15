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
import { ADMIN_PROVISION_PLAYER } from '@/graphql/admin/mutations';
import type { AdminProvisionPlayerMutation } from '@/graphql/generated';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import {
  provisionPlayerSchema,
  type ProvisionPlayerFormData,
} from '@/lib/validation/schemas';
import { USERS, COMMON } from '@/lib/strings';
import { CredentialsModal, type CredentialField } from './CredentialsModal';

interface ProvisionPlayerDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type Step = 'form' | 'confirm';

export function ProvisionPlayerDialog({
  open,
  onClose,
  onSuccess,
}: ProvisionPlayerDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('form');
  const [pendingData, setPendingData] =
    useState<ProvisionPlayerFormData | null>(null);
  const [credentialsOpen, setCredentialsOpen] = useState(false);
  const [credentialFields, setCredentialFields] = useState<CredentialField[]>(
    []
  );
  const [loginInstructions, setLoginInstructions] = useState('');

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProvisionPlayerFormData>({
    resolver: zodResolver(provisionPlayerSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      password: '',
      referralCode: '',
      autoGeneratePassword: true,
    },
  });

  const autoGeneratePassword = watch('autoGeneratePassword');

  const [provisionPlayer, { loading }] =
    useMutation<AdminProvisionPlayerMutation>(ADMIN_PROVISION_PLAYER);

  const maskPhone = (phone: string) => {
    const trimmed = phone.trim();
    if (trimmed.length <= 4) return '****';
    return `${trimmed.slice(0, 3)}****${trimmed.slice(-2)}`;
  };

  const handleClose = () => {
    setError(null);
    setStep('form');
    setPendingData(null);
    reset();
    onClose();
  };

  const onFormSubmit = (data: ProvisionPlayerFormData) => {
    setError(null);
    setPendingData(data);
    setStep('confirm');
  };

  const onConfirmSubmit = async () => {
    if (!pendingData) return;
    setError(null);

    try {
      const result = await provisionPlayer({
        variables: {
          input: {
            fullName: pendingData.fullName,
            phone: pendingData.phone,
            email: pendingData.email || undefined,
            password: pendingData.autoGeneratePassword
              ? undefined
              : pendingData.password || undefined,
            referralCode: pendingData.referralCode || undefined,
          },
        },
      });

      const payload = result.data?.adminProvisionPlayer;
      if (!payload?.user) {
        setError('Không thể tạo tài khoản. Vui lòng thử lại.');
        return;
      }

      const fields: CredentialField[] = [
        { label: 'Họ tên', value: payload.user.fullName },
        { label: 'Số điện thoại', value: payload.user.phone ?? pendingData.phone },
        { label: 'Email', value: payload.user.email ?? '' },
      ];

      if (payload.generatedPassword) {
        fields.push({
          label: 'Mật khẩu',
          value: payload.generatedPassword,
        });
      }

      setCredentialFields(fields);
      setLoginInstructions(payload.loginInstructions);
      setCredentialsOpen(true);
      onSuccess();
      handleClose();
    } catch (err) {
      setError(formatMutationError(err));
      setStep('form');
    }
  };

  const handleCredentialsClose = () => {
    setCredentialsOpen(false);
    setCredentialFields([]);
    setLoginInstructions('');
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

          <div className="glass-card border-surface-border relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-heading text-lg font-semibold">
                  {step === 'form'
                    ? USERS.PROVISION.TITLE
                    : USERS.PROVISION.CONFIRM_TITLE}
                </h2>
                <p className="text-muted mt-1 text-sm">
                  {step === 'form'
                    ? USERS.PROVISION.DESCRIPTION
                    : USERS.PROVISION.CONFIRM_DESCRIPTION}
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

            {step === 'form' ? (
              <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
                <Controller
                  name="fullName"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={USERS.PROVISION.LABEL_FULLNAME}
                      placeholder="Nguyễn Văn A"
                      leftIcon="person-outline"
                      error={errors.fullName?.message}
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={USERS.PROVISION.LABEL_PHONE}
                      placeholder="0987654321 hoặc +84987654321"
                      leftIcon="call-outline"
                      error={errors.phone?.message}
                    />
                  )}
                />

                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={USERS.PROVISION.LABEL_EMAIL}
                      type="email"
                      placeholder="user@example.com"
                      leftIcon="mail-outline"
                      error={errors.email?.message}
                    />
                  )}
                />

                <Controller
                  name="referralCode"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      label={USERS.PROVISION.LABEL_REFERRAL}
                      placeholder="Mã giới thiệu"
                      leftIcon="gift-outline"
                      error={errors.referralCode?.message}
                    />
                  )}
                />

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
                        {USERS.PROVISION.AUTO_PASSWORD}
                      </span>
                    </label>
                  )}
                />

                {!autoGeneratePassword && (
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        label={USERS.PROVISION.LABEL_PASSWORD}
                        type="password"
                        placeholder="Tối thiểu 8 ký tự"
                        leftIcon="lock-closed-outline"
                        error={errors.password?.message}
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
                  >
                    {COMMON.CANCEL}
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    iconLeft="arrow-forward-outline"
                  >
                    Tiếp tục
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="bg-surface-hover/50 rounded-xl p-4 text-sm">
                  <p>
                    <span className="text-muted">Họ tên: </span>
                    <span className="text-heading font-medium">
                      {pendingData?.fullName}
                    </span>
                  </p>
                  <p className="mt-2">
                    <span className="text-muted">SĐT: </span>
                    <span className="text-heading font-medium">
                      {pendingData ? maskPhone(pendingData.phone) : ''}
                    </span>
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    className="flex-1"
                    onClick={() => setStep('form')}
                    disabled={loading}
                  >
                    Quay lại
                  </Button>
                  <Button
                    type="button"
                    className="flex-1"
                    iconLeft="person-add-outline"
                    disabled={loading}
                    onClick={() => void onConfirmSubmit()}
                  >
                    {loading
                      ? USERS.PROVISION.SUBMITTING
                      : USERS.PROVISION.CONFIRM}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <CredentialsModal
        open={credentialsOpen}
        title={USERS.PROVISION.CREDENTIALS_TITLE}
        hint={USERS.PROVISION.CREDENTIALS_HINT}
        fields={credentialFields}
        instructions={loginInstructions}
        warning={USERS.PROVISION.OTP_WARNING}
        onClose={handleCredentialsClose}
      />
    </>
  );
}
