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
import { VENUE_PROMOTIONS_CONNECTION } from '@/graphql/owner/promotions';
import type {
  PromotionFilterInput,
  PromotionSortInput,
  VenuePromotionsConnectionQuery,
} from '@/graphql/generated';
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

export type VenuePromotionNode = NonNullable<
  VenuePromotionsConnectionQuery['venuePromotionsConnection']['edges'][number]['node']
>;

type VenuePromotionsConnectionQueryResult = {
  venuePromotionsConnection: VenuePromotionsConnectionQuery['venuePromotionsConnection'];
};

export function useVenuePromotions(
  venueId: string | null,
  filter?: PromotionFilterInput,
  sort?: PromotionSortInput,
  pagination?: LegacyPagePagination,
) {
  const baseVariables = {
    venueId: venueId ?? '',
    filter,
  };

  const { data, previousData, loading, error, refetch, fetchMore } =
    useQuery<VenuePromotionsConnectionQueryResult>(VENUE_PROMOTIONS_CONNECTION, {
      variables: buildSortedConnectionVariables(
        baseVariables,
        sort,
        pagination,
      ),
      skip: !venueId,
      fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
    });

  const effectiveData = data ?? previousData;
  const connection = effectiveData?.venuePromotionsConnection;
  const promotions = connectionNodes(connection?.edges);
  const isInitialLoading = loading && !effectiveData;
  const isRefetching = loading && !!previousData;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data: effectiveData,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables(baseVariables, sort, pagination, after),
    mergeResults: (prev, next) => ({
      ...next,
      venuePromotionsConnection: {
        ...next.venuePromotionsConnection!,
        edges: mergeConnectionEdges(
          prev.venuePromotionsConnection?.edges ?? [],
          next.venuePromotionsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    promotions,
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading: isInitialLoading,
    isRefetching,
    error,
    refetch,
  };
}
