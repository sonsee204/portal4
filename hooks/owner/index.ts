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
  VENUE_BOOKINGS_CONNECTION,
  VENUE_REVENUE_STATS,
  BOOKING_STATS,
  VENUE_ANALYTICS,
} from '@/graphql/owner/queries';
import type {
  GetMyVenuesStatsQuery,
  MyVenuesConnectionQuery,
  VenueBookingsConnectionQuery,
  VenueRevenueStatsQuery,
  BookingStatsQuery,
  VenueAnalyticsQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

type MyVenueNode = NonNullable<
  NonNullable<MyVenuesConnectionQuery['myVenuesConnection']>['edges'][number]['node']
>;

type VenueBookingNode = NonNullable<
  NonNullable<
    VenueBookingsConnectionQuery['venueBookingsConnection']
  >['edges'][number]['node']
>;

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

export function useVenueBookings(
  venueId: string | null,
  filter?: { statuses?: string[]; fromDate?: string; toDate?: string },
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueBookingsConnectionQuery>(VENUE_BOOKINGS_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        filter: filter
          ? {
            statuses: filter.statuses,
            fromDate: filter.fromDate,
            toDate: filter.toDate,
          }
          : undefined,
        pagination: { first },
      },
      skip: !venueId || options?.skip,
    });

  const connection = data?.venueBookingsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      filter: filter
        ? {
          statuses: filter.statuses,
          fromDate: filter.fromDate,
          toDate: filter.toDate,
        }
        : undefined,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueBookingsConnection: {
        ...next.venueBookingsConnection!,
        edges: mergeConnectionEdges(
          prev.venueBookingsConnection?.edges ?? [],
          next.venueBookingsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    bookings: (connectionNodes(connection?.edges) ?? []) as VenueBookingNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useVenueRevenueStats(
  venueId: string | null,
  period?: string,
) {
  const { data, loading, error, refetch } = useQuery<VenueRevenueStatsQuery>(
    VENUE_REVENUE_STATS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
  return { stats: data?.venueRevenueStats, loading, error, refetch };
}

export function useBookingStats(
  venueId: string | null,
  fromDate?: string,
  toDate?: string,
) {
  const { data, loading, error, refetch } = useQuery<BookingStatsQuery>(
    BOOKING_STATS,
    {
      variables: { venueId: venueId ?? '', fromDate, toDate },
      skip: !venueId,
    },
  );
  return { stats: data?.bookingStats, loading, error, refetch };
}

export function useVenueAnalytics(
  venueId: string | null,
  period?: string,
) {
  const { data, loading, error, refetch } = useQuery<VenueAnalyticsQuery>(
    VENUE_ANALYTICS,
    {
      variables: { venueId: venueId ?? '', period },
      skip: !venueId,
    },
  );
  return { analytics: data?.venueAnalytics, loading, error, refetch };
}
