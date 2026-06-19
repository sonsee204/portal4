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
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  usePromotionStats,
  useVenuePromotions,
  type VenuePromotionNode,
} from '@/hooks/owner';
import type { PromotionStatus } from '@/graphql/generated';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import {
  PAGE_SIZE,
  type PromotionStatusFilter,
} from './owner-promotions-page.constants';

const PROMOTION_SORT_FIELDS = [
  'createdAt',
  'startDate',
  'endDate',
  'name',
  'value',
  'usageCount',
  'category',
  'status',
] as const;

export function useOwnerPromotionsPageData() {
  const { selectedVenueId, loading: venueLoading, isOwner } = useVenueContext();
  const [statusFilter, setStatusFilter] = useState<PromotionStatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: PROMOTION_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
    // Local sort only — avoid router.replace so the page does not soft-reload.
    syncUrl: false,
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const promotionFilter = useMemo(() => {
    const trimmed = searchQuery.trim();
    return {
      statuses:
        statusFilter === 'all'
          ? undefined
          : ([statusFilter] as PromotionStatus[]),
      searchQuery: trimmed || undefined,
    };
  }, [searchQuery, statusFilter]);

  const pagination = { limit: PAGE_SIZE };

  const promotionsQuery = useVenuePromotions(
    selectedVenueId,
    promotionFilter,
    sort,
    pagination,
  );

  const pendingQuery = useVenuePromotions(
    selectedVenueId,
    { pendingApprovalOnly: true },
    { sortBy: 'createdAt', sortOrder: 'desc' },
    { limit: 50 },
  );

  const { stats, loading: statsLoading, refetch: refetchStats } =
    usePromotionStats(selectedVenueId);

  const sortLoading = promotionsQuery.isRefetching;

  const statusChips = useMemo(() => {
    if (!stats) return undefined;
    return [
      { label: 'Tất cả', value: 'all', count: stats.total },
      { label: 'Đang chạy', value: 'ACTIVE', count: stats.active },
      { label: 'Chờ duyệt', value: 'PENDING_APPROVAL', count: stats.pendingApproval },
      { label: 'Nháp', value: 'DRAFT', count: stats.draft },
      { label: 'Tạm dừng', value: 'PAUSED', count: stats.paused },
      { label: 'Hết hạn', value: 'EXPIRED', count: stats.expired },
      { label: 'Đã hủy', value: 'CANCELLED', count: stats.cancelled },
    ];
  }, [stats]);

  return {
    venueId: selectedVenueId,
    venueLoading,
    isOwner,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    promotions: promotionsQuery.promotions as VenuePromotionNode[],
    pendingPromotions: pendingQuery.promotions as VenuePromotionNode[],
    totalCount: promotionsQuery.totalCount,
    hasNextPage: promotionsQuery.hasNextPage,
    loadMore: promotionsQuery.loadMore,
    isLoadingMore: promotionsQuery.isLoadingMore,
    loading: promotionsQuery.loading,
    pendingLoading: pendingQuery.loading,
    error: promotionsQuery.error,
    refetch: promotionsQuery.refetch,
    refetchPending: pendingQuery.refetch,
    refetchAll: () => {
      void promotionsQuery.refetch();
      void pendingQuery.refetch();
      void refetchStats();
    },
    stats,
    statsLoading,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
    statusChips,
  };
}

export type OwnerPromotionsPageData = ReturnType<
  typeof useOwnerPromotionsPageData
>;
