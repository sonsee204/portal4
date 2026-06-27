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

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TabGroup } from '@/components/molecules/TabGroup';
import { FilterChips } from '@/components/molecules/FilterChips';
import { DateRangePicker } from '@/components/molecules/DateRangePicker';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import type { ConnectionInfiniteScrollProps } from '@/components/molecules/ConnectionInfiniteScroll';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  ORDER_PAYMENT_STATUS_LABEL,
  ORDER_PAYMENT_STATUS_VARIANT,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from '@/lib/constants/order-status';
import type { VenueOrderNode } from '@/hooks/owner';
import {
  ORDER_PAYMENT_STATUS_CHIPS,
  ORDER_STATUS_CHIPS,
  ORDER_VIEW_TABS,
} from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import type { OwnerOrdersPageData } from '../_hooks/useOwnerOrdersPageData';
import { OrderRowActions } from '../_components/OrderRowActions';
import { OrderItemsCell } from '../_components/OrderItemsCell';
import { buildAmountSummariesFromRows } from '@/lib/data-table/amount-summary';

interface OwnerOrdersTableSectionProps {
  data: OwnerOrdersPageData;
  actions: OwnerOrdersPageActions;
}

function AllOrdersTable({
  orders,
  actions,
  infiniteScroll,
  sortField,
  sortDir,
  onSort,
  sortLoading,
  emptyTitle,
}: {
  orders: VenueOrderNode[];
  actions: OwnerOrdersPageActions;
  infiniteScroll?: ConnectionInfiniteScrollProps;
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  sortLoading?: boolean;
  emptyTitle: string;
}) {
  const amountSummaries = useMemo(
    () =>
      buildAmountSummariesFromRows(orders, [
        {
          columnKey: 'total',
          getValue: (order) => order.totalAmount,
          tone: 'positive',
        },
      ]),
    [orders]
  );

  return (
    <DataTable
      columns={[
        { key: 'code', label: 'Mã đơn' },
        { key: 'customer', label: 'Khách' },
        { key: 'items', label: 'Sản phẩm' },
        {
          key: 'status',
          label: 'Trạng thái',
          align: 'center',
          sortable: true,
        },
        { key: 'payment', label: 'Thanh toán', align: 'center' },
        {
          key: 'created',
          label: 'Ngày tạo',
          sortable: true,
          sortField: 'createdAt',
        },
        {
          key: 'total',
          label: 'Số tiền',
          align: 'right',
          sortable: true,
          sortField: 'totalAmount',
        },
        { key: 'actions', label: 'Thao tác', align: 'right' },
      ]}
      stickyHeader
      className="max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]"
      data={orders}
      emptyTitle={emptyTitle}
      infiniteScroll={infiniteScroll}
      sortKey={sortField}
      sortDir={sortDir}
      onSort={onSort}
      sortLoading={sortLoading}
      amountSummaries={amountSummaries}
      renderRow={(order) => (
        <tr
          key={order._id}
          className="border-surface-border hover:bg-surface-hover border-b transition-colors"
        >
          <td className="text-body px-4 py-3 font-mono text-sm">
            {order.orderCode}
          </td>
          <td className="text-body px-4 py-3 text-sm">
            <div>{order.customerName ?? '—'}</div>
            {order.customerPhone && (
              <div className="text-faint text-xs">{order.customerPhone}</div>
            )}
          </td>
          <td className="px-4 py-3">
            <OrderItemsCell order={order} />
          </td>
          <td className="px-4 py-3 text-center">
            <Badge variant={ORDER_STATUS_VARIANT[order.status] ?? 'neutral'}>
              {ORDER_STATUS_LABEL[order.status] ?? order.status}
            </Badge>
          </td>
          <td className="px-4 py-3 text-center">
            <Badge
              variant={
                ORDER_PAYMENT_STATUS_VARIANT[order.paymentStatus] ?? 'neutral'
              }
            >
              {ORDER_PAYMENT_STATUS_LABEL[order.paymentStatus] ??
                order.paymentStatus}
            </Badge>
          </td>
          <td className="text-faint px-4 py-3 text-xs">
            {formatDateTime(order.createdAt)}
          </td>
          <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
            {formatCurrency(order.totalAmount)}
          </td>
          <td className="px-4 py-3 text-right">
            <OrderRowActions order={order} actions={actions} />
          </td>
        </tr>
      )}
    />
  );
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
        <AllOrdersTable
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
