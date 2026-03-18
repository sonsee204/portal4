'use client';

import { useQuery } from '@apollo/client/react';
import {
  GET_ALL_VENUE_REQUESTS,
  GET_VENUE_REQUEST_STATS,
} from '@/graphql/queries/venue-requests';
import type {
  VenueRequestItem,
  VenueRequestStatus,
} from '@/app/(dashboard)/venue-requests/types';

interface VenueRequestsQueryData {
  allVenueRequests: {
    requests: VenueRequestItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface VenueRequestStatsQueryData {
  venueRequestStats: {
    totalRequests: number;
    pendingRequests: number;
    approvedRequests: number;
    rejectedRequests: number;
  };
}

export function useVenueRequests(
  status?: VenueRequestStatus,
  pagination?: { page: number; limit: number },
) {
  const { data, loading, error, refetch } = useQuery<VenueRequestsQueryData>(
    GET_ALL_VENUE_REQUESTS,
    {
      variables: { status, pagination },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    requests: data?.allVenueRequests?.requests ?? [],
    total: data?.allVenueRequests?.total ?? 0,
    hasMore: data?.allVenueRequests?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function useVenueRequestStats() {
  const { data, loading, error, refetch } =
    useQuery<VenueRequestStatsQueryData>(GET_VENUE_REQUEST_STATS);

  return {
    stats: data?.venueRequestStats,
    loading,
    error,
    refetch,
  };
}
