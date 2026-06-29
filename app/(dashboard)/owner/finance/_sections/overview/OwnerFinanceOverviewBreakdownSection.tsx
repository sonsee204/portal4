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
  PortalBarChart,
  PortalDonutChart,
} from '@/components/molecules/charts';
import { aggregateRevenueByCourt } from '@/lib/finance/aggregate-court-revenue';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewBreakdownSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewBreakdownSection({
  data,
}: OwnerFinanceOverviewBreakdownSectionProps) {
  const paymentData = useMemo(
    () =>
      (data.report?.byPaymentMethod ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [data.report?.byPaymentMethod]
  );

  const courtData = useMemo(
    () =>
      aggregateRevenueByCourt(
        (data.report?.byCourt ?? []).map((item) => ({
          label: item.label,
          revenue: item.revenue,
        }))
      ).slice(0, 5),
    [data.report?.byCourt]
  );

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.selectedVenueId}
      emptyMessage=""
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-6 md:grid-cols-2">
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Theo phương thức thanh toán
          </h3>
          <PortalDonutChart data={paymentData} height={220} />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Top sân con theo doanh thu
          </h3>
          <PortalBarChart
            data={courtData}
            height={220}
            showAllCategoryLabels
            valueFormatter={(value) => formatCurrency(value)}
          />
        </GlassPanel>
      </div>
    </QueryState>
  );
}
