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
import { FinanceTrendComboChart } from '../../_components/FinanceTrendComboChart';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewTrendSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewTrendSection({
  data,
}: OwnerFinanceOverviewTrendSectionProps) {
  const trendCombo = useMemo(
    () =>
      (data.report?.trend ?? []).map((point) => ({
        label: point.label,
        revenue: point.revenue,
        netProfit: point.netProfit,
      })),
    [data.report?.trend],
  );

  return (
    <GlassPanel card>
      <QueryState
        loading={data.reportLoading && !data.report}
        error={data.reportError}
        empty={!data.selectedVenueId}
        emptyMessage="Chọn sân để xem xu hướng."
        onRetry={() => void data.refetchReport()}
      >
        <h3 className="text-heading mb-3 text-sm font-bold">
          Doanh thu vs lãi ròng
        </h3>
        <FinanceTrendComboChart data={trendCombo} height={260} />
      </QueryState>
    </GlassPanel>
  );
}
