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

import type { DocumentNode } from 'graphql';
import type { WatchQueryFetchPolicy } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import {
  connectionNodes,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import { buildSortedConnectionVariables } from '@/hooks/shared/useSortedConnectionQuery';
import type { CursorSortInput } from '@/graphql/generated';

type ConnectionShape<TNode> = {
  edges?: Array<{ cursor: string; node: TNode }> | null;
  pageInfo?: {
    hasNextPage?: boolean;
    endCursor?: string | null;
  } | null;
  totalCount?: number | null;
};

/** Cursor connection factory for infinite-scroll lists (append-only). */
export function useInfiniteConnectionQuery<
  TData,
  TNode,
  TVariables extends Record<string, unknown>,
>(config: {
  query: DocumentNode;
  pagination?: LegacyPagePagination;
  resetKey: string;
  variables: TVariables;
  sort?: CursorSortInput | null;
  getConnection: (
    data: TData | undefined,
  ) => ConnectionShape<TNode> | null | undefined;
  mergeConnection: (prev: TData, next: TData) => TData;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) {
  const first = resolveConnectionFirst(config.pagination);
  const sort = config.sort ?? undefined;

  const { data, loading, error, refetch, fetchMore } = useQuery<TData>(
    config.query,
    {
      variables: buildSortedConnectionVariables(
        config.variables,
        sort,
        config.pagination,
      ) as TVariables & { pagination: { first: number; after: null } },
      skip: config.skip,
      fetchPolicy: config.fetchPolicy ?? 'cache-and-network',
    },
  );

  const connection = config.getConnection(data);
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (nextAfter) =>
      buildSortedConnectionVariables(
        config.variables,
        sort,
        config.pagination,
        nextAfter,
      ),
    mergeResults: config.mergeConnection,
  });

  return {
    items: connectionNodes(connection?.edges) ?? [],
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
