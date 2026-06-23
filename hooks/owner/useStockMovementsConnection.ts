/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { STOCK_MOVEMENTS_CONNECTION } from '@/graphql/owner/inventory/stock-movements';
import type {
  StockMovementFilterInput,
  StockMovementSortInput,
  StockMovementsConnectionQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import {
  buildSortedConnectionVariables,
  SORTED_CONNECTION_FETCH_POLICY,
} from '@/hooks/shared/useSortedConnectionQuery';

export const STOCK_MOVEMENTS_PAGE_SIZE = 50;

export type StockMovementNode = NonNullable<
  NonNullable<
    StockMovementsConnectionQuery['stockMovementsConnection']
  >['edges'][number]['node']
>;

function toGraphFilter(
  filter?: StockMovementFilterInput | null,
): StockMovementFilterInput | undefined {
  if (!filter) return undefined;

  const next: StockMovementFilterInput = {};
  if (filter.productId) next.productId = filter.productId;
  if (filter.types?.length) next.types = filter.types;
  if (filter.searchQuery?.trim()) next.searchQuery = filter.searchQuery.trim();
  if (filter.dateFrom) next.dateFrom = filter.dateFrom;
  if (filter.dateTo) next.dateTo = filter.dateTo;

  return Object.keys(next).length > 0 ? next : undefined;
}

export function useStockMovementsConnection(
  venueId: string | null,
  filter?: StockMovementFilterInput | null,
  sort?: StockMovementSortInput | null,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination, STOCK_MOVEMENTS_PAGE_SIZE);
  const graphFilter = useMemo(() => toGraphFilter(filter), [filter]);

  const baseVariables = useMemo(
    () => ({
      venueId: venueId ?? '',
      filter: graphFilter,
    }),
    [venueId, graphFilter],
  );

  const { data, loading, error, refetch, fetchMore } =
    useQuery<StockMovementsConnectionQuery>(STOCK_MOVEMENTS_CONNECTION, {
      variables: buildSortedConnectionVariables(
        baseVariables,
        sort ?? undefined,
        pagination,
      ),
      skip: !venueId || options?.skip,
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    });

  const connection = data?.stockMovementsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(
        baseVariables,
        sort ?? undefined,
        pagination,
        after,
      ),
    mergeResults: (prev, next) => ({
      ...next,
      stockMovementsConnection: {
        ...next.stockMovementsConnection!,
        edges: mergeConnectionEdges(
          prev.stockMovementsConnection?.edges ?? [],
          next.stockMovementsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    movements: (connectionNodes(connection?.edges) ??
      []) as StockMovementNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}
