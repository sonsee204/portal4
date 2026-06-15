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
import { parseScheduledAtLocal } from '@/lib/tournament/parse-scheduled-at-local';
import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';

/** Default when tournament scheduleConfig is unavailable — matches backend schema default. */
export const DEFAULT_COURT_BUFFER_MINUTES = 5;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60) % 24;
  const m = totalMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** Effective duration on timeline — mirrors backend matchDurationMs. */
export function getEffectiveDurationMinutes(match: ScheduleMatch): number {
  if (match.status === 'live') {
    return match.estimatedDurationMinutes || 30;
  }
  if (
    isScheduleMatchEnded(match.status) &&
    match.durationSeconds != null &&
    match.durationSeconds > 0
  ) {
    return Math.max(1, Math.ceil(match.durationSeconds / 60));
  }
  return match.estimatedDurationMinutes || 30;
}

/** LIVE or ended — occupies the court on the timeline (mirrors backend buildOccupiedBlocks). */
export function occupiesCourtTimeline(match: ScheduleMatch): boolean {
  return match.status === 'live' || isScheduleMatchEnded(match.status);
}

/**
 * Minute-of-day when the court is free after this match — mirrors
 * backend computeCourtAvailableAtMs / buildOccupiedBlocks end.
 */
export function getCourtAvailableAfterMinutes(
  match: ScheduleMatch,
  courtBufferMinutes = DEFAULT_COURT_BUFFER_MINUTES,
): number | undefined {
  const start = getTimelineStartTime(match);
  if (!start) return undefined;
  return (
    timeToMinutes(start) +
    getEffectiveDurationMinutes(match) +
    courtBufferMinutes
  );
}

/**
 * Timeline start time (HH:mm) — prefers actual start for live/ended matches.
 */
export function getTimelineStartTime(match: ScheduleMatch): string | undefined {
  if (match.matchStartedAt) {
    const parsed = parseScheduledAtLocal(match.matchStartedAt);
    if (
      !match.scheduledDate ||
      parsed.scheduledDate === match.scheduledDate ||
      match.status === 'live' ||
      isScheduleMatchEnded(match.status)
    ) {
      return parsed.startTime;
    }
  }
  return match.startTime;
}

/** Timeline calendar date aligned with getTimelineStartTime. */
export function getTimelineScheduledDate(
  match: ScheduleMatch,
): string | undefined {
  if (match.matchStartedAt) {
    const parsed = parseScheduledAtLocal(match.matchStartedAt);
    if (
      !match.scheduledDate ||
      parsed.scheduledDate === match.scheduledDate ||
      match.status === 'live' ||
      isScheduleMatchEnded(match.status)
    ) {
      return parsed.scheduledDate;
    }
  }
  return match.scheduledDate;
}

export function getTimelineEndTime(match: ScheduleMatch): string | undefined {
  const start = getTimelineStartTime(match);
  if (!start) return undefined;
  const duration = getEffectiveDurationMinutes(match);
  return minutesToTime(timeToMinutes(start) + duration);
}

export type ScheduleTimeBlock = { startMin: number; endMin: number };

export type ScheduleTimeBlockOptions = {
  courtBufferMinutes?: number;
  /** When true, endMin includes court buffer after play (referee/court busy window). */
  includeBufferAfter?: boolean;
};

/**
 * Unified minute-of-day block for conflict checks (court + referee).
 */
export function getScheduleTimeBlock(
  match: ScheduleMatch,
  options: ScheduleTimeBlockOptions = {},
): ScheduleTimeBlock | null {
  const start = getTimelineStartTime(match);
  if (!start) return null;
  const courtBufferMinutes =
    options.courtBufferMinutes ?? DEFAULT_COURT_BUFFER_MINUTES;
  const startMin = timeToMinutes(start);
  const duration = getEffectiveDurationMinutes(match);
  const endMin =
    startMin +
    duration +
    (options.includeBufferAfter ? courtBufferMinutes : 0);
  return { startMin, endMin };
}

/** Whether actual duration differs from estimate beyond buffer (minutes). */
export function hasActualDurationDrift(
  match: ScheduleMatch,
  bufferMinutes = 5,
): boolean {
  if (
    !isScheduleMatchEnded(match.status) ||
    match.durationSeconds == null ||
    match.durationSeconds <= 0
  ) {
    return false;
  }
  const actualMin = Math.ceil(match.durationSeconds / 60);
  const estimate = match.estimatedDurationMinutes || 30;
  return Math.abs(actualMin - estimate) > bufferMinutes;
}
