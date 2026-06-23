/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { StockMovementType } from '@/graphql/generated';
import type { StockMovementNode } from '@/hooks/owner';
import { cn, formatCurrency, formatDateTime } from '@/lib/utils';
import {
  ADJUSTMENT_REASON_LABEL,
  formatMovementQuantity,
  isIncomingMovement,
  movementUnitCost,
} from '@/lib/inventory/stock-movement-display';
import type { OwnerStockHistoryPageData } from '../_hooks/useOwnerStockHistoryPageData';
import type { OwnerStockHistoryPageActions } from '../_hooks/useOwnerStockHistoryPageActions';
import { StockMovementTypeBadge } from '../_components/StockMovementTypeBadge';
import { StockMovementProductCell } from '../_components/StockMovementProductCell';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

interface OwnerStockHistoryTableSectionProps {
  data: OwnerStockHistoryPageData;
  actions: OwnerStockHistoryPageActions;
}

function MovementDetailsCell({
  row,
  onOpenOrder,
}: {
  row: StockMovementNode;
  onOpenOrder: (orderId: string) => void;
}) {
  const parts: string[] = [];

  if (row.type === StockMovementType.Import) {
    if (row.supplierName) parts.push(`NCC: ${row.supplierName}`);
    if (row.invoiceNumber) parts.push(`HĐ: ${row.invoiceNumber}`);
  }

  if (
    (row.type === StockMovementType.Sale ||
      row.type === StockMovementType.Return) &&
    row.orderId
  ) {
    return (
      <div className="space-y-1 text-sm">
        <button
          type="button"
          className="text-sky-400 hover:underline"
          onClick={() => onOpenOrder(row.orderId!)}
        >
          Xem đơn hàng
        </button>
        {row.createdByUser?.displayName ? (
          <p className="text-muted text-xs">{row.createdByUser.displayName}</p>
        ) : null}
      </div>
    );
  }

  if (
    (row.type === StockMovementType.AdjustmentAdd ||
      row.type === StockMovementType.AdjustmentSubtract) &&
    row.adjustmentReason
  ) {
    parts.push(
      ADJUSTMENT_REASON_LABEL[row.adjustmentReason] ?? row.adjustmentReason
    );
  }

  if (row.createdByUser?.displayName) {
    parts.push(row.createdByUser.displayName);
  }

  if (parts.length === 0) return <span className="text-muted">—</span>;

  return (
    <div className="space-y-0.5 text-sm">
      {parts.map((part) => (
        <p key={part} className="text-body">
          {part}
        </p>
      ))}
    </div>
  );
}

export function OwnerStockHistoryTableSection({
  data,
  actions,
}: OwnerStockHistoryTableSectionProps) {
  const emptyMessage = data.hasActiveFilters
    ? 'Không có kết quả phù hợp bộ lọc.'
    : 'Chưa có biến động tồn kho trong kỳ.';

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-3 text-sm font-bold">Biến động kho</h3>
      <QueryState
        loading={data.loading && data.movements.length === 0}
        error={data.error}
        empty={!data.selectedVenueId}
        emptyMessage="Chọn sân để xem lịch sử kho."
        onRetry={() => void data.refetchAll()}
      >
        <DataTable
          columns={[
            { key: 'createdAt', label: 'Thời gian' },
            { key: 'type', label: 'Loại' },
            { key: 'product', label: 'Sản phẩm' },
            {
              key: 'quantity',
              label: 'SL',
              align: 'right' as const,
              sortable: true,
            },
            {
              key: 'unitCost',
              label: 'Đơn giá',
              align: 'right' as const,
              sortable: true,
            },
            {
              key: 'newStock',
              label: 'Tồn sau',
              align: 'right' as const,
              sortable: true,
            },
            { key: 'details', label: 'Chi tiết' },
            { key: 'note', label: 'Ghi chú' },
          ]}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={data.movements}
          emptyTitle={emptyMessage}
          sortKey={data.hasActiveSort ? data.tableSort.sortField : undefined}
          sortDir={data.hasActiveSort ? data.tableSort.sortDir : undefined}
          onSort={data.tableSort.handleSort}
          sortLoading={data.sortLoading}
          infiniteScroll={{
            loadedCount: data.movements.length,
            totalCount: data.totalCount,
            hasNextPage: data.hasNextPage,
            onLoadMore: data.loadMore,
            loading: data.loading && data.movements.length === 0,
            loadingMore: data.isLoadingMore,
          }}
          renderRow={(row: StockMovementNode) => {
            const unitCost = movementUnitCost(row);
            const incoming = isIncomingMovement(row.type);

            return (
              <tr
                key={row._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="text-muted px-4 py-3 text-sm whitespace-nowrap">
                  {formatDateTime(row.createdAt)}
                </td>
                <td className="px-4 py-3">
                  <StockMovementTypeBadge type={row.type} />
                </td>
                <td className="px-4 py-3">
                  <StockMovementProductCell
                    product={row.product}
                    onClick={
                      row.productId
                        ? () => actions.openProductDetail(row.productId)
                        : undefined
                    }
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <Badge variant={incoming ? 'success' : 'danger'}>
                    <span
                      className={cn(
                        incoming ? 'text-emerald-300' : 'text-red-300'
                      )}
                    >
                      {formatMovementQuantity(row.type, row.quantity)}
                    </span>
                  </Badge>
                </td>
                <td className="text-muted px-4 py-3 text-right text-sm">
                  {unitCost != null ? formatCurrency(unitCost) : '—'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  {row.newStock ?? '—'}
                </td>
                <td className="px-4 py-3">
                  <MovementDetailsCell
                    row={row}
                    onOpenOrder={actions.openOrder}
                  />
                </td>
                <td className="text-muted max-w-[200px] truncate px-4 py-3 text-sm">
                  {row.note ?? '—'}
                </td>
              </tr>
            );
          }}
        />
      </QueryState>
    </GlassPanel>
  );
}
