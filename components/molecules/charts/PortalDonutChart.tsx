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
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { cn, formatCurrency } from '@/lib/utils';

export interface PortalDonutChartDatum {
  id?: string;
  label: string;
  value: number;
  percentage?: number;
}

export interface PortalDonutChartProps {
  data: PortalDonutChartDatum[];
  className?: string;
  height?: number;
  valueFormatter?: (value: number) => string;
}

function formatSharePercent(percentage: number): string {
  return `${percentage.toLocaleString('vi-VN', { maximumFractionDigits: 1 })}%`;
}

function resolveSegmentPercentages(
  data: PortalDonutChartDatum[]
): Array<PortalDonutChartDatum & { percentage: number }> {
  const filtered = data.filter((d) => d.value > 0);
  const total = filtered.reduce((sum, d) => sum + d.value, 0);

  return filtered.map((entry) => ({
    ...entry,
    percentage:
      entry.percentage ??
      (total > 0 ? Math.round((entry.value / total) * 1000) / 10 : 0),
  }));
}

export function PortalDonutChart({
  data,
  className,
  height = 280,
  valueFormatter = formatCurrency,
}: PortalDonutChartProps) {
  const segments = useMemo(() => resolveSegmentPercentages(data), [data]);

  if (segments.length === 0) {
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
    <div className={cn('flex w-full flex-col', className)} style={{ height }}>
      <div className="min-h-0 flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              contentStyle={{
                background: CHART_THEME.tooltipBg,
                border: `1px solid ${CHART_THEME.tooltipBorder}`,
                borderRadius: 12,
                color: CHART_THEME.tooltipText,
              }}
              formatter={(value, _name, item) => {
                const payload = item.payload as PortalDonutChartDatum & {
                  percentage: number;
                };
                const amount = Number(value);
                return [
                  `${valueFormatter(amount)} (${formatSharePercent(payload.percentage)})`,
                  payload.label,
                ];
              }}
            />
            <Pie
              data={segments}
              dataKey="value"
              nameKey="label"
              innerRadius="58%"
              outerRadius="82%"
              paddingAngle={2}
            >
              {segments.map((entry, index) => (
                <Cell
                  key={entry.id ?? `${entry.label}-${index}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>

      <ul className="text-muted mt-2 flex shrink-0 flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
        {segments.map((entry, index) => (
          <li
            key={entry.id ?? `${entry.label}-${index}`}
            className="flex items-center gap-1.5"
          >
            <span
              className="inline-block size-2.5 shrink-0 rounded-full"
              style={{
                backgroundColor: CHART_COLORS[index % CHART_COLORS.length],
              }}
            />
            <span className="text-heading font-medium">{entry.label}</span>
            <span>
              {valueFormatter(entry.value)} (
              {formatSharePercent(entry.percentage)})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
