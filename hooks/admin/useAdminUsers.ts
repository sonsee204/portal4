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

import { useCallback, useEffect } from 'react';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { ADMIN_GET_USERS } from '@/graphql/queries/admin';
import type { AdminGetUsersQuery } from '@/graphql/generated';
import type { UserRole, User } from '@/types';
import {
  connectionNodes,
  resolveConnectionFirst,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';

interface AdminUsersVariables {
  role?: UserRole;
  isActive?: boolean;
  isSuspended?: boolean;
  searchQuery?: string;
  pagination?: { page?: number; limit?: number; first?: number; after?: string | null };
}

export function useAdminUsers(variables: AdminUsersVariables) {
  const page = variables.pagination?.page ?? 1;
  const first = resolveConnectionFirst(variables.pagination);
  const resetKey = JSON.stringify({
    role: variables.role,
    isActive: variables.isActive,
    isSuspended: variables.isSuspended,
    searchQuery: variables.searchQuery || undefined,
  });

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<AdminGetUsersQuery>({
        query: ADMIN_GET_USERS,
        variables: {
          role: variables.role,
          isActive: variables.isActive,
          isSuspended: variables.isSuspended,
          searchQuery: variables.searchQuery || undefined,
          pagination: { first: pageSize, after },
        },
        fetchPolicy: 'network-only',
      });
      const conn = data?.adminUsersConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, variables.role, variables.isActive, variables.isSuspended, variables.searchQuery],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch } = useQuery<AdminGetUsersQuery>(
    ADMIN_GET_USERS,
    {
      variables: {
        role: variables.role,
        isActive: variables.isActive,
        isSuspended: variables.isSuspended,
        searchQuery: variables.searchQuery || undefined,
        pagination: { first, after },
      },
      skip: page > 1 && resolving,
      fetchPolicy: 'cache-and-network',
    },
  );

  const connection = data?.adminUsersConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  return {
    users: (connectionNodes(connection?.edges) ?? []) as User[],
    total: connection?.totalCount ?? 0,
    loading: loading || resolving,
    error,
    refetch,
  };
}
