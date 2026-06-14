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
import type { AuditFilterInput } from '@/types';
import type { WatchQueryFetchPolicy } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { AUDIT_GET_LOGS } from '@/graphql/queries/audit';
import type { AuditGetLogsQuery } from '@/graphql/generated';
import {
  connectionNodes,
  resolveConnectionFirst,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';

export type AuditLogEntry = AuditGetLogsQuery['auditLogsConnection']['edges'][number]['node'];

interface AuditLogsVariables {
  filter?: AuditFilterInput;
  pagination?: { page?: number; limit?: number; first?: number; after?: string | null };
}

export function useAuditLogs(
  variables: AuditLogsVariables,
  options?: { skip?: boolean; fetchPolicy?: WatchQueryFetchPolicy },
) {
  const filter = variables.filter;
  const page = variables.pagination?.page ?? 1;
  const first = resolveConnectionFirst(variables.pagination);
  const resetKey = JSON.stringify(filter ?? null);

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<AuditGetLogsQuery>({
        query: AUDIT_GET_LOGS,
        variables: { filter, pagination: { first: pageSize, after } },
        fetchPolicy: 'network-only',
      });
      const conn = data?.auditLogsConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, filter],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch } = useQuery<AuditGetLogsQuery>(
    AUDIT_GET_LOGS,
    {
      variables: {
        filter,
        pagination: { first, after: variables.pagination?.after ?? after },
      },
      skip: options?.skip || (page > 1 && resolving),
      fetchPolicy: options?.fetchPolicy,
    },
  );

  const connection = data?.auditLogsConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const total = connection?.totalCount ?? 0;

  return {
    logs: connectionNodes(connection?.edges) ?? [],
    total,
    hasMore: connection?.pageInfo?.hasNextPage ?? false,
    loading: loading || resolving,
    error,
    refetch,
  };
}
