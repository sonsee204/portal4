/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import Link from 'next/link';
import { QueryState } from '@/components/molecules/QueryState';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { StockMovementType } from '@/graphql/generated';
import { useStockMovementsConnection } from '@/hooks/owner';
import { cn, formatCurrency, formatDateTime } from '@/lib/utils';
import {
  formatMovementQuantity,
  isIncomingMovement,
  movementUnitCost,
} from '@/lib/inventory/stock-movement-display';
import { StockMovementTypeBadge } from '@/app/(dashboard)/owner/inventory/history/_components/StockMovementTypeBadge';

interface ProductDetailMovementsPanelProps {
  venueId: string | null;
  productId: string | null;
  enabled: boolean;
  importOnly?: boolean;
  showViewAllLink?: boolean;
}

export function ProductDetailMovementsPanel({
  venueId,
  productId,
  enabled,
  importOnly = false,
  showViewAllLink = true,
}: ProductDetailMovementsPanelProps) {
  const {
    movements,
    loading,
    error,
    refetch,
    hasNextPage,
    loadMore,
    isLoadingMore,
  } = useStockMovementsConnection(
    venueId,
    {
      productId: productId ?? undefined,
      ...(importOnly ? { types: [StockMovementType.Import] } : {}),
    },
    undefined,
    { first: 20 },
    { skip: !enabled || !venueId || !productId },
  );

  return (
    <div className="space-y-3">
      <QueryState
        loading={loading && movements.length === 0}
        error={error}
        empty={movements.length === 0}
        emptyMessage="Chưa có lịch sử."
        onRetry={() => void refetch()}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-muted border-b border-white/10 text-left">
                <th className="px-2 py-2">Thời gian</th>
                <th className="px-2 py-2">Loại</th>
                <th className="px-2 py-2 text-right">SL</th>
                <th className="px-2 py-2 text-right">Giá</th>
                <th className="px-2 py-2 text-right">Tồn sau</th>
              </tr>
            </thead>
            <tbody>
              {movements.map((row) => {
                const unitCost = movementUnitCost(row);
                const incoming = isIncomingMovement(row.type);

                return (
                  <tr key={row._id} className="border-b border-white/5">
                    <td className="px-2 py-2 whitespace-nowrap">
                      {formatDateTime(row.createdAt)}
                    </td>
                    <td className="px-2 py-2">
                      <StockMovementTypeBadge type={row.type} />
                    </td>
                    <td className="px-2 py-2 text-right">
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
                    <td className="px-2 py-2 text-right">
                      {unitCost != null ? formatCurrency(unitCost) : '—'}
                    </td>
                    <td className="px-2 py-2 text-right">
                      {row.newStock ?? '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {hasNextPage ? (
          <Button
            variant="ghost"
            size="sm"
            disabled={isLoadingMore}
            onClick={() => void loadMore()}
          >
            {isLoadingMore ? 'Đang tải...' : 'Tải thêm'}
          </Button>
        ) : null}
      </QueryState>

      {showViewAllLink && productId ? (
        <Link
          href={`/owner/inventory/history?productId=${productId}`}
          className="text-sm text-emerald-400 hover:underline"
        >
          Xem toàn bộ →
        </Link>
      ) : null}
    </div>
  );
}
