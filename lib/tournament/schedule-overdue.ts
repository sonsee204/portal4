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

import type { TournamentMatch } from '@/graphql/generated';
import { parseScheduledAtLocal } from '@/lib/tournament/parse-scheduled-at-local';
import type { ScheduleMatch } from '@/types/tournament-schedule';

export function getScheduleMatchStartMs(
  scheduledDate: string,
  startTime: string,
): number {
  return new Date(`${scheduledDate}T${startTime}:00`).getTime();
}

/** NOT_STARTED match whose scheduled slot is already in the past (same local day). */
export function isScheduleMatchOverdue(
  match: Pick<ScheduleMatch, 'status' | 'scheduledDate' | 'startTime'>,
  nowMs = Date.now(),
): boolean {
  if (match.status !== 'scheduled' || !match.scheduledDate || !match.startTime) {
    return false;
  }
  return (
    getScheduleMatchStartMs(match.scheduledDate, match.startTime) < nowMs
  );
}

/** Overdue check for raw GraphQL match rows (list tab). */
export function isPortalMatchOverdue(
  match: Pick<TournamentMatch, 'status' | 'scheduledAt'>,
  nowMs = Date.now(),
): boolean {
  if (match.status !== 'NOT_STARTED' || !match.scheduledAt) return false;
  const parsed = parseScheduledAtLocal(match.scheduledAt);
  if (!parsed.scheduledDate || !parsed.startTime) return false;
  return (
    getScheduleMatchStartMs(parsed.scheduledDate, parsed.startTime) < nowMs
  );
}
