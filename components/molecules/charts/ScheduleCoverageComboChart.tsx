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
import { cn, formatCurrency } from '@/lib/utils';

export interface ScheduleCoveragePoint {
  label: string;
  revenue: number;
  bookingCount: number;
  occupiedSlots: number;
  availableSlots: number;
  occupancyRate: number;
  previousRevenue?: number | null;
  previousOccupancyRate?: number | null;
}

interface ScheduleCoverageComboChartProps {
  data: ScheduleCoveragePoint[];
  className?: string;
  height?: number;
  emptyMessage?: string;
}

function ScheduleCoverageTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{
    payload: ScheduleCoveragePoint;
  }>;
}) {
  if (!active || !payload?.[0]?.payload) {
    return null;
  }

  const point = payload[0].payload;

  return (
    <div
      className="rounded-xl border px-3 py-2 text-xs shadow-lg"
      style={{
        background: CHART_THEME.tooltipBg,
        borderColor: CHART_THEME.tooltipBorder,
        color: CHART_THEME.tooltipText,
      }}
    >
      <p className="text-heading mb-1 font-semibold">{point.label}</p>
      <p>Doanh thu lịch: {formatCurrency(point.revenue)}</p>
      <p className="text-muted mt-1">
        {point.bookingCount} lịch · {point.occupiedSlots}/
        {point.availableSlots} khung giờ · Công suất{' '}
        {point.occupancyRate.toFixed(1)}%
      </p>
      {point.previousRevenue != null ? (
        <p className="text-muted mt-1">
          Kỳ trước: {formatCurrency(point.previousRevenue)}
          {point.previousOccupancyRate != null
            ? ` · ${point.previousOccupancyRate.toFixed(1)}%`
            : null}
        </p>
      ) : null}
    </div>
  );
}

export function ScheduleCoverageComboChart({
  data,
  className,
  height = 300,
  emptyMessage = 'Không có dữ liệu phủ sân trong kỳ.',
}: ScheduleCoverageComboChartProps) {
  const showAllCategoryLabels = data.length > 14;
  const xAxisAngle = showAllCategoryLabels ? -45 : 0;
  const bottomMargin = showAllCategoryLabels ? 48 : 0;

  if (data.length === 0) {
    return (
      <div
        className={cn(
          'text-muted flex items-center justify-center text-sm',
          className
        )}
        style={{ height }}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
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
            tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            interval={showAllCategoryLabels ? 0 : 'preserveStartEnd'}
            angle={xAxisAngle}
            textAnchor={xAxisAngle !== 0 ? 'end' : 'middle'}
            height={showAllCategoryLabels ? 56 : 30}
          />
          <YAxis
            yAxisId="revenue"
            tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={52}
            tickFormatter={(value) => formatCompactCurrency(Number(value))}
          />
          <YAxis
            yAxisId="occupancy"
            orientation="right"
            tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={40}
            domain={[0, 100]}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip content={<ScheduleCoverageTooltip />} />
          <Bar
            yAxisId="revenue"
            dataKey="revenue"
            name="revenue"
            fill={CHART_COLORS[0]}
            radius={[6, 6, 0, 0]}
          />
          <Line
            yAxisId="occupancy"
            type="monotone"
            dataKey="occupancyRate"
            name="occupancyRate"
            stroke={CHART_COLORS[1]}
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}
