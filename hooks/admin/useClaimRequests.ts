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
import type { GetClaimRequestsQuery } from '@/graphql/generated';
import type {
  ClaimRequestItem,
  ClaimRequestStatus,
} from '@/app/(dashboard)/claim-requests/types';
import { usePagedConnectionQuery } from '@/hooks/shared/usePagedConnectionQuery';

export function useClaimRequests(
  filter?: { status?: ClaimRequestStatus },
  pagination?: { page: number; limit: number },
) {
  const result = usePagedConnectionQuery<
    GetClaimRequestsQuery,
    ClaimRequestItem,
    { filter?: { status?: ClaimRequestStatus } }
  >({
    query: GET_CLAIM_REQUESTS,
    pagination,
    resetKey: JSON.stringify(filter ?? null),
    variables: { filter },
    getConnection: (data) => data?.claimRequestsConnection,
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

export function useClaimRequestStats() {
  const { data, loading, error, refetch } = useQuery<{
    claimRequestStats: {
      total: number;
      pending: number;
      approved: number;
      rejected: number;
      cancelled: number;
      thisWeek: number;
      thisMonth: number;
    };
  }>(GET_CLAIM_REQUEST_STATS);

  return { stats: data?.claimRequestStats, loading, error, refetch };
}
