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
import { DataTable } from '@/components/organisms/DataTable';
import type { ConnectionInfiniteScrollProps } from '@/components/molecules/ConnectionInfiniteScroll';
import { Badge } from '@/components/atoms/Badge';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import {
  ORDER_PAYMENT_STATUS_LABEL,
  ORDER_PAYMENT_STATUS_VARIANT,
  ORDER_STATUS_LABEL,
  ORDER_STATUS_VARIANT,
} from '@/lib/constants/order-status';
import type { VenueOrderNode } from '@/hooks/owner';
import { buildAmountSummariesFromRows } from '@/lib/data-table/amount-summary';
import type { OwnerOrdersPageActions } from '../_hooks/useOwnerOrdersPageActions';
import { OrderRowActions } from './OrderRowActions';
import { OrderItemsCell } from './OrderItemsCell';

interface OwnerAllOrdersTableProps {
  orders: VenueOrderNode[];
  actions: OwnerOrdersPageActions;
  infiniteScroll?: ConnectionInfiniteScrollProps;
  sortField: string;
  sortDir: 'asc' | 'desc';
  onSort: (field: string) => void;
  sortLoading?: boolean;
  emptyTitle: string;
}

export function OwnerAllOrdersTable({
  orders,
  actions,
  infiniteScroll,
  sortField,
  sortDir,
  onSort,
  sortLoading,
  emptyTitle,
}: OwnerAllOrdersTableProps) {
  const amountSummaries = useMemo(
    () =>
      buildAmountSummariesFromRows(orders, [
        {
          columnKey: 'total',
          getValue: (order) => order.totalAmount,
          tone: 'positive',
        },
      ]),
    [orders],
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
