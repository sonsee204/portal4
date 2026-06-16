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
  const report = data.report;

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
          icon="checkmark-done-outline"
          iconColor="text-emerald-400"
          label="Đơn hoàn thành"
          hint="Status completed — ghi nhận doanh thu gộp"
          value={String(report?.completedOrders ?? 0)}
          badge={
            report && report.totalOrders > 0
              ? {
                  text: `${report.completionRate.toFixed(1)}% tổng đơn`,
                  variant: 'success',
                }
              : undefined
          }
        />
        <StatCard
          icon="time-outline"
          iconColor="text-amber-400"
          label="Đơn đang xử lý"
          hint="Confirmed / pending — chưa ghi doanh thu"
          value={String(report?.pipelineOrders ?? 0)}
          badge={
            report && report.pipelineGrossValue > 0
              ? {
                  text: formatCurrency(report.pipelineGrossValue),
                  variant: 'warning',
                }
              : undefined
          }
        />
        <StatCard
          icon="cash-outline"
          iconColor="text-emerald-400"
          label="Đã thu"
          hint="Tiền thực nhận trong kỳ"
          value={formatCurrency(pnl?.collected.value ?? 0)}
          trend={toStatCardTrend(pnl?.collected.changePercent)}
        />
        <StatCard
          icon="hourglass-outline"
          iconColor="text-orange-400"
          label="Còn phải thu"
          hint="Phần chưa thu của đơn pipeline"
          value={formatCurrency(pnl?.outstanding.value ?? 0)}
          trend={toStatCardTrend(pnl?.outstanding.changePercent)}
        />
        <StatCard
          icon="bar-chart-outline"
          iconColor="text-violet-400"
          label="Doanh thu gộp"
          hint="Tổng đơn completed trong kỳ"
          value={formatCurrency(pnl?.grossRevenue.value ?? 0)}
          trend={toStatCardTrend(pnl?.grossRevenue.changePercent)}
        />
        <StatCard
          icon="return-down-back-outline"
          iconColor="text-red-400"
          label="Hoàn tiền"
          value={formatCurrency(pnl?.refunds.value ?? 0)}
          trend={toStatCardTrend(pnl?.refunds.changePercent)}
        />
        <StatCard
          icon="receipt-outline"
          iconColor="text-sky-400"
          label="Tổng đơn tạo mới"
          hint="Đơn tạo trong kỳ (mọi trạng thái)"
          value={String(report?.totalOrders ?? 0)}
        />
        <StatCard
          icon="pricetag-outline"
          iconColor="text-blue-400"
          label="TB/đơn hoàn thành"
          hint="Doanh thu gộp ÷ đơn completed"
          value={formatCurrency(report?.averageOrderValue ?? 0)}
        />
      </div>

      {(report?.pendingBookingRevenue ?? 0) > 0 ? (
        <div className="mt-4">
          <StatCard
            icon="calendar-outline"
            iconColor="text-orange-400"
            label="Dự kiến (booking pending)"
            hint="Booking chưa sinh order"
            value={formatCurrency(report?.pendingBookingRevenue ?? 0)}
            className="max-w-sm"
          />
        </div>
      ) : null}
    </QueryState>
  );
}
