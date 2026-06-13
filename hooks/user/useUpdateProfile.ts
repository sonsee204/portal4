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

import { useMutation, useApolloClient } from '@apollo/client/react';
import { useCallback } from 'react';
import { UPDATE_PROFILE } from '@/graphql/mutations/user';
import { useAuthStore } from '@/stores/auth';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import type { AuthUser } from '@/types';

/** UpdateProfileInput shape matching backend schema */
export interface UpdateProfileInput {
  fullName?: string;
  displayName?: string;
  bio?: string;
  club?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dateOfBirth?: string | null;
  location?: {
    city?: string;
    country?: string;
    displayText?: string;
    coordinates?: { latitude: number; longitude: number };
  } | null;
}

export function useUpdateProfile(options?: {
  onSuccess?: (user: AuthUser) => void;
}) {
  const client = useApolloClient();
  const setUser = useAuthStore((s) => s.setUser);

  const [mutate, { loading, error }] = useMutation<
    { updateProfile: AuthUser },
    { input: UpdateProfileInput }
  >(UPDATE_PROFILE, {
    ...createMutationOptions('UpdateProfile', 'Cập nhật hồ sơ thành công'),
    onCompleted: async (data) => {
      const updatedUser = data.updateProfile;
      setUser(updatedUser);
      await client.refetchQueries({ include: ['Me'] });
      options?.onSuccess?.(updatedUser);
    },
  });

  const updateProfile = useCallback(
    (input: UpdateProfileInput) => mutate({ variables: { input } }),
    [mutate],
  );

  return {
    updateProfile,
    loading,
    error,
  };
}
