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
