/**
 * Ao Trình (NALee Sports)
 * Shared factory for admin list hooks with numbered pagination UI.
 */

'use client';

import { useCallback, useEffect } from 'react';
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
  getConnection: (data: TData | undefined) => ConnectionShape<TNode> | null | undefined;
  mergeConnection?: (prev: TData, next: TData) => TData;
  skip?: boolean;
  fetchPolicy?: WatchQueryFetchPolicy;
}) {
  const page = config.page ?? config.pagination?.page ?? 1;
  const first = resolveConnectionFirst(config.pagination);

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<TData>({
        query: config.query,
        variables: {
          ...config.variables,
          pagination: { first: pageSize, after },
        } as TVariables & { pagination: { first: number; after: string | null } },
        fetchPolicy: 'network-only',
      });
      const conn = config.getConnection(data);
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, config],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey: config.resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch, fetchMore } = useQuery<TData>(config.query, {
    variables: {
      ...config.variables,
      pagination: { first, after },
    } as TVariables & { pagination: { first: number; after: string | null } },
    skip: config.skip || (page > 1 && resolving),
    fetchPolicy: config.fetchPolicy ?? 'cache-and-network',
  });

  const connection = config.getConnection(data);
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;
  const totalCount = connection?.totalCount ?? 0;

  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (nextAfter) => ({
      ...config.variables,
      pagination: { first, after: nextAfter },
    }),
    mergeResults: config.mergeConnection ?? ((prev, next) => next),
  });

  return {
    items: connectionNodes(connection?.edges) ?? [],
    total: totalCount,
    totalCount,
    hasMore: hasNextPage,
    hasNextPage,
    loadMore,
    loading: loading || resolving,
    error,
    refetch,
  };
}
