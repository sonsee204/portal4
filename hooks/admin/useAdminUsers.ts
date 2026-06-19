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
import type { AdminGetUsersQuery, CursorSortInput } from '@/graphql/generated';
import type { UserRole, User } from '@/types';
import {
  connectionNodes,
  mergeConnectionEdges,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import {
  buildSortedConnectionVariables,
  SORTED_CONNECTION_FETCH_POLICY,
} from '@/hooks/shared/useSortedConnectionQuery';

interface AdminUsersVariables {
  role?: UserRole;
  isActive?: boolean;
  isSuspended?: boolean;
  searchQuery?: string;
  pagination?: LegacyPagePagination;
  sort?: CursorSortInput;
}

export function useAdminUsers(variables: AdminUsersVariables) {
  const baseVariables = {
    role: variables.role,
    isActive: variables.isActive,
    isSuspended: variables.isSuspended,
    searchQuery: variables.searchQuery || undefined,
  };

  const { data, loading, error, refetch, fetchMore } = useQuery<AdminGetUsersQuery>(
    ADMIN_GET_USERS,
    {
      variables: buildSortedConnectionVariables(
        baseVariables,
        variables.sort,
        variables.pagination,
      ),
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    },
  );

  const connection = data?.adminUsersConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(
        baseVariables,
        variables.sort,
        variables.pagination,
        after,
      ),
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
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}
