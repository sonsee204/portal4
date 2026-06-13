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

import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';
import { parseScheduledAtLocal } from '@/lib/tournament/parse-scheduled-at-local';
import type { MatchStatus, ScheduleMatch } from '@/types/tournament-schedule';

export function getMatchPlayedCalendarDate(
  match: ScheduleMatch,
): string | undefined {
  if (!match.matchStartedAt) return undefined;
  return parseScheduledAtLocal(match.matchStartedAt).scheduledDate;
}

export function matchBelongsToScheduleDay(
  match: ScheduleMatch,
  date: string,
  options: { includeUnscheduledWithoutDate?: boolean } = {},
): boolean {
  const { includeUnscheduledWithoutDate = true } = options;
  if (!match.scheduledDate) {
    return includeUnscheduledWithoutDate;
  }
  if (match.scheduledDate === date) return true;
  if (isScheduleMatchEnded(match.status)) {
    const playedDate = getMatchPlayedCalendarDate(match);
    if (playedDate === date) return true;
  }
  return false;
}

export function filterMatchesByScheduleDate(
  matches: ScheduleMatch[],
  date: string,
  options: { includeUnscheduledWithoutDate?: boolean } = {},
): ScheduleMatch[] {
  return matches.filter((m) => matchBelongsToScheduleDay(m, date, options));
}

const REFEREE_GRID_STATUSES = new Set<MatchStatus>(['scheduled', 'live']);

export function filterMatchesForRefereeGrid(
  matches: ScheduleMatch[],
  date: string,
): ScheduleMatch[] {
  return matches.filter((m) => {
    if (!m.startTime || !m.courtId) return false;
    if (m.scheduledDate && m.scheduledDate !== date) return false;
    if (!m.scheduledDate) return false;
    return REFEREE_GRID_STATUSES.has(m.status);
  });
}

export function scrollToScheduleMatchCard(
  matchId: string,
  retries = 5,
): void {
  const el = document.querySelector(`[data-match-id="${CSS.escape(matchId)}"]`);
  if (el) {
    el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    return;
  }
  if (retries > 0) {
    requestAnimationFrame(() => scrollToScheduleMatchCard(matchId, retries - 1));
  }
}
