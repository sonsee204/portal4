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
  GET_ALL_VENUE_REQUESTS,
  GET_VENUE_REQUEST_STATS,
} from '@/graphql/queries/venue-requests';
import type { GetAllVenueRequestsQuery } from '@/graphql/generated';
import type {
  VenueRequestItem,
  VenueRequestStatus,
} from '@/app/(dashboard)/venue-requests/types';
import { usePagedConnectionQuery } from '@/hooks/shared/usePagedConnectionQuery';
import { mergeConnectionEdges, type LegacyPagePagination } from '@/hooks/shared/useCursorConnection';

export function useVenueRequests(
  status?: VenueRequestStatus,
  pagination?: LegacyPagePagination,
) {
  const result = usePagedConnectionQuery<
    GetAllVenueRequestsQuery,
    VenueRequestItem,
    { status?: VenueRequestStatus }
  >({
    query: GET_ALL_VENUE_REQUESTS,
    pagination,
    resetKey: JSON.stringify(status ?? null),
    variables: { status },
    getConnection: (data) => data?.allVenueRequestsConnection,
    mergeConnection: (prev, next) => ({
      ...next,
      allVenueRequestsConnection: {
        ...next.allVenueRequestsConnection!,
        edges: mergeConnectionEdges(
          prev.allVenueRequestsConnection?.edges ?? [],
          next.allVenueRequestsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    requests: result.items,
    total: result.total,
    totalCount: result.totalCount,
    hasMore: result.hasMore,
    hasNextPage: result.hasNextPage,
    loadMore: result.loadMore,
    loading: result.loading,
    error: result.error,
    refetch: result.refetch,
  };
}

export function useVenueRequestStats() {
  const { data, loading, error, refetch } = useQuery<{
    venueRequestStats: {
      totalRequests: number;
      pendingRequests: number;
      approvedRequests: number;
      rejectedRequests: number;
    };
  }>(GET_VENUE_REQUEST_STATS);

  return { stats: data?.venueRequestStats, loading, error, refetch };
}
