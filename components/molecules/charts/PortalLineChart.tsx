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
  CartesianGrid,
  Line,
  LineChart as RechartsLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCompactCurrency } from '@/lib/charts/format-currency';
import { cn, formatCurrency } from '@/lib/utils';

export interface PortalLineChartPoint {
  label: string;
  value: number;
  comparisonValue?: number;
}

export interface PortalLineChartProps {
  data: PortalLineChartPoint[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  axisTickFormatter?: (value: number) => string;
  seriesLabel?: string;
  comparisonLabel?: string;
}

export function PortalLineChart({
  data,
  className,
  height = 280,
  valueFormatter = formatCurrency,
  axisTickFormatter = formatCompactCurrency,
  seriesLabel = 'Kỳ hiện tại',
  comparisonLabel = 'Kỳ trước',
}: PortalLineChartProps) {
  if (data.length === 0) {
    return (
      <div
        className={cn(
          'text-muted flex items-center justify-center text-sm',
          className
        )}
        style={{ height }}
      >
        Không có dữ liệu
      </div>
    );
  }

  const hasComparison = data.some(
    (point) => point.comparisonValue != null && point.comparisonValue > 0
  );

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
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
            tickFormatter={(value) => axisTickFormatter(Number(value))}
          />
          <Tooltip
            contentStyle={{
              background: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 12,
              color: CHART_THEME.tooltipText,
            }}
            formatter={(value, name) => [
              valueFormatter(Number(value)),
              String(name) === 'value' ? seriesLabel : comparisonLabel,
            ]}
          />
          <Line
            type="monotone"
            dataKey="value"
            name="value"
            stroke={CHART_THEME.primary}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_THEME.primary }}
            activeDot={{ r: 5 }}
          />
          {hasComparison ? (
            <Line
              type="monotone"
              dataKey="comparisonValue"
              name="comparisonValue"
              stroke={CHART_COLORS[2]}
              strokeWidth={2}
              strokeDasharray="6 4"
              dot={false}
            />
          ) : null}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
