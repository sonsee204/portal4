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

import type { AuditFilterInput } from '@/types';
import type { WatchQueryFetchPolicy } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { AUDIT_GET_LOGS } from '@/graphql/audit/queries';
import type { AuditGetLogsQuery, CursorSortInput } from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import { buildSortedConnectionVariables } from '@/hooks/shared/useSortedConnectionQuery';

export type AuditLogEntry = AuditGetLogsQuery['auditLogsConnection']['edges'][number]['node'];

interface AuditLogsVariables {
  filter?: AuditFilterInput;
  pagination?: LegacyPagePagination;
  sort?: CursorSortInput;
}

export function useAuditLogs(
  variables: AuditLogsVariables,
  options?: { skip?: boolean; fetchPolicy?: WatchQueryFetchPolicy },
) {
  const filter = variables.filter;
  const baseVariables = { filter };

  const { data, loading, error, refetch, fetchMore } = useQuery<AuditGetLogsQuery>(
    AUDIT_GET_LOGS,
    {
      variables: buildSortedConnectionVariables(
        baseVariables,
        variables.sort,
        variables.pagination,
      ),
      skip: options?.skip,
      fetchPolicy: options?.fetchPolicy,
    },
  );

  const connection = data?.auditLogsConnection;
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
      auditLogsConnection: {
        ...next.auditLogsConnection!,
        edges: mergeConnectionEdges(
          prev.auditLogsConnection?.edges ?? [],
          next.auditLogsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    logs: connectionNodes(connection?.edges) ?? [],
    total: totalCount,
    totalCount,
    hasMore: hasNextPage,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}
