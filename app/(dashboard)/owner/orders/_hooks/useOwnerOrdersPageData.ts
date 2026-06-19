/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import type { DateRangeValue } from '@/components/molecules/DateRangePicker';
import { useVenueOrders, type VenueOrderNode } from '@/hooks/owner';
import { OrderPaymentStatus, OrderStatus, OrderType } from '@/graphql/generated';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { resolveDateRangePreset } from '@/lib/finance/stat-card-trend';
import {
  NON_BOOKING_ORDER_TYPES,
  PAGE_SIZE,
  type OrderViewTab,
} from './owner-orders-page.constants';

const ORDER_SORT_FIELDS = ['createdAt', 'totalAmount', 'status'] as const;

export function useOwnerOrdersPageData() {
  const { selectedVenueId, loading: venueLoading } = useVenueContext();
  const [viewTab, setViewTab] = useState<OrderViewTab>('all');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [paymentStatusFilter, setPaymentStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<DateRangeValue>(() =>
    resolveDateRangePreset('month'),
  );

  const handleDateRangeChange = useCallback((range: DateRangeValue) => {
    setDateRange(range);
  }, []);

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields: ORDER_SORT_FIELDS,
    defaultField: 'createdAt',
    defaultDir: 'desc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

  const orderFilter = useMemo(() => {
    const statuses =
      statusFilter === 'ALL' ? undefined : ([statusFilter] as OrderStatus[]);
    const paymentStatuses =
      paymentStatusFilter === 'ALL'
        ? undefined
        : ([paymentStatusFilter] as OrderPaymentStatus[]);
    const trimmed = searchQuery.trim();
    return {
      statuses,
      paymentStatuses,
      fromDate: dateRange.from,
      toDate: dateRange.to,
      searchQuery: trimmed || undefined,
      orderType: viewTab === 'booking' ? OrderType.Booking : undefined,
      orderTypes: viewTab === 'non_booking' ? NON_BOOKING_ORDER_TYPES : undefined,
    };
  }, [
    dateRange.from,
    dateRange.to,
    paymentStatusFilter,
    statusFilter,
    searchQuery,
    viewTab,
  ]);

  const pagination = { limit: PAGE_SIZE };

  const ordersQuery = useVenueOrders(
    selectedVenueId,
    orderFilter,
    sort,
    pagination,
  );

  const sortLoading =
    ordersQuery.loading && ordersQuery.orders.length > 0;

  return {
    venueId: selectedVenueId,
    venueLoading,
    viewTab,
    setViewTab,
    statusFilter,
    setStatusFilter,
    paymentStatusFilter,
    setPaymentStatusFilter,
    searchQuery,
    setSearchQuery,
    dateRange,
    handleDateRangeChange,
    orders: ordersQuery.orders as VenueOrderNode[],
    totalCount: ordersQuery.totalCount,
    hasNextPage: ordersQuery.hasNextPage,
    loadMore: ordersQuery.loadMore,
    isLoadingMore: ordersQuery.isLoadingMore,
    loading: ordersQuery.loading,
    error: ordersQuery.error,
    refetch: ordersQuery.refetch,
    refetchAll: () => {
      void ordersQuery.refetch();
    },
    sortField,
    sortDir,
    handleSort,
    sortLoading,
  };
}

export type OwnerOrdersPageData = ReturnType<typeof useOwnerOrdersPageData>;
