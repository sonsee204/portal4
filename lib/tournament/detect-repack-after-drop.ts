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
