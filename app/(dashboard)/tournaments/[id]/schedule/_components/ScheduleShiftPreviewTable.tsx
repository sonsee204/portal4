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

import type { ScheduleShiftPreview } from '@/graphql/generated';

function formatTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function ScheduleShiftPreviewTable({
  rows,
  overdueMatchIds,
  maxRows,
}: {
  rows: ScheduleShiftPreview[];
  overdueMatchIds?: Set<string>;
  maxRows?: number;
}) {
  if (rows.length === 0) {
    return (
      <p className="text-secondary py-4 text-center text-sm">
        Lịch sân đã khít — không có trận cần dồn.
      </p>
    );
  }

  const visible = maxRows ? rows.slice(0, maxRows) : rows;

  return (
    <div className="border-surface-border divide-surface-border divide-y overflow-hidden rounded-lg border">
      {visible.map((row) => (
        <div
          key={row.matchId}
          className="flex items-center justify-between gap-3 px-3 py-2.5"
        >
          <div className="flex items-center gap-2">
            <span className="text-heading text-sm font-medium">
              #{row.matchNumber}
            </span>
            {overdueMatchIds?.has(row.matchId) ? (
              <span className="rounded border border-amber-500/30 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-500">
                Quá hạn
              </span>
            ) : null}
          </div>
          <div className="text-right text-xs tabular-nums">
            <p className="text-secondary line-through">
              {formatTime(row.oldScheduledAt)}
            </p>
            <p className="text-primary font-semibold">
              {formatTime(row.newScheduledAt)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
