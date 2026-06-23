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
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCompactCurrency } from '@/lib/charts/format-currency';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewTopVenuesChartProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewTopVenuesChart({
  data,
}: OwnerFinanceOverviewTopVenuesChartProps) {
  const chartData = useMemo(() => {
    return [...(data.portfolio?.venues ?? [])]
      .sort((a, b) => b.grossRevenue.value - a.grossRevenue.value)
      .slice(0, 5)
      .map((venue) => ({
        label: venue.venueName,
        value: venue.grossRevenue.value,
      }));
  }, [data.portfolio?.venues]);

  if (chartData.length === 0) return null;

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-3 text-sm font-bold">
        Top cơ sở theo doanh thu gộp
      </h3>
      <div className="h-[240px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={CHART_THEME.grid}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => formatCompactCurrency(Number(value))}
            />
            <YAxis
              type="category"
              dataKey="label"
              width={120}
              tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                background: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 12,
                color: CHART_THEME.tooltipText,
              }}
              formatter={(value) => [
                formatCurrency(Number(value)),
                'Doanh thu gộp',
              ]}
            />
            <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassPanel>
  );
}
