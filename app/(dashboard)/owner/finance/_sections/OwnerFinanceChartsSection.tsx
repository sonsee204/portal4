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
import { QueryState } from '@/components/molecules/QueryState';
import {
  PortalAreaChart,
  PortalBarChart,
  PortalDonutChart,
} from '@/components/molecules/charts';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceChartsSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceChartsSection({
  data,
}: OwnerFinanceChartsSectionProps) {
  const trend = useMemo(
    () =>
      (data.report?.trend ?? []).map((point) => ({
        label: point.label,
        value: point.revenue,
        comparisonValue: point.previousRevenue ?? 0,
      })),
    [data.report?.trend],
  );

  const paymentData = useMemo(
    () =>
      (data.report?.byPaymentMethod ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [data.report?.byPaymentMethod],
  );

  const orderTypeData = useMemo(
    () =>
      (data.report?.byOrderType ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [data.report?.byOrderType],
  );

  const expenseData = useMemo(
    () =>
      (data.report?.expenseByCategory ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [data.report?.expenseByCategory],
  );

  const courtData = useMemo(
    () =>
      (data.report?.byCourt ?? []).slice(0, 8).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [data.report?.byCourt],
  );

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem biểu đồ."
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Xu hướng doanh thu
          </h3>
          <PortalAreaChart
            data={trend}
            valueFormatter={(value) => formatCurrency(value)}
            seriesLabel="Doanh thu kỳ này"
            comparisonLabel="Kỳ trước"
          />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Doanh thu theo sân con
          </h3>
          <PortalBarChart
            data={courtData}
            valueFormatter={(value) => formatCurrency(value)}
          />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Theo phương thức thanh toán
          </h3>
          <PortalDonutChart data={paymentData} />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Theo loại đơn
          </h3>
          <PortalDonutChart data={orderTypeData} />
        </GlassPanel>

        {!data.allVenues ? (
          <GlassPanel card className="xl:col-span-2">
            <h3 className="text-heading mb-3 text-sm font-bold">
              Chi phí theo nhóm
            </h3>
            <PortalDonutChart data={expenseData} />
          </GlassPanel>
        ) : null}
      </div>
    </QueryState>
  );
}
