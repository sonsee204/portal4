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

export function useVenueRequests(
  status?: VenueRequestStatus,
  pagination?: { page: number; limit: number },
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
  });

  return {
    requests: result.items,
    total: result.total,
    hasMore: result.hasMore,
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
