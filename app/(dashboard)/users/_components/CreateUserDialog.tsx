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
import { Select } from '@/components/atoms/Select';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ADMIN_CREATE_USER } from '@/graphql/mutations/admin';
import { useAuthStore } from '@/stores/auth';
import { showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import {
  createUserSchema,
  type CreateUserFormData,
} from '@/lib/validation/schemas';
import { USERS, COMMON } from '@/lib/strings';

interface CreateUserDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CREATABLE_ROLES = [
  { value: 'FACILITY_OWNER', label: USERS.ROLES.FACILITY_OWNER },
  { value: 'ADMIN', label: USERS.ROLES.ADMIN },
];

export function CreateUserDialog({
  open,
  onClose,
  onSuccess,
}: CreateUserDialogProps) {
  const userRole = useAuthStore((s) => s.user?.role);
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      role: 'FACILITY_OWNER',
    },
  });

  const [createUser, { loading }] = useMutation(ADMIN_CREATE_USER, {
    onCompleted: () => {
      showSuccess(USERS.CREATE.SUCCESS);
      onSuccess();
      handleClose();
    },
    onError: (err) => {
      const msg = formatMutationError(err);
      setError(msg);
    },
  });

  // Filter roles based on current user's role
  const availableRoles = CREATABLE_ROLES.filter((r) => {
    if (userRole === 'SUPER_ADMIN') return true;
    if (userRole === 'ADMIN') return r.value === 'FACILITY_OWNER';
    return false;
  });

  const handleClose = () => {
    setError(null);
    reset();
    onClose();
  };

  const onSubmit = async (data: CreateUserFormData) => {
    setError(null);
    await createUser({
      variables: {
        input: data,
      },
    });
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      />

      {/* Dialog */}
      <div className="glass-card border-surface-border relative z-10 w-full max-w-lg rounded-2xl border p-6 shadow-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-heading text-lg font-semibold">
              {USERS.CREATE.TITLE}
            </h2>
            <p className="text-muted mt-1 text-sm">
              {USERS.CREATE.DESCRIPTION}
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-muted hover:text-heading transition-colors"
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={USERS.CREATE.LABEL_FULLNAME}
                placeholder="Nguyễn Văn A"
                leftIcon="person-outline"
                error={errors.fullName?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={USERS.CREATE.LABEL_EMAIL}
                type="email"
                placeholder="user@example.com"
                leftIcon="mail-outline"
                error={errors.email?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={USERS.CREATE.LABEL_PHONE}
                placeholder="0987654321 hoặc +84987654321"
                leftIcon="call-outline"
                error={errors.phone?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                label={USERS.CREATE.LABEL_PASSWORD}
                type="password"
                placeholder="Tối thiểu 6 ký tự"
                leftIcon="lock-closed-outline"
                error={errors.password?.message}
                disabled={loading}
              />
            )}
          />

          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select
                {...field}
                label={USERS.CREATE.LABEL_ROLE}
                disabled={loading}
              >
                {availableRoles.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </Select>
            )}
          />

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
              iconLeft="person-add-outline"
              disabled={loading}
            >
              {loading ? USERS.CREATE.SUBMITTING : USERS.CREATE.SUBMIT}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
