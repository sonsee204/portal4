/**
 * Ao Trình (NALee Sports)
 * Shared factory for admin list hooks with numbered pagination UI.
 */

'use client';

import { useEffect } from 'react';
import type { DocumentNode } from 'graphql';
import type { WatchQueryFetchPolicy } from '@apollo/client';
import { useApolloClient, useQuery } from '@apollo/client/react';
import {
  connectionNodes,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';
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

export function usePagedConnectionQuery<TData, TNode, TVariables extends Record<string, unknown>>(config: {
  query: DocumentNode;
  page?: number;
  pagination?: LegacyPagePagination;
  resetKey: string;
  variables: TVariables;
  sort?: CursorSortInput | null;
  getConnection: (data: TData | undefined) => ConnectionShape<TNode> | null | undefined;
  mergeConnection?: (prev: TData, next: TData) => TData;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) {
  const page = config.page ?? config.pagination?.page ?? 1;
  const first = resolveConnectionFirst(config.pagination);
  const sort = config.sort ?? undefined;
  const resetKey = `${config.resetKey}|${JSON.stringify(sort ?? null)}`;

  const client = useApolloClient();
  const prefetchPage = async (after: string | null, pageSize: number) => {
    const { data } = await client.query<TData>({
      query: config.query,
      variables: buildSortedConnectionVariables(
        config.variables,
        sort,
        { first: pageSize, after },
      ) as TVariables & { pagination: { first: number; after: string | null } },
      fetchPolicy: 'network-only',
    });
    const conn = config.getConnection(data);
    return {
      endCursor: conn?.pageInfo?.endCursor,
      hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
    };
  };

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch, fetchMore } = useQuery<TData>(config.query, {
    variables: buildSortedConnectionVariables(
      config.variables,
      sort,
      config.pagination,
      after,
    ) as TVariables & { pagination: { first: number; after: string | null } },
    skip: config.skip || (page > 1 && resolving),
    fetchPolicy: config.fetchPolicy ?? 'cache-and-network',
  });

  const connection = config.getConnection(data);
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (nextAfter) =>
      buildSortedConnectionVariables(config.variables, sort, config.pagination, nextAfter),
    mergeResults: config.mergeConnection ?? ((prev, next) => next),
  });

  return {
    items: connectionNodes(connection?.edges) ?? [],
    total: totalCount,
    totalCount,
    hasMore: hasNextPage,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading: loading || resolving,
    error,
    refetch,
  };
}
