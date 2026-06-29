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

import { useMemo, useState } from 'react';
import { useAdminUsers } from '@/hooks/admin';
import {
  toSortByOrder,
} from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { PAGE_SIZE } from './users-page.constants';

export const ADMIN_USERS_SORT_FIELDS = [
  'fullName',
  'createdAt',
  'lastLoginAt',
  'role',
] as const;

export function useUsersPageData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showProvisionDialog, setShowProvisionDialog] = useState(false);

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: ADMIN_USERS_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const {
    users,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  } = useAdminUsers({
    searchQuery,
    pagination: { limit: PAGE_SIZE },
    sort,
  });

  return {
    searchQuery,
    setSearchQuery,
    showCreateDialog,
    setShowCreateDialog,
    showProvisionDialog,
    setShowProvisionDialog,
    sortField,
    sortDir,
    handleSort,
    users,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}

export type UsersPageData = ReturnType<typeof useUsersPageData>;
