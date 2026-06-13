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

import type { CheckInByDate } from '@/graphql/types';

interface CheckInTrendChartProps {
  data?: CheckInByDate[];
  loading: boolean;
}

export function CheckInTrendChart({ data, loading }: CheckInTrendChartProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <div className="bg-surface-hover mb-6 h-5 w-40 animate-pulse rounded" />
        <div className="bg-surface-hover h-48 animate-pulse rounded-lg" />
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <h3 className="text-heading mb-4 text-sm font-semibold">
          Check-in theo ngày
        </h3>
        <div className="flex h-48 items-center justify-center">
          <p className="text-faint text-sm">Chưa có dữ liệu check-in</p>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6">
      <h3 className="text-heading mb-4 text-sm font-semibold">
        Check-in theo ngày
      </h3>
      <div className="flex h-48 items-end gap-1 overflow-x-auto pb-2">
        {data.map((point) => {
          const heightPct = (point.count / maxCount) * 100;
          return (
            <div
              key={point.date}
              className="group relative flex min-w-[28px] flex-1 flex-col items-center"
            >
              {/* Tooltip */}
              <div className="absolute -top-10 left-1/2 hidden -translate-x-1/2 rounded bg-gray-800 px-2 py-1 text-xs whitespace-nowrap text-white group-hover:block">
                {point.count} check-in
                <br />
                {new Date(point.date).toLocaleDateString('vi-VN')}
              </div>
              <div
                className="w-full rounded-t-sm bg-green-500 transition-all duration-200"
                style={{ height: `${heightPct}%`, minHeight: '4px' }}
              />
              <span className="text-faint mt-1 max-w-full origin-left rotate-45 truncate text-[9px]">
                {new Date(point.date).toLocaleDateString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                })}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
