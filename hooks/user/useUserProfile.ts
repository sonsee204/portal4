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

import { useQuery } from '@apollo/client/react';
import { GET_USER_PROFILE } from '@/graphql/user/queries';
import type { GetUserProfileResponse } from '@/types';

export function useUserProfile(userId: string | undefined) {
  const { data, loading, error, refetch } = useQuery<GetUserProfileResponse>(
    GET_USER_PROFILE,
    {
      variables: { userId: userId ?? '' },
      skip: !userId,
    },
  );

  return {
    user: data?.getUserProfile,
    loading,
    error,
    refetch,
  };
}
