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
import { ADMIN_GET_USERS } from '@/graphql/admin/queries';
import type { AdminGetUsersQuery } from '@/graphql/generated';
import type { UserRole, User } from '@/types';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

interface AdminUsersVariables {
  role?: UserRole;
  isActive?: boolean;
  isSuspended?: boolean;
  searchQuery?: string;
  pagination?: LegacyPagePagination;
}

export function useAdminUsers(variables: AdminUsersVariables) {
  const first = resolveConnectionFirst(variables.pagination);

  const { data, loading, error, refetch, fetchMore } = useQuery<AdminGetUsersQuery>(
    ADMIN_GET_USERS,
    {
      variables: {
        role: variables.role,
        isActive: variables.isActive,
        isSuspended: variables.isSuspended,
        searchQuery: variables.searchQuery || undefined,
        pagination: { first, after: variables.pagination?.after ?? null },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  const connection = data?.adminUsersConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      role: variables.role,
      isActive: variables.isActive,
      isSuspended: variables.isSuspended,
      searchQuery: variables.searchQuery || undefined,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      adminUsersConnection: {
        ...next.adminUsersConnection!,
        edges: mergeConnectionEdges(
          prev.adminUsersConnection?.edges ?? [],
          next.adminUsersConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    users: (connectionNodes(connection?.edges) ?? []) as User[],
    total: totalCount,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}
