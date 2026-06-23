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
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { ADMIN_USERS_SORT_FIELDS } from '../../users/_hooks/useUsersPageData';

const PAGE_SIZE = 20;
const GRANT_SORT_FIELDS = ['createdAt', 'grantedAt'] as const;

export function useAccessControlData() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [changeRoleUser, setChangeRoleUser] = useState<{
    _id: string;
    fullName: string;
    role: string;
    isOwner?: boolean;
  } | null>(null);

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: ADMIN_USERS_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    sortParam: 'userSort',
    dirParam: 'userDir',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const grantSortState = useDataTableSortUrl({
    allowedFields: GRANT_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    sortParam: 'grantSort',
    dirParam: 'grantDir',
  });

  const grantSort = useMemo(
    () => toSortByOrder(grantSortState.sortField, grantSortState.sortDir),
    [grantSortState.sortField, grantSortState.sortDir],
  );

  const {
    users,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
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
    sort,
  });

  return {
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
    changeRoleUser,
    setChangeRoleUser,
    sortField,
    sortDir,
    handleSort,
    grantSortField: grantSortState.sortField,
    grantSortDir: grantSortState.sortDir,
    handleGrantSort: grantSortState.handleSort,
    grantSort,
    users,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}

export type AccessControlData = ReturnType<typeof useAccessControlData>;
