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
import {
  GET_MY_VENUES_STATS,
  MY_VENUES_CONNECTION,
} from '@/graphql/owner/queries';
import type { GetMyVenuesStatsQuery, MyVenuesConnectionQuery } from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import type { MyVenueNode } from './owner-venue.types';

export function useMyVenuesStats() {
  const { data, loading, error, refetch } = useQuery<GetMyVenuesStatsQuery>(
    GET_MY_VENUES_STATS,
  );
  return { stats: data?.myVenuesStats, loading, error, refetch };
}

export function useMyVenues(pagination?: LegacyPagePagination) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<MyVenuesConnectionQuery>(MY_VENUES_CONNECTION, {
      variables: { pagination: { first } },
    });

  const connection = data?.myVenuesConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      myVenuesConnection: {
        ...next.myVenuesConnection!,
        edges: mergeConnectionEdges(
          prev.myVenuesConnection?.edges ?? [],
          next.myVenuesConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    venues: (connectionNodes(connection?.edges) ?? []) as MyVenueNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}
