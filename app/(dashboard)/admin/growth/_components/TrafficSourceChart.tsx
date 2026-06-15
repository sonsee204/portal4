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

import type { GrowthTrendPoint } from '@/types';

export interface ChartDataPoint {
  organic: number;
  partner: number;
}

interface TrafficSourceChartProps {
  trend?: GrowthTrendPoint[];
  loading: boolean;
}

export function TrafficSourceChart({
  trend,
  loading,
}: TrafficSourceChartProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div className="bg-surface-hover h-6 w-48 animate-pulse rounded" />
          <div className="bg-surface-hover h-4 w-32 animate-pulse rounded" />
        </div>
        <div className="bg-surface-hover h-64 w-full animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!trend || trend.length === 0) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6 shadow-sm">
        <h3 className="text-heading text-lg font-semibold">
          Xu hướng nguồn truy cập
        </h3>
        <div className="text-faint flex h-64 items-center justify-center text-sm">
          Chưa có dữ liệu xu hướng
        </div>
      </div>
    );
  }

  // Convert trend data to percentages for chart rendering
  const maxValue = Math.max(...trend.flatMap((t) => [t.organic, t.partner]), 1);
  const data: ChartDataPoint[] = trend.map((t) => ({
    organic: (t.organic / maxValue) * 100,
    partner: (t.partner / maxValue) * 100,
  }));

  // Use trend labels for X-axis, sampling evenly
  const labelCount = Math.min(7, trend.length);
  const step = Math.max(1, Math.floor(trend.length / labelCount));
  const labels: string[] = [];
  for (let i = 0; i < trend.length; i += step) {
    labels.push(trend[i].label);
  }

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6 shadow-sm">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-heading text-lg font-semibold">
          Xu hướng nguồn truy cập
        </h3>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="bg-toggle-track h-3 w-3 rounded-full" />
            <span className="text-faint">Hữu cơ</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-primary h-3 w-3 rounded-full" />
            <span className="text-faint">Đối tác</span>
          </div>
        </div>
      </div>

      {/* Chart area */}
      <div className="border-surface-border chart-grid relative h-64 w-full rounded-lg border-b border-l">
        {/* Organic bars */}
        <div className="absolute inset-0 flex items-end justify-between px-1 opacity-40">
          {data.map((d, i) => (
            <div
              key={`organic-${i}`}
              className="bg-toggle-track w-[3%] rounded-t"
              style={{ height: `${d.organic}%` }}
            />
          ))}
        </div>

        {/* Partner bars */}
        <div className="blend-adaptive absolute inset-0 flex translate-x-1 items-end justify-between px-1 opacity-80">
          {data.map((d, i) => (
            <div
              key={`partner-${i}`}
              className="bg-primary w-[3%] rounded-t"
              style={{ height: `${d.partner}%` }}
            />
          ))}
        </div>
      </div>

      {/* X-axis labels */}
      <div className="text-faint mt-2 flex justify-between px-1 text-xs">
        {labels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
