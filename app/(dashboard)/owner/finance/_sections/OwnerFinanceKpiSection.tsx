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

import { StatCard } from '@/components/molecules/StatCard';
import { QueryState } from '@/components/molecules/QueryState';
import { formatCurrency } from '@/lib/utils';
import { toStatCardTrend } from '@/lib/finance/stat-card-trend';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceKpiSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceKpiSection({ data }: OwnerFinanceKpiSectionProps) {
  const pnl = data.report?.pnl;

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem KPI."
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="cash-outline"
          iconColor="text-emerald-400"
          label="Đã thu"
          value={formatCurrency(pnl?.collected.value ?? 0)}
          trend={toStatCardTrend(pnl?.collected.changePercent)}
        />
        <StatCard
          icon="hourglass-outline"
          iconColor="text-amber-400"
          label="Còn phải thu"
          value={formatCurrency(pnl?.outstanding.value ?? 0)}
          trend={toStatCardTrend(pnl?.outstanding.changePercent)}
        />
        <StatCard
          icon="return-down-back-outline"
          iconColor="text-red-400"
          label="Hoàn tiền"
          value={formatCurrency(pnl?.refunds.value ?? 0)}
          trend={toStatCardTrend(pnl?.refunds.changePercent)}
        />
        <StatCard
          icon="trending-up-outline"
          iconColor="text-violet-400"
          label="Doanh thu thuần"
          value={formatCurrency(pnl?.netRevenue.value ?? 0)}
          trend={toStatCardTrend(pnl?.netRevenue.changePercent)}
        />
        <StatCard
          icon="receipt-outline"
          iconColor="text-sky-400"
          label="Tổng đơn"
          value={String(data.report?.totalOrders ?? 0)}
        />
        <StatCard
          icon="checkmark-circle-outline"
          iconColor="text-emerald-400"
          label="Hoàn thành"
          value={String(data.report?.completedOrders ?? 0)}
          badge={
            data.report
              ? {
                  text: `${data.report.completionRate.toFixed(1)}%`,
                  variant: 'success',
                }
              : undefined
          }
        />
        <StatCard
          icon="pricetag-outline"
          iconColor="text-blue-400"
          label="Giá trị TB/đơn"
          value={formatCurrency(data.report?.averageOrderValue ?? 0)}
        />
        <StatCard
          icon="calendar-outline"
          iconColor="text-orange-400"
          label="Dự kiến (booking pending)"
          value={formatCurrency(data.report?.pendingBookingRevenue ?? 0)}
        />
      </div>
    </QueryState>
  );
}
