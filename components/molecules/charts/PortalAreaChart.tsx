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
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { cn } from '@/lib/utils';

export interface PortalAreaChartPoint {
  label: string;
  value: number;
  comparisonValue?: number;
}

export interface PortalAreaChartProps {
  data: PortalAreaChartPoint[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
  seriesLabel?: string;
  comparisonLabel?: string;
}

export function PortalAreaChart({
  data,
  className,
  height = 280,
  valueFormatter = (v) => String(v),
  seriesLabel = 'Kỳ hiện tại',
  comparisonLabel = 'Kỳ trước',
}: PortalAreaChartProps) {
  if (data.length === 0) {
    return (
      <div
        className={cn(
          'text-muted flex items-center justify-center text-sm',
          className,
        )}
        style={{ height }}
      >
        Không có dữ liệu
      </div>
    );
  }

  const hasComparison = data.some(
    (point) => point.comparisonValue != null && point.comparisonValue > 0,
  );

  return (
    <div className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="portalAreaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={CHART_THEME.primary}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={CHART_THEME.primary}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
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
            width={56}
            tickFormatter={valueFormatter}
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
          <Area
            type="monotone"
            dataKey="value"
            name="value"
            stroke={CHART_THEME.primary}
            strokeWidth={2}
            fill="url(#portalAreaGradient)"
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
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
}
