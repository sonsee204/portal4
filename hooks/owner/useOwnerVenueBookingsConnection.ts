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
import { VENUE_BOOKINGS_CONNECTION } from '@/graphql/owner/queries';
import type { VenueBookingsConnectionQuery } from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import type { VenueBookingNode } from './owner-venue.types';

export function useVenueBookings(
  venueId: string | null,
  filter?: {
    statuses?: string[];
    fromDate?: string;
    toDate?: string;
    bookingType?: string;
    searchQuery?: string;
  },
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const graphFilter = filter
    ? {
        statuses: filter.statuses,
        fromDate: filter.fromDate,
        toDate: filter.toDate,
        bookingType: filter.bookingType,
        searchQuery: filter.searchQuery,
      }
    : undefined;

  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueBookingsConnectionQuery>(VENUE_BOOKINGS_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        filter: graphFilter,
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
      filter: graphFilter,
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
