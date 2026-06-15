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
import { PAGE_SIZE } from './users-page.constants';

export function useUsersPageData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProvisionDialog, setShowProvisionDialog] = useState(false);

  const {
    users,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  } = useAdminUsers({
    searchQuery,
    pagination: { limit: PAGE_SIZE },
  });

  return {
    searchQuery,
    setSearchQuery,
    showCreateDialog,
    setShowCreateDialog,
    showProvisionDialog,
    setShowProvisionDialog,
    users,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export type UsersPageData = ReturnType<typeof useUsersPageData>;
