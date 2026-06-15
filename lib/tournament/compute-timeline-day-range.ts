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

import type { ScheduleMatch } from '@/types/tournament-schedule';
import {
  getEffectiveDurationMinutes,
  getTimelineStartTime,
} from '@/lib/tournament/schedule-timeline-slot';
import { timeToMinutes } from '@/lib/tournament/schedule-time';

const RANGE_SNAP_MINUTES = 15;
const GRIDLINE_INTERVAL = 30;
export const DEFAULT_TRAILING_PADDING_MINUTES = 30;
const DEFAULT_DAY_START = 8 * 60;
const DEFAULT_DAY_END = 22 * 60;
const DEFAULT_FUTURE_WINDOW_MINUTES = 4 * 60;

export interface ComputeTimelineDayRangeOptions {
  /** Calendar date being viewed (YYYY-MM-DD). Enables today/future window logic. */
  selectedDate?: string;
  trailingPaddingMinutes?: number;
  /** How far past now the grid extends when viewing today. */
  futureWindowMinutes?: number;
}

function todayLocal(): string {
  return new Date().toLocaleDateString('en-CA');
}

function nowMinutesLocal(): number {
  const now = new Date();
  return now.getHours() * 60 + now.getMinutes();
}

function snapDown(minutes: number, step: number): number {
  return Math.floor(minutes / step) * step;
}

function snapUp(minutes: number, step: number): number {
  return Math.ceil(minutes / step) * step;
}

function resolveOptions(
  options?: ComputeTimelineDayRangeOptions | number
): ComputeTimelineDayRangeOptions {
  if (typeof options === 'number') {
    return { trailingPaddingMinutes: options };
  }
  return options ?? {};
}

/**
 * Visible minute-of-day range for the schedule timeline grid.
 * Extends past the last match when viewing today so future slots stay droppable.
 */
export function computeTimelineDayRange(
  matches: ScheduleMatch[],
  options?: ComputeTimelineDayRangeOptions | number
): [number, number] {
  const {
    selectedDate,
    trailingPaddingMinutes = DEFAULT_TRAILING_PADDING_MINUTES,
    futureWindowMinutes = DEFAULT_FUTURE_WINDOW_MINUTES,
  } = resolveOptions(options);

  const isToday = selectedDate != null && selectedDate === todayLocal();
  const isPastDate =
    selectedDate != null && selectedDate < todayLocal();

  const withStart = matches
    .map((m) => ({ m, start: getTimelineStartTime(m) }))
    .filter((x): x is { m: ScheduleMatch; start: string } => !!x.start);

  if (withStart.length === 0) {
    if (isToday && !isPastDate) {
      const now = nowMinutesLocal();
      const start = Math.max(
        0,
        snapDown(Math.max(DEFAULT_DAY_START, now - 60), RANGE_SNAP_MINUTES)
      );
      const end = Math.min(
        24 * 60,
        snapUp(now + futureWindowMinutes, GRIDLINE_INTERVAL) +
        trailingPaddingMinutes
      );
      return [start, Math.max(end, start + 2 * 60)];
    }
    return [DEFAULT_DAY_START, DEFAULT_DAY_END];
  }

  const mins = withStart.map((x) => timeToMinutes(x.start));
  const minStart = Math.min(...mins);
  const maxMatch = withStart.reduce((prev, cur) =>
    timeToMinutes(cur.start) > timeToMinutes(prev.start) ? cur : prev
  ).m;
  const latestEnd =
    timeToMinutes(getTimelineStartTime(maxMatch)!) +
    getEffectiveDurationMinutes(maxMatch);

  const start = Math.max(
    0,
    snapDown(minStart, RANGE_SNAP_MINUTES)
  );
  let end = Math.min(
    24 * 60,
    snapUp(latestEnd, GRIDLINE_INTERVAL) + trailingPaddingMinutes
  );

  if (isToday && !isPastDate) {
    const minEndForScheduling =
      snapUp(nowMinutesLocal() + futureWindowMinutes, GRIDLINE_INTERVAL) +
      trailingPaddingMinutes;
    end = Math.max(end, Math.min(24 * 60, minEndForScheduling));
  }

  return [start, end];
}
