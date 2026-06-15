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
import { useAdminUsers } from '@/hooks/admin';

const PAGE_SIZE = 20;

export function useAccessControlData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [changeRoleUser, setChangeRoleUser] = useState<{
    _id: string;
    fullName: string;
    role: string;
    isOwner?: boolean;
  } | null>(null);

  const {
    users,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  } = useAdminUsers({
    searchQuery,
    role:
      roleFilter === 'all'
        ? undefined
        : (roleFilter as import('@/types').UserRole),
    pagination: { limit: PAGE_SIZE },
  });

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    changeRoleUser,
    setChangeRoleUser,
    users,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export type AccessControlData = ReturnType<typeof useAccessControlData>;
