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
  useOrdersPendingRefund,
  useVenueOrders,
  type PendingRefundOrderNode,
  type VenueOrderNode,
} from '@/hooks/owner';
import { OrderStatus } from '@/graphql/generated';
import { PAGE_SIZE } from './owner-orders-page.constants';

export function useOwnerOrdersPageData() {
  const { selectedVenueId, loading: venueLoading } = useVenueContext();
  const [viewTab, setViewTab] = useState<'all' | 'pending_refund'>('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const orderFilter = useMemo(() => {
    const statuses =
      statusFilter === 'ALL' ? undefined : ([statusFilter] as OrderStatus[]);
    const trimmed = searchQuery.trim();
    return {
      statuses,
      searchQuery: trimmed || undefined,
    };
  }, [statusFilter, searchQuery]);

  const pagination = { limit: PAGE_SIZE };

  const allOrdersQuery = useVenueOrders(
    selectedVenueId,
    orderFilter,
    pagination,
    { skip: viewTab !== 'all' },
  );

  const pendingRefundQuery = useOrdersPendingRefund(
    selectedVenueId,
    pagination,
    { skip: viewTab !== 'pending_refund' },
  );

  const activeQuery =
    viewTab === 'all' ? allOrdersQuery : pendingRefundQuery;

  return {
    venueId: selectedVenueId,
    venueLoading,
    viewTab,
    setViewTab,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    allOrders: allOrdersQuery.orders as VenueOrderNode[],
    pendingRefundOrders: pendingRefundQuery.orders as PendingRefundOrderNode[],
    orders: activeQuery.orders,
    totalCount: activeQuery.totalCount,
    hasNextPage: activeQuery.hasNextPage,
    loadMore: activeQuery.loadMore,
    loading: activeQuery.loading,
    error: activeQuery.error,
    refetch: activeQuery.refetch,
    refetchAll: () => {
      void allOrdersQuery.refetch();
      void pendingRefundQuery.refetch();
    },
  };
}

export type OwnerOrdersPageData = ReturnType<typeof useOwnerOrdersPageData>;
