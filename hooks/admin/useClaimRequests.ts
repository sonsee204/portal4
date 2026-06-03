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
  GET_CLAIM_REQUESTS,
  GET_CLAIM_REQUEST_STATS,
} from '@/graphql/queries/claim-requests';
import type {
  ClaimRequestItem,
  ClaimRequestStatus,
} from '@/app/(dashboard)/claim-requests/types';

interface ClaimRequestsFilter {
  status?: ClaimRequestStatus;
}

interface ClaimRequestsQueryData {
  claimRequests: {
    requests: ClaimRequestItem[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

interface ClaimStatsQueryData {
  claimRequestStats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    cancelled: number;
    thisWeek: number;
    thisMonth: number;
  };
}

export function useClaimRequests(
  filter?: ClaimRequestsFilter,
  pagination?: { page: number; limit: number },
) {
  const { data, loading, error, refetch } = useQuery<ClaimRequestsQueryData>(
    GET_CLAIM_REQUESTS,
    {
      variables: { filter, pagination },
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    requests: data?.claimRequests?.requests ?? [],
    total: data?.claimRequests?.total ?? 0,
    hasMore: data?.claimRequests?.hasMore ?? false,
    loading,
    error,
    refetch,
  };
}

export function useClaimRequestStats() {
  const { data, loading, error, refetch } =
    useQuery<ClaimStatsQueryData>(GET_CLAIM_REQUEST_STATS);

  return {
    stats: data?.claimRequestStats,
    loading,
    error,
    refetch,
  };
}
