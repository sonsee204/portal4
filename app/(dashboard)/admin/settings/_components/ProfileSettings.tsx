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

import { useCallback, useRef, type ChangeEvent } from 'react';
import Image from 'next/image';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Input } from '@/components/atoms/Input';
import { Textarea } from '@/components/atoms/Textarea';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useAuthStore } from '@/stores/auth';
import { useUpdateProfile, useUploadAvatar } from '@/hooks/user';
import type { AuthUser, AuthUserLocation } from '@/types';
import {
  profileSchema,
  type ProfileFormData,
} from '@/lib/validation/schemas';

const BIO_MAX_LENGTH = 500;
const GENDER_OPTIONS = [
  { label: 'Chưa chọn', value: '' },
  { label: 'Nam', value: 'MALE' },
  { label: 'Nữ', value: 'FEMALE' },
  { label: 'Khác', value: 'OTHER' },
];

function formatLocation(loc: AuthUserLocation | null | undefined): string {
  if (!loc) return '';
  if (loc.displayText) return loc.displayText;
  const parts = [loc.city, loc.country].filter(Boolean);
  return parts.join(', ');
}

function ProfileForm({ user }: { user: AuthUser }) {
  const { updateProfile, loading } = useUpdateProfile();
  const { uploadAvatar, loading: avatarLoading } = useUploadAvatar();
  const fileRef = useRef<HTMLInputElement>(null);

  const handleAvatarFileChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        void uploadAvatar(base64);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [uploadAvatar],
  );

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user.fullName ?? '',
      displayName: user.displayName ?? '',
      bio: user.bio ?? '',
      club: user.club ?? '',
      gender: (user.gender as ProfileFormData['gender']) ?? '',
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : '',
      locationDisplayText: formatLocation(user.location),
    },
  });

  const bioValue = useWatch({ control, name: 'bio' }) ?? '';

  const onSubmit = (data: ProfileFormData) => {
    void updateProfile({
      fullName: data.fullName.trim(),
      displayName: data.displayName.trim(),
      bio: data.bio?.trim() || undefined,
      club: data.club?.trim() || undefined,
      gender: data.gender || null,
      dateOfBirth: data.dateOfBirth || null,
      location: data.locationDisplayText?.trim()
        ? { displayText: data.locationDisplayText.trim() }
        : null,
    });
  };

  const handleCancel = () =>
    reset({
      fullName: user.fullName ?? '',
      displayName: user.displayName ?? '',
      bio: user.bio ?? '',
      club: user.club ?? '',
      gender: (user.gender as ProfileFormData['gender']) ?? '',
      dateOfBirth: user.dateOfBirth
        ? new Date(user.dateOfBirth).toISOString().slice(0, 10)
        : '',
      locationDisplayText: formatLocation(user.location),
    });

  return (
    <GlassPanel card className="max-w-2xl space-y-6">
      <h3 className="text-heading flex items-center gap-2 text-sm font-bold">
        <IonIcon name="person-outline" size="sm" className="text-primary" />
        Thông tin cá nhân
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            className="hidden"
            disabled={avatarLoading}
            onChange={handleAvatarFileChange}
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={avatarLoading}
            className="text-primary bg-primary/10 group relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
                unoptimized
              />
            ) : (
              <span className="text-2xl font-bold">
                {user.fullName?.charAt(0).toUpperCase() || 'U'}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/0 transition-colors group-hover:bg-black/40">
              <IonIcon
                name="camera-outline"
                size="md"
                className="opacity-0 transition-opacity group-hover:opacity-100"
              />
            </div>
            {avatarLoading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
              </div>
            )}
          </button>
          <div>
            <p className="text-heading text-sm font-medium">Ảnh đại diện</p>
            <p className="text-faint text-xs">
              Nhấn để thay đổi ảnh. PNG, JPG tối đa 5MB.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Họ và tên"
            placeholder="Nhập họ và tên của bạn"
            leftIcon="person-outline"
            disabled={loading}
            error={errors.fullName?.message}
            {...register('fullName')}
          />
          <Input
            label="Tên hiển thị"
            placeholder="Nhập tên hiển thị"
            leftIcon="at-outline"
            disabled={loading}
            error={errors.displayName?.message}
            {...register('displayName')}
          />
        </div>

        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className="text-body text-sm font-medium">Giới thiệu</label>
            <span className="text-faint text-xs">
              {bioValue.length}/{BIO_MAX_LENGTH}
            </span>
          </div>
          <Textarea
            placeholder="Giới thiệu về bản thân"
            maxLength={BIO_MAX_LENGTH}
            rows={4}
            disabled={loading}
            className="resize-none"
            error={!!errors.bio}
            {...register('bio')}
          />
        </div>

        <Input
          label="Câu lạc bộ"
          placeholder="Tên câu lạc bộ của bạn"
          leftIcon="people-outline"
          maxLength={100}
          disabled={loading}
          error={errors.club?.message}
          {...register('club')}
        />

        <div className="border-surface-border space-y-4 border-t pt-4">
          <h4 className="text-heading text-xs font-bold tracking-wider uppercase">
            Thông tin bổ sung
          </h4>
          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="Giới tính"
              options={GENDER_OPTIONS}
              disabled={loading}
              error={!!errors.gender}
              {...register('gender')}
            />
            <Input
              label="Ngày sinh"
              type="date"
              leftIcon="calendar-outline"
              disabled={loading}
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
            />
          </div>
          <Input
            label="Vị trí"
            placeholder="VD: TP. Hồ Chí Minh, Việt Nam"
            leftIcon="location-outline"
            disabled={loading}
            error={errors.locationDisplayText?.message}
            {...register('locationDisplayText')}
          />
        </div>

        <div className="border-surface-border flex flex-wrap items-center justify-end gap-2 border-t pt-4">
          {isDirty && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              disabled={loading}
            >
              Hủy
            </Button>
          )}
          <Button
            type="submit"
            size="sm"
            iconLeft="save-outline"
            disabled={loading || !isDirty}
          >
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      </form>
    </GlassPanel>
  );
}

export function ProfileSettings() {
  const user = useAuthStore((s) => s.user);

  if (!user) {
    return (
      <GlassPanel card className="max-w-2xl">
        <p className="text-faint text-sm">
          Vui lòng đăng nhập để chỉnh sửa hồ sơ.
        </p>
      </GlassPanel>
    );
  }

  return <ProfileForm key={user._id} user={user} />;
}
