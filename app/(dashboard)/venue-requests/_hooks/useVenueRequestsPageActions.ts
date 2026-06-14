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

import { useCallback, useMemo } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  GET_ALL_VENUE_REQUESTS,
  GET_VENUE_REQUEST_STATS,
} from '@/graphql/venue-request/queries';
import {
  APPROVE_VENUE_REQUEST,
  REJECT_VENUE_REQUEST,
} from '@/graphql/venue-request/mutations';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import type { VenueRequestsPageData } from './useVenueRequestsPageData';

export function useVenueRequestsPageActions(data: VenueRequestsPageData) {
  const {
    filterVar,
    paginationVar,
    setStatusFilter,
    setSelectedId,
    loadMore,
  } = data;

  const [approveRequest, { loading: approving }] = useMutation(
    APPROVE_VENUE_REQUEST,
    createMutationOptions('ApproveVenueRequest', 'Đã duyệt yêu cầu thành công')
  );

  const [rejectRequest, { loading: rejecting }] = useMutation(
    REJECT_VENUE_REQUEST,
    createMutationOptions('RejectVenueRequest', 'Đã từ chối yêu cầu')
  );

  const refetchAll = useMemo(
    () => [
      {
        query: GET_ALL_VENUE_REQUESTS,
        variables: { status: filterVar, pagination: paginationVar },
      },
      { query: GET_VENUE_REQUEST_STATS },
    ],
    [filterVar, paginationVar]
  );

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value);
      setSelectedId(null);
    },
    [setStatusFilter, setSelectedId]
  );

  const handleApprove = useCallback(
    async (requestId: string, adminNote?: string) => {
      await approveRequest({
        variables: { requestId, adminNote },
        refetchQueries: refetchAll,
      });
    },
    [approveRequest, refetchAll]
  );

  const handleReject = useCallback(
    async (requestId: string, reason: string) => {
      await rejectRequest({
        variables: { requestId, rejectionReason: reason },
        refetchQueries: refetchAll,
      });
    },
    [rejectRequest, refetchAll]
  );

  const handleLoadMore = useCallback(() => {
    void loadMore();
    setSelectedId(null);
  }, [loadMore, setSelectedId]);

  return {
    handleStatusFilterChange,
    handleApprove,
    handleReject,
    handleLoadMore,
    approving,
    rejecting,
  };
}

export type VenueRequestsPageActions = ReturnType<
  typeof useVenueRequestsPageActions
>;
