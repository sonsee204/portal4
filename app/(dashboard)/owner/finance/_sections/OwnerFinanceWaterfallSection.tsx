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
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceWaterfallSectionProps {
  data: OwnerFinancePageData;
}

interface WaterfallStep {
  label: string;
  value: number;
  display: number;
  kind: 'positive' | 'negative' | 'subtotal';
}

export function OwnerFinanceWaterfallSection({
  data,
}: OwnerFinanceWaterfallSectionProps) {
  const chartData = useMemo(() => {
    const pnl = data.report?.pnl;
    if (!pnl) return [] as WaterfallStep[];

    const grossRevenue = pnl.grossRevenue.value;
    const cogs = pnl.cogs.value;
    const grossProfit = pnl.grossProfit.value;
    const operatingExpenses = pnl.operatingExpenses.value;
    const netProfit = pnl.netProfit.value;

    return [
      {
        label: 'DT gộp',
        value: grossRevenue,
        display: grossRevenue,
        kind: 'positive' as const,
      },
      {
        label: 'Giá vốn',
        value: -cogs,
        display: cogs,
        kind: 'negative' as const,
      },
      {
        label: 'LN gộp',
        value: grossProfit,
        display: grossProfit,
        kind: 'subtotal' as const,
      },
      {
        label: 'Chi phí VH',
        value: -operatingExpenses,
        display: operatingExpenses,
        kind: 'negative' as const,
      },
      {
        label: 'LN ròng',
        value: netProfit,
        display: netProfit,
        kind: 'subtotal' as const,
      },
    ];
  }, [data.report?.pnl]);

  const barColors = chartData.map((step) => {
    if (step.kind === 'negative') return CHART_COLORS[4];
    if (step.kind === 'subtotal') {
      return step.value >= 0 ? CHART_COLORS[1] : CHART_COLORS[4];
    }
    return CHART_COLORS[0];
  });

  return (
    <GlassPanel card>
      <div className="mb-4">
        <h3 className="text-heading text-base font-bold">Biểu đồ thác P&L</h3>
        <p className="text-muted mt-1 text-sm">
          Doanh thu gộp → giá vốn → lợi nhuận gộp → chi phí vận hành → lãi ròng.
        </p>
      </div>

      <QueryState
        loading={data.reportLoading && !data.report}
        error={data.reportError}
        empty={!data.allVenues && !data.selectedVenueId}
        emptyMessage="Chọn sân để xem biểu đồ thác."
        onRetry={() => void data.refetchReport()}
      >
        {chartData.length > 0 ? (
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={CHART_THEME.grid}
                  vertical={false}
                />
                <XAxis
                  dataKey="label"
                  tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={64}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />
                <ReferenceLine y={0} stroke={CHART_THEME.grid} />
                <Tooltip
                  contentStyle={{
                    background: CHART_THEME.tooltipBg,
                    border: `1px solid ${CHART_THEME.tooltipBorder}`,
                    borderRadius: 12,
                    color: CHART_THEME.tooltipText,
                  }}
                  formatter={(_, __, payload) => {
                    const step = payload?.payload as WaterfallStep | undefined;
                    if (!step) return ['—', ''];
                    return [formatCurrency(step.display), step.label];
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((step, index) => (
                    <Cell key={step.label} fill={barColors[index]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </QueryState>
    </GlassPanel>
  );
}
