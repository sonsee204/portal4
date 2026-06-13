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

import type { QrScanTrendPoint } from '@/types';

interface QrScanTrendChartProps {
  trend?: QrScanTrendPoint[];
  loading: boolean;
}

export function QrScanTrendChart({ trend, loading }: QrScanTrendChartProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <div className="bg-surface-hover mb-4 h-5 w-40 animate-pulse rounded" />
        <div className="bg-surface-hover h-48 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!trend || trend.length === 0) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <h3 className="text-heading mb-4 text-sm font-semibold">
          Xu hướng quét theo ngày
        </h3>
        <div className="text-faint flex h-48 items-center justify-center text-sm">
          Chưa có dữ liệu
        </div>
      </div>
    );
  }

  const maxTotal = Math.max(...trend.map((p) => p.total), 1);

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-heading text-sm font-semibold">
          Xu hướng quét theo ngày
        </h3>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-slate-500" />
            iOS
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Android
          </span>
        </div>
      </div>

      <div className="flex h-48 items-end gap-1 overflow-x-auto pb-2">
        {trend.map((point) => (
          <div
            key={point.label}
            className="group relative flex min-w-[20px] flex-1 flex-col items-center justify-end gap-0.5"
            title={`${point.label}: ${point.total} lượt`}
          >
            {/* Stacked bar: iOS on top of Android */}
            <div className="flex w-full flex-col items-center gap-0.5">
              {point.ios > 0 && (
                <div
                  className="w-full rounded-t bg-slate-400 transition-all"
                  style={{ height: `${(point.ios / maxTotal) * 160}px` }}
                />
              )}
              {point.android > 0 && (
                <div
                  className="w-full bg-emerald-400 transition-all"
                  style={{ height: `${(point.android / maxTotal) * 160}px` }}
                />
              )}
              {point.total - point.ios - point.android > 0 && (
                <div
                  className="w-full rounded-b bg-gray-300 transition-all"
                  style={{
                    height: `${((point.total - point.ios - point.android) / maxTotal) * 160}px`,
                  }}
                />
              )}
            </div>

            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 rounded bg-gray-900 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
              {point.label}: {point.total}
            </div>
          </div>
        ))}
      </div>

      {/* X-axis labels — show first, middle, last */}
      <div className="mt-1 flex justify-between text-xs text-gray-400">
        <span>{trend[0]?.label}</span>
        {trend.length > 2 && (
          <span>{trend[Math.floor(trend.length / 2)]?.label}</span>
        )}
        <span>{trend[trend.length - 1]?.label}</span>
      </div>
    </div>
  );
}
