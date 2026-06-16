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

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { cn } from '@/lib/utils';

export interface PortalDonutChartProps {
  data: Array<{ label: string; value: number }>;
  className?: string;
  height?: number;
}

export function PortalDonutChart({
  data,
  className,
  height = 280,
}: PortalDonutChartProps) {
  const filtered = data.filter((d) => d.value > 0);

  if (filtered.length === 0) {
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
        <PieChart>
          <Tooltip
            contentStyle={{
              background: CHART_THEME.tooltipBg,
              border: `1px solid ${CHART_THEME.tooltipBorder}`,
              borderRadius: 12,
              color: CHART_THEME.tooltipText,
            }}
          />
          <Pie
            data={filtered}
            dataKey="value"
            nameKey="label"
            innerRadius="58%"
            outerRadius="82%"
            paddingAngle={2}
          >
            {filtered.map((entry, index) => (
              <Cell
                key={entry.label}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
