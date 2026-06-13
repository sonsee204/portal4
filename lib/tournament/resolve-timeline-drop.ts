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

import { minutesToTime } from '@/lib/tournament/schedule-time';

/** Snap step when clicking or dropping on the timeline grid. */
export const TIMELINE_DROP_SNAP_MINUTES = 15;

/** Top inset inside court columns — labels at topPx=0 are not clipped. */
export const TIMELINE_TOP_INSET_PX = 18;

export interface ResolveTimelineDropInput {
  clientY: number;
  columnRect: Pick<DOMRect, 'top' | 'height'>;
  dayStart: number;
  dayEnd: number;
  pxPerMinute: number;
  snapMinutes?: number;
}

export interface TimelineDropTarget {
  time: string;
  snappedMinutes: number;
}

/**
 * Resolve a pointer Y position to a snapped start time on a court column.
 * Shared by click-to-assign and drag-and-drop.
 */
export function resolveTimelineDrop({
  clientY,
  columnRect,
  dayStart,
  dayEnd,
  pxPerMinute,
  snapMinutes = TIMELINE_DROP_SNAP_MINUTES,
}: ResolveTimelineDropInput): TimelineDropTarget {
  const relY = clientY - columnRect.top - TIMELINE_TOP_INSET_PX;
  const rawMinute = dayStart + Math.max(0, relY) / pxPerMinute;
  const snapped = Math.round(rawMinute / snapMinutes) * snapMinutes;
  const clamped = Math.max(
    dayStart,
    Math.min(dayEnd - snapMinutes, snapped),
  );
  return {
    time: minutesToTime(clamped),
    snappedMinutes: clamped,
  };
}

/** Resolve from a click event on a court column body. */
export function resolveTimelineDropFromClick(
  event: React.MouseEvent<HTMLElement>,
  dayStart: number,
  dayEnd: number,
  pxPerMinute: number,
): TimelineDropTarget {
  const rect = event.currentTarget.getBoundingClientRect();
  return resolveTimelineDrop({
    clientY: event.clientY,
    columnRect: rect,
    dayStart,
    dayEnd,
    pxPerMinute,
  });
}

