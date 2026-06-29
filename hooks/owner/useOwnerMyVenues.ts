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

import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import {
  GET_MY_VENUES_STATS,
  MY_VENUES_CONNECTION,
  VENUES_CONNECTION,
} from '@/graphql/owner/queries';
import type {
  GetMyVenuesStatsQuery,
  MyVenuesConnectionQuery,
  VenueSortInput,
  VenuesConnectionQuery,
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
import type { MyVenueNode } from './owner-venue.types';

export function useMyVenuesStats() {
  const { data, loading, error, refetch } = useQuery<GetMyVenuesStatsQuery>(
    GET_MY_VENUES_STATS,
  );
  return { stats: data?.myVenuesStats, loading, error, refetch };
}

export function useMyVenues(pagination?: LegacyPagePagination) {
  const { data, loading, error, refetch, fetchMore } =
    useQuery<MyVenuesConnectionQuery>(MY_VENUES_CONNECTION, {
      variables: buildSortedConnectionVariables({}, undefined, pagination),
    });

  const connection = data?.myVenuesConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) =>
      buildSortedConnectionVariables({}, undefined, pagination, after),
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
    isLoadingMore,
    loading,
    error,
    refetch,
  };
}

function dedupeVenues(
  owned: MyVenueNode[],
  staffed: MyVenueNode[],
): MyVenueNode[] {
  const map = new Map<string, MyVenueNode>();
  for (const venue of [...owned, ...staffed]) {
    if (!map.has(venue._id)) {
      map.set(venue._id, venue);
    }
  }
  return Array.from(map.values());
}

/** Owned + staffed venues via venuesConnection with server sort. */
export function useOwnerManagedVenues(
  sort?: VenueSortInput,
  pagination?: LegacyPagePagination,
) {
  const ownedVariables = buildSortedConnectionVariables(
    { filter: { myVenues: true } },
    sort,
    pagination,
  );
  const staffedVariables = buildSortedConnectionVariables(
    { filter: { staffedVenues: true } },
    sort,
    pagination,
  );

  const {
    data: ownedData,
    loading: ownedLoading,
    error: ownedError,
    refetch: refetchOwned,
  } = useQuery<VenuesConnectionQuery>(VENUES_CONNECTION, {
    variables: ownedVariables,
    fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
  });

  const {
    data: staffedData,
    loading: staffedLoading,
    error: staffedError,
    refetch: refetchStaffed,
  } = useQuery<VenuesConnectionQuery>(VENUES_CONNECTION, {
    variables: staffedVariables,
    fetchPolicy: SORTED_CONNECTION_FETCH_POLICY,
  });

  const venues = useMemo(() => {
    const owned = (connectionNodes(ownedData?.venuesConnection?.edges) ??
      []) as MyVenueNode[];
    const staffed = (connectionNodes(staffedData?.venuesConnection?.edges) ??
      []) as MyVenueNode[];
    return dedupeVenues(owned, staffed);
  }, [ownedData, staffedData]);

  const totalCount = Math.max(
    ownedData?.venuesConnection?.totalCount ?? 0,
    staffedData?.venuesConnection?.totalCount ?? 0,
    venues.length,
  );

  return {
    venues,
    totalCount,
    loading: ownedLoading || staffedLoading,
    error: ownedError ?? staffedError,
    refetch: () => {
      void refetchOwned();
      void refetchStaffed();
    },
  };
}
