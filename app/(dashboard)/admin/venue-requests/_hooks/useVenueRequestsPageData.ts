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

import { useMemo, useState } from 'react';
import { useVenueRequests, useVenueRequestStats } from '@/hooks/admin';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import type { VenueRequestStatus } from '../types';
import { PAGE_SIZE } from './venue-requests-page.constants';

const VENUE_REQUEST_SORT_FIELDS = ['createdAt', 'status'] as const;

export function useVenueRequestsPageData() {
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: VENUE_REQUEST_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const filterVar =
    statusFilter === 'ALL' ? undefined : (statusFilter as VenueRequestStatus);

  const paginationVar = { limit: PAGE_SIZE };

  const {
    requests,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading: requestsLoading,
    error: requestsError,
    refetch: refetchRequests,
  } = useVenueRequests(filterVar, paginationVar, sort);

  const { stats } = useVenueRequestStats();

  const effectiveId =
    requests.find((r) => r._id === selectedId)?._id ?? requests[0]?._id ?? null;
  const selectedRequest = effectiveId
    ? requests.find((r) => r._id === effectiveId)
    : undefined;

  return {
    statusFilter,
    setStatusFilter,
    selectedId,
    setSelectedId,
    filterVar,
    paginationVar,
    sortField,
    sortDir,
    handleSort,
    requests,
    total,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    requestsLoading,
    requestsError,
    refetchRequests,
    stats,
    effectiveId,
    selectedRequest,
  };
}

export type VenueRequestsPageData = ReturnType<typeof useVenueRequestsPageData>;
