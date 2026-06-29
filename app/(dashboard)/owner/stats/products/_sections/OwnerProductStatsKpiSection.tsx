/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { StatCard } from '@/components/molecules/StatCard';
import { QueryState } from '@/components/molecules/QueryState';
import { formatCurrency } from '@/lib/utils';
import { toStatCardTrend } from '@/lib/finance/stat-card-trend';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';

interface OwnerProductStatsKpiSectionProps {
  data: OwnerProductStatsPageData;
}

export function OwnerProductStatsKpiSection({
  data,
}: OwnerProductStatsKpiSectionProps) {
  const summary = data.report?.summary;
  const inventory = data.report?.inventory;
  const inventoryStatus = data.report?.inventoryStatus;

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem chỉ số."
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          icon="cash-outline"
          iconColor="text-emerald-400"
          label="Doanh thu sản phẩm"
          hint="Ghi nhận khi đơn hoàn thành"
          value={formatCurrency(summary?.totalRevenue ?? 0)}
          signedValue={summary?.totalRevenue ?? 0}
          trend={toStatCardTrend(
            summary?.revenueChangePercent,
            summary?.previousRevenue
          )}
        />
        <StatCard
          icon="trending-up-outline"
          iconColor="text-emerald-400"
          label="Lãi gộp"
          hint={`Biên ${(summary?.grossProfitMarginPercent ?? 0).toFixed(1)}%`}
          value={formatCurrency(summary?.grossProfit ?? 0)}
          signedValue={summary?.grossProfit ?? 0}
          trend={toStatCardTrend(
            summary?.grossProfitChangePercent,
            summary?.previousGrossProfit
          )}
        />
        <StatCard
          icon="cube-outline"
          iconColor="text-sky-400"
          label="Sản phẩm đã bán"
          value={String(summary?.totalItemsSold ?? 0)}
          trend={toStatCardTrend(
            summary?.itemsChangePercent,
            summary?.previousItemsSold
          )}
        />
        <StatCard
          icon="receipt-outline"
          iconColor="text-violet-400"
          label="Đơn có sản phẩm"
          value={String(summary?.totalOrders ?? 0)}
          trend={toStatCardTrend(
            summary?.ordersChangePercent,
            summary?.previousOrders
          )}
        />
        <StatCard
          icon="layers-outline"
          iconColor="text-amber-400"
          label="Giá trị tồn kho"
          hint="Theo giá bán lẻ"
          value={formatCurrency(inventory?.totalStockValue ?? 0)}
        />
        <StatCard
          icon="alert-circle-outline"
          iconColor="text-orange-400"
          label="Cảnh báo tồn kho"
          value={String(
            (inventoryStatus?.lowStockProducts ?? 0) +
              (inventoryStatus?.outOfStockProducts ?? 0)
          )}
          badge={
            inventoryStatus
              ? {
                  text: `${inventoryStatus.outOfStockProducts} hết · ${inventoryStatus.lowStockProducts} thấp`,
                  variant:
                    inventoryStatus.outOfStockProducts > 0
                      ? 'danger'
                      : 'warning',
                }
              : undefined
          }
        />
      </div>
    </QueryState>
  );
}
