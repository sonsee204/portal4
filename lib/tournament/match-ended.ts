import type { MatchStatus } from '@/types/tournament-schedule';

const ENDED_SCHEDULE_MATCH_STATUSES = new Set<MatchStatus>([
  'finished',
  'walkover',
  'cancelled',
  'retirement',
]);

/** Trận đã kết thúc trên lưới lịch (kể cả xử thua / bỏ cuộc / hủy). */
export function isScheduleMatchEnded(status?: string): boolean {
  return status
    ? ENDED_SCHEDULE_MATCH_STATUSES.has(status as MatchStatus)
    : false;
}

export const SCHEDULE_ENDED_STATUSES = ENDED_SCHEDULE_MATCH_STATUSES;
