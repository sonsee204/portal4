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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TabGroup } from '@/components/molecules/TabGroup';
import { FilterChips } from '@/components/molecules/FilterChips';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { QueryState } from '@/components/molecules/QueryState';
import type { ConnectionInfiniteScrollProps } from '@/components/molecules/ConnectionInfiniteScroll';
import { Input } from '@/components/atoms/Input';
import type { VenueOrderNode } from '@/hooks/owner';
import {
  ORDER_PAYMENT_STATUS_CHIPS,
  ORDER_STATUS_CHIPS,
  ORDER_VIEW_TABS,
} from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import type { OwnerOrdersPageData } from '../_hooks/useOwnerOrdersPageData';
import { OwnerAllOrdersTable } from '../_components/OwnerAllOrdersTable';

interface OwnerOrdersTableSectionProps {
  data: OwnerOrdersPageData;
  actions: OwnerOrdersPageActions;
}

export function OwnerOrdersTableSection({
  data,
  actions,
}: OwnerOrdersTableSectionProps) {
  const {
    venueId,
    venueLoading,
    viewTab,
    statusFilter,
    paymentStatusFilter,
    searchQuery,
    setSearchQuery,
    dateRange,
    handleDateRangeChange,
    orders,
    totalCount,
    hasNextPage,
    isLoadingMore,
    loading,
    error,
    refetch,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
  } = data;

  const {
    handleViewTabChange,
    handleStatusFilterChange,
    handlePaymentStatusFilterChange,
    handleLoadMore,
  } = actions;

  const emptyTitle =
    viewTab === 'booking'
      ? 'Không có đơn đặt sân'
      : viewTab === 'non_booking'
        ? 'Không có đơn không phải đặt sân'
        : 'Không có đơn hàng';

  const infiniteScroll: ConnectionInfiniteScrollProps = {
    loadedCount: orders.length,
    totalCount,
    hasNextPage,
    onLoadMore: handleLoadMore,
    loading: loading && orders.length === 0,
    loadingMore: isLoadingMore,
  };

  return (
    <GlassPanel card className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabGroup
          tabs={ORDER_VIEW_TABS}
          active={viewTab}
          onChange={handleViewTabChange}
        />
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon="search-outline"
          />
          <DateRangePicker
            compact
            label=""
            value={dateRange}
            onChange={handleDateRangeChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <FilterChips
          chips={ORDER_STATUS_CHIPS}
          active={statusFilter}
          onChange={handleStatusFilterChange}
        />
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-faint shrink-0 text-xs font-medium tracking-wide uppercase">
            Thanh toán
          </span>
          <FilterChips
            chips={ORDER_PAYMENT_STATUS_CHIPS}
            active={paymentStatusFilter}
            onChange={handlePaymentStatusFilterChange}
          />
        </div>
      </div>

      <QueryState
        loading={(loading || venueLoading) && orders.length === 0}
        error={error}
        empty={!loading && !venueId}
        emptyMessage="Chọn cơ sở để xem đơn hàng."
        onRetry={() => void refetch()}
      >
        <OwnerAllOrdersTable
          orders={orders as VenueOrderNode[]}
          actions={actions}
          infiniteScroll={infiniteScroll}
          sortField={sortField}
          sortDir={sortDir}
          onSort={handleSort}
          sortLoading={sortLoading}
          emptyTitle={emptyTitle}
        />
      </QueryState>
    </GlassPanel>
  );
}
