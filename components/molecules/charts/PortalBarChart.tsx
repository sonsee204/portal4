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
  BarChart as RechartsBarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCompactCurrency } from '@/lib/charts/format-currency';
import { cn, formatCurrency } from '@/lib/utils';

export interface PortalBarChartProps {
  data: Array<{ label: string; value: number }>;
  className?: string;
  height?: number;
  /** Tooltip value formatter — full currency by default. */
  valueFormatter?: (value: number) => string;
  /** Y-axis tick formatter — compact K/M/B by default. */
  axisTickFormatter?: (value: number) => string;
  /** Show every category label on the X axis instead of skipping crowded ticks. */
  showAllCategoryLabels?: boolean;
  /** Rotate X axis labels (degrees). */
  categoryLabelAngle?: number;
}

export function PortalBarChart({
  data,
  className,
  height = 280,
  valueFormatter = formatCurrency,
  axisTickFormatter = formatCompactCurrency,
  showAllCategoryLabels = false,
  categoryLabelAngle = 0,
}: PortalBarChartProps) {
  const xAxisAngle = showAllCategoryLabels ? categoryLabelAngle : 0;
  const bottomMargin = showAllCategoryLabels ? (xAxisAngle !== 0 ? 48 : 24) : 0;
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

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: bottomMargin }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={CHART_THEME.grid}
            vertical={false}
          />
          <XAxis
            dataKey="label"
            interval={showAllCategoryLabels ? 0 : 'preserveStartEnd'}
            angle={xAxisAngle}
            textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
            height={showAllCategoryLabels ? (xAxisAngle !== 0 ? 56 : 32) : 30}
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
            formatter={(value) => [valueFormatter(Number(value)), 'Giá trị']}
          />
          <Bar dataKey="value" radius={[6, 6, 0, 0]} fill={CHART_COLORS[0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
