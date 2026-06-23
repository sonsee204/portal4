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

import { TIMELINE_TOP_INSET_PX } from '@/lib/tournament/resolve-timeline-drop';

interface ScheduleDropSnapLineProps {
  topPx: number;
  time: string;
}

export function ScheduleDropSnapLine({ topPx, time }: ScheduleDropSnapLineProps) {
  return (
    <div
      className="pointer-events-none absolute right-0 left-0 z-30"
      style={{ top: TIMELINE_TOP_INSET_PX + topPx }}
      aria-hidden
    >
      <div className="border-primary absolute right-0 left-0 border-t-2 border-dashed" />
      <span className="bg-primary/10 text-primary absolute top-0 left-2 -translate-y-1/2 rounded-md px-2 py-0.5 text-[11px] font-semibold">
        {time}
      </span>
    </div>
  );
}
