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
import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';
import {
  DEFAULT_COURT_BUFFER_MINUTES,
  getEffectiveDurationMinutes,
  getTimelineScheduledDate,
  getTimelineStartTime,
  occupiesCourtTimeline,
} from '@/lib/tournament/schedule-timeline-slot';

export type CourtConflictOptions = {
  courtBufferMinutes?: number;
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function sameScheduledCalendarDay(
  a: ScheduleMatch,
  b: ScheduleMatch,
): boolean {
  const da = getTimelineScheduledDate(a)?.trim();
  const db = getTimelineScheduledDate(b)?.trim();
  if (da && db) return da === db;
  if (!da && !db) return true;
  return false;
}

/** Only matches that can still occupy the court participate in conflict pairs. */
function countsForCourtConflict(m: ScheduleMatch): boolean {
  return !isScheduleMatchEnded(m.status);
}

type ConflictBlock = { startMin: number; endMin: number };

function getPlannedBlock(match: ScheduleMatch): ConflictBlock | null {
  const start = getTimelineStartTime(match);
  if (!start) return null;
  const startMin = timeToMinutes(start);
  return {
    startMin,
    endMin: startMin + getEffectiveDurationMinutes(match),
  };
}

/** Occupied block — play time + court buffer (backend buildOccupiedBlocks). */
function getOccupiedBlock(
  match: ScheduleMatch,
  courtBufferMinutes: number,
): ConflictBlock | null {
  const start = getTimelineStartTime(match);
  if (!start) return null;
  const startMin = timeToMinutes(start);
  return {
    startMin,
    endMin: startMin + getEffectiveDurationMinutes(match) + courtBufferMinutes,
  };
}

function blocksOverlap(
  a: ConflictBlock,
  b: ConflictBlock,
  aOccupied: boolean,
  bOccupied: boolean,
  courtBufferMinutes: number,
): boolean {
  if (aOccupied && !bOccupied) {
    // Scheduled tail repacked after anchor: starts at or after occupied end → no conflict.
    if (b.startMin >= a.endMin) return false;
    return b.startMin < a.endMin && b.endMin > a.startMin;
  }
  if (!aOccupied && bOccupied) {
    if (a.startMin >= b.endMin) return false;
    return a.startMin < b.endMin && a.endMin > b.startMin;
  }
  if (aOccupied && bOccupied) {
    return a.startMin < b.endMin && a.endMin > b.startMin;
  }
  // Two planned (NOT_STARTED / LIVE treated as planned for mutual buffer) — mirrors backend validateScheduleConflicts court check.
  return (
    a.startMin < b.endMin + courtBufferMinutes &&
    a.endMin + courtBufferMinutes > b.startMin
  );
}

function geometricOverlap(
  a: ScheduleMatch,
  b: ScheduleMatch,
  courtBufferMinutes: number,
): boolean {
  if (a.courtId !== b.courtId) return false;
  if (!sameScheduledCalendarDay(a, b)) return false;

  const aOccupied = occupiesCourtTimeline(a);
  const bOccupied = occupiesCourtTimeline(b);

  const blockA = aOccupied
    ? getOccupiedBlock(a, courtBufferMinutes)
    : getPlannedBlock(a);
  const blockB = bOccupied
    ? getOccupiedBlock(b, courtBufferMinutes)
    : getPlannedBlock(b);

  if (!blockA || !blockB) return false;

  return blocksOverlap(
    blockA,
    blockB,
    aOccupied,
    bOccupied,
    courtBufferMinutes,
  );
}

function hasTimeOverlap(
  a: ScheduleMatch,
  b: ScheduleMatch,
  courtBufferMinutes = DEFAULT_COURT_BUFFER_MINUTES,
): boolean {
  const aActive = countsForCourtConflict(a);
  const bActive = countsForCourtConflict(b);
  if (!aActive && !bActive) return false;
  return geometricOverlap(a, b, courtBufferMinutes) && (aActive || bActive);
}

function findCourtConflicts(
  matches: ScheduleMatch[],
  options: CourtConflictOptions = {},
): Set<string> {
  const courtBufferMinutes =
    options.courtBufferMinutes ?? DEFAULT_COURT_BUFFER_MINUTES;
  const onCourt = matches.filter(
    (m) => m.courtId && getTimelineStartTime(m),
  );
  const conflictIds = new Set<string>();
  for (let i = 0; i < onCourt.length; i++) {
    for (let j = i + 1; j < onCourt.length; j++) {
      if (!hasTimeOverlap(onCourt[i], onCourt[j], courtBufferMinutes)) {
        continue;
      }
      if (countsForCourtConflict(onCourt[i])) {
        conflictIds.add(onCourt[i].id);
      }
      if (countsForCourtConflict(onCourt[j])) {
        conflictIds.add(onCourt[j].id);
      }
    }
  }
  return conflictIds;
}

export { findCourtConflicts, hasTimeOverlap };
