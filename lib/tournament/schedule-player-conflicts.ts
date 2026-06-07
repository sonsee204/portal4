import type { ScheduleMatch } from '@/types/tournament-schedule';
import { timeToMinutes } from '@/lib/tournament/schedule-time';

/**
 * Detect player time overlap and rest-gap violations for a hypothetical slot.
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

    if (startMinutes < otherEnd && endMinutes > otherStart) {
      return { type: 'overlap', conflictMatch: other };
    }

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
