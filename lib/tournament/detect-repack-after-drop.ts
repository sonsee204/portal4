import type { ScheduleMatch } from '@/types/tournament-schedule';
import { hasTimeOverlap } from '@/lib/tournament/schedule-court-conflicts';

export interface RepackAfterDropHint {
  suggestRepack: boolean;
  anchorMatchId: string;
  courtId: string;
  overlapCount: number;
  affectedMatchIds: string[];
}

/**
 * After moving a match, detect if other matches on the same court/day overlap.
 * Mirrors client-side heuristic before offering repack dialog.
 */
export function detectRepackAfterDrop(
  movedMatch: ScheduleMatch,
  allMatches: ScheduleMatch[],
  courtBufferMinutes = 5,
): RepackAfterDropHint | null {
  if (!movedMatch.courtId || !movedMatch.startTime) return null;

  const overlapping = allMatches.filter(
    (m) =>
      m.id !== movedMatch.id &&
      m.courtId === movedMatch.courtId &&
      m.startTime &&
      (m.scheduledDate == null ||
        m.scheduledDate === movedMatch.scheduledDate) &&
      hasTimeOverlap(movedMatch, m, courtBufferMinutes),
  );

  if (overlapping.length === 0) return null;

  return {
    suggestRepack: true,
    anchorMatchId: movedMatch.id,
    courtId: movedMatch.courtId,
    overlapCount: overlapping.length,
    affectedMatchIds: overlapping.map((m) => m.id),
  };
}
