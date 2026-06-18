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
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { Badge } from '@/components/atoms/Badge';
import { Input } from '@/components/atoms/Input';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  ORDER_PAYMENT_STATUS_LABEL,
  ORDER_PAYMENT_STATUS_VARIANT,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from '@/lib/constants/order-status';
import type { PendingRefundOrderNode, VenueOrderNode } from '@/hooks/owner';
import {
  ORDER_STATUS_CHIPS,
  ORDER_VIEW_TABS,
} from '../_hooks/owner-orders-page.constants';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import type { OwnerOrdersPageData } from '../_hooks/useOwnerOrdersPageData';
import { OrderRowActions } from '../_components/OrderRowActions';
import { OrderItemsCell } from '../_components/OrderItemsCell';
import { ViewOrderDetailButton } from '../_components/ViewOrderDetailButton';

interface OwnerOrdersTableSectionProps {
  data: OwnerOrdersPageData;
  actions: OwnerOrdersPageActions;
}

function PendingRefundTable({
  orders,
  onOpenDetail,
}: {
  orders: PendingRefundOrderNode[];
  onOpenDetail: (orderId: string) => void;
}) {
  return (
    <DataTable
      columns={[
        { key: 'code', label: 'Mã đơn' },
        { key: 'customer', label: 'Khách' },
        { key: 'refund', label: 'Hoàn tiền' },
        { key: 'payment', label: 'Thanh toán', align: 'center' },
        { key: 'created', label: 'Ngày tạo' },
        { key: 'total', label: 'Số tiền', align: 'right' },
        { key: 'actions', label: 'Thao tác', align: 'right' },
      ]}
      stickyHeader
      className="max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]"
      data={orders}
      emptyTitle="Không có đơn chờ hoàn tiền"
      renderRow={(order) => (
        <tr
          key={order._id}
          className="border-surface-border hover:bg-surface-hover border-b transition-colors"
        >
          <td className="text-body px-4 py-3 font-mono text-sm">
            {order.orderCode}
          </td>
          <td className="text-body px-4 py-3 text-sm">
            {order.customerName ?? '—'}
          </td>
          <td className="px-4 py-3 text-sm font-medium text-amber-400">
            {formatCurrency(order.refundInfo?.refundAmount ?? 0)}
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
            <ViewOrderDetailButton orderId={order._id} onOpen={onOpenDetail} />
          </td>
        </tr>
      )}
    />
  );
}

function AllOrdersTable({
  orders,
  actions,
}: {
  orders: VenueOrderNode[];
  actions: OwnerOrdersPageActions;
}) {
  return (
    <DataTable
      columns={[
        { key: 'code', label: 'Mã đơn' },
        { key: 'customer', label: 'Khách' },
        { key: 'items', label: 'Sản phẩm' },
        { key: 'status', label: 'Trạng thái', align: 'center' },
        { key: 'payment', label: 'Thanh toán', align: 'center' },
        { key: 'created', label: 'Ngày tạo' },
        { key: 'total', label: 'Số tiền', align: 'right' },
        { key: 'actions', label: 'Thao tác', align: 'right' },
      ]}
      stickyHeader
      className="max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]"
      data={orders}
      emptyTitle="Không có đơn hàng"
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
    searchQuery,
    setSearchQuery,
    orders,
    totalCount,
    hasNextPage,
    loading,
    error,
    refetch,
  } = data;

  const {
    handleViewTabChange,
    handleStatusFilterChange,
    handleLoadMore,
    openOrderDetail,
  } = actions;

  const isPendingRefundTab = viewTab === 'pending_refund';

  return (
    <GlassPanel card className="mt-6 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TabGroup
          tabs={ORDER_VIEW_TABS}
          active={viewTab}
          onChange={handleViewTabChange}
        />
        {!isPendingRefundTab && (
          <Input
            className="max-w-xs"
            placeholder="Tìm mã đơn, tên khách..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon="search-outline"
          />
        )}
      </div>

      {!isPendingRefundTab && (
        <FilterChips
          chips={ORDER_STATUS_CHIPS}
          active={statusFilter}
          onChange={handleStatusFilterChange}
        />
      )}

      {isPendingRefundTab ? (
        <VenueActionGate
          ownerOnly
          fallback={
            <p className="text-muted py-8 text-center text-sm">
              Chỉ chủ sân mới xem được danh sách chờ hoàn tiền.
            </p>
          }
        >
          <QueryState
            loading={(loading || venueLoading) && orders.length === 0}
            error={error}
            empty={!loading && !venueId}
            emptyMessage="Chọn cơ sở để xem đơn hàng."
            onRetry={() => void refetch()}
          >
            <PendingRefundTable
              orders={orders as PendingRefundOrderNode[]}
              onOpenDetail={openOrderDetail}
            />
          </QueryState>
          <ConnectionPager
            loadedCount={orders.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            onNext={handleLoadMore}
            loading={loading}
          />
        </VenueActionGate>
      ) : (
        <>
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
            />
          </QueryState>
          <ConnectionPager
            loadedCount={orders.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            onNext={handleLoadMore}
            loading={loading}
          />
        </>
      )}
    </GlassPanel>
  );
}
