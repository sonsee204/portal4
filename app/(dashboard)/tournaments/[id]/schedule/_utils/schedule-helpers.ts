import type { ScheduleMatch } from '@/types/tournament-schedule';

export function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export function minutesToTime(totalMinutes: number): string {
  const h = Math.floor(totalMinutes / 60)
    .toString()
    .padStart(2, '0');
  const m = (totalMinutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * Các mốc giờ bắt đầu trong [minStartMin, maxStartMin], cách nhau `stepMinutes`.
 * Dùng cho dropdown xếp lịch: bước nhảy = thời lượng dự kiến (phút).
 */
export function buildStartTimeOptionsByStep(
  minStartMin: number,
  maxStartMin: number,
  stepMinutes: number
): string[] {
  const step = Math.max(1, Math.floor(stepMinutes));
  if (minStartMin > maxStartMin) return [];
  const out: string[] = [];
  for (let m = minStartMin; m <= maxStartMin; m += step) {
    out.push(minutesToTime(m));
  }
  return out;
}

/**
 * Hai trận coi là cùng ngày lịch khi so trùng sân / VĐV.
 * Có `scheduledDate` khác nhau → không trùng; một có một không → không gộp (tránh báo xung đột sai ngày).
 */
export function sameScheduledCalendarDay(
  a: ScheduleMatch,
  b: ScheduleMatch,
): boolean {
  const da = a.scheduledDate?.trim();
  const db = b.scheduledDate?.trim();
  if (da && db) return da === db;
  if (!da && !db) return true;
  return false;
}

export {
  findCourtConflicts,
  hasTimeOverlap,
} from '@/lib/tournament/schedule-court-conflicts';

/**
 * Check if any player in `match` has a schedule conflict with other matches.
 * Returns the conflicting match, or null if no conflict.
 */
export function hasPlayerTimeConflict(
  match: ScheduleMatch,
  startMinutes: number,
  durationMinutes: number,
  allScheduled: ScheduleMatch[],
): ScheduleMatch | null {
  const result = checkPlayerScheduleConflict(
    match,
    startMinutes,
    durationMinutes,
    allScheduled,
    0,
  );
  return result ? result.conflictMatch : null;
}

/**
 * Enhanced conflict check: detects both time overlap and rest-time gap violations.
 */
export function checkPlayerScheduleConflict(
  match: ScheduleMatch,
  startMinutes: number,
  durationMinutes: number,
  allScheduled: ScheduleMatch[],
  minRestMinutes: number,
): { type: 'overlap' | 'rest'; conflictMatch: ScheduleMatch } | null {
  const endMinutes = startMinutes + durationMinutes;
  const matchPlayerIds = match.playerIds.filter(Boolean) as string[];
  if (matchPlayerIds.length === 0) return null;

  for (const other of allScheduled) {
    if (other.id === match.id || !other.startTime) continue;
    const otherPlayerIds = other.playerIds.filter(Boolean) as string[];
    const hasCommonPlayer = matchPlayerIds.some((pid) =>
      otherPlayerIds.includes(pid),
    );
    if (!hasCommonPlayer) continue;

    const otherStart = timeToMinutes(other.startTime);
    const otherEnd = otherStart + other.estimatedDurationMinutes;

    // Direct time overlap
    if (startMinutes < otherEnd && endMinutes > otherStart) {
      return { type: 'overlap', conflictMatch: other };
    }

    // Rest-time gap check
    if (minRestMinutes > 0) {
      const gap =
        startMinutes >= otherEnd
          ? startMinutes - otherEnd
          : otherStart - endMinutes;
      if (gap >= 0 && gap < minRestMinutes) {
        return { type: 'rest', conflictMatch: other };
      }
    }
  }
  return null;
}

export { isScheduleMatchEnded } from '@/lib/tournament/match-ended';
