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

import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCompactCurrency } from '@/lib/charts/format-currency';
import { formatCurrency } from '@/lib/utils';

export interface FinanceTrendPoint {
  label: string;
  revenue: number;
  netProfit: number;
}

interface FinanceTrendComboChartProps {
  data: FinanceTrendPoint[];
  height?: number;
  emptyMessage?: string;
}

export function FinanceTrendComboChart({
  data,
  height = 300,
  emptyMessage = 'Không có dữ liệu xu hướng.',
}: FinanceTrendComboChartProps) {
  if (data.length === 0) {
    return <p className="text-muted text-sm">{emptyMessage}</p>;
  }

  return (
    <div className="w-full" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={data}
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
            width={52}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <Tooltip
            contentStyle={{
              background: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 12,
              color: CHART_THEME.tooltipText,
            }}
            formatter={(value, name) => [
              formatCurrency(Number(value)),
              name === 'revenue' ? 'Doanh thu' : 'Lãi ròng',
            ]}
          />
          <Bar
            dataKey="revenue"
            name="revenue"
            fill={CHART_COLORS[0]}
            radius={[6, 6, 0, 0]}
          />
          <Line
            type="monotone"
            dataKey="netProfit"
            name="netProfit"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
