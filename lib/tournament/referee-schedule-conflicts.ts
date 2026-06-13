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
import {
  DEFAULT_COURT_BUFFER_MINUTES,
  getScheduleTimeBlock,
  getTimelineScheduledDate,
} from '@/lib/tournament/schedule-timeline-slot';

export type RefereeConflictSeverity = 'overlap' | 'tight_gap';

export type RefereeConflictEntry = {
  peerMatchIds: string[];
  peerMatchNumbers: number[];
  severity: RefereeConflictSeverity;
};

export type RefereeScheduleIssuesOptions = {
  courtBufferMinutes?: number;
};

function blocksOverlap(
  a: { startMin: number; endMin: number },
  b: { startMin: number; endMin: number },
): boolean {
  return a.startMin < b.endMin && a.endMin > b.startMin;
}

function gapBetweenBlocksMin(
  a: { startMin: number; endMin: number },
  b: { startMin: number; endMin: number },
): number {
  if (blocksOverlap(a, b)) return 0;
  if (a.endMin <= b.startMin) return b.startMin - a.endMin;
  return a.startMin - b.endMin;
}

export function isRefereeConflictCandidate(m: ScheduleMatch): boolean {
  if (!m.refereeId || !m.courtId || !m.startTime || !m.scheduledDate) {
    return false;
  }
  return m.status === 'scheduled' || m.status === 'live';
}

function sameRefereeDay(a: ScheduleMatch, b: ScheduleMatch): boolean {
  if (a.refereeId !== b.refereeId) return false;
  const da = getTimelineScheduledDate(a)?.trim();
  const db = getTimelineScheduledDate(b)?.trim();
  if (!da || !db) return a.scheduledDate === b.scheduledDate;
  return da === db;
}

function mergeSeverity(
  current: RefereeConflictSeverity | undefined,
  next: RefereeConflictSeverity,
): RefereeConflictSeverity {
  if (current === 'overlap' || next === 'overlap') return 'overlap';
  return 'tight_gap';
}

function addPeer(
  map: Map<string, RefereeConflictEntry>,
  matchId: string,
  peer: ScheduleMatch,
  severity: RefereeConflictSeverity,
): void {
  const existing = map.get(matchId);
  if (existing) {
    if (!existing.peerMatchIds.includes(peer.id)) {
      existing.peerMatchIds.push(peer.id);
      existing.peerMatchNumbers.push(peer.matchNumber);
      existing.peerMatchNumbers.sort((a, b) => a - b);
    }
    existing.severity = mergeSeverity(existing.severity, severity);
    return;
  }
  map.set(matchId, {
    peerMatchIds: [peer.id],
    peerMatchNumbers: [peer.matchNumber],
    severity,
  });
}

export function computeRefereeScheduleIssues(
  matches: ScheduleMatch[],
  options: RefereeScheduleIssuesOptions = {},
): Map<string, RefereeConflictEntry> {
  const courtBufferMinutes =
    options.courtBufferMinutes ?? DEFAULT_COURT_BUFFER_MINUTES;
  const out = new Map<string, RefereeConflictEntry>();
  const candidates = matches.filter(isRefereeConflictCandidate);

  const blocks = new Map<string, { startMin: number; endMin: number }>();
  for (const m of candidates) {
    const block = getScheduleTimeBlock(m, {
      courtBufferMinutes,
      includeBufferAfter: true,
    });
    if (block) blocks.set(m.id, block);
  }

  for (let i = 0; i < candidates.length; i++) {
    const a = candidates[i]!;
    const blockA = blocks.get(a.id);
    if (!blockA) continue;

    for (let j = i + 1; j < candidates.length; j++) {
      const b = candidates[j]!;
      if (!sameRefereeDay(a, b)) continue;
      const blockB = blocks.get(b.id);
      if (!blockB) continue;

      if (blocksOverlap(blockA, blockB)) {
        addPeer(out, a.id, b, 'overlap');
        addPeer(out, b.id, a, 'overlap');
        continue;
      }

      const gap = gapBetweenBlocksMin(blockA, blockB);
      if (gap > 0 && gap < courtBufferMinutes) {
        addPeer(out, a.id, b, 'tight_gap');
        addPeer(out, b.id, a, 'tight_gap');
      }
    }
  }

  return out;
}

export function previewRefereeAssignConflicts(
  target: ScheduleMatch,
  refereeId: string,
  allMatches: ScheduleMatch[],
  options: RefereeScheduleIssuesOptions = {},
): RefereeConflictEntry | null {
  if (!target.startTime || !target.scheduledDate || !target.courtId) {
    return null;
  }
  const hypothetical: ScheduleMatch = {
    ...target,
    refereeId,
    status: target.status === 'live' ? 'live' : 'scheduled',
  };
  const issues = computeRefereeScheduleIssues(
    allMatches.map((m) => (m.id === target.id ? hypothetical : m)),
    options,
  );
  return issues.get(target.id) ?? null;
}

export function computeRefereeTimeConflicts(
  matches: ScheduleMatch[],
  options: RefereeScheduleIssuesOptions = {},
): Map<string, number[]> {
  const issues = computeRefereeScheduleIssues(matches, options);
  const out = new Map<string, number[]>();
  for (const [id, entry] of issues) {
    if (entry.severity === 'overlap') {
      out.set(id, entry.peerMatchNumbers);
    }
  }
  return out;
}

export function countRefereeIssueMatches(
  issues: Map<string, RefereeConflictEntry>,
): { overlapCount: number; tightGapCount: number } {
  let overlapCount = 0;
  let tightGapCount = 0;
  for (const entry of issues.values()) {
    if (entry.severity === 'overlap') overlapCount++;
    else tightGapCount++;
  }
  return { overlapCount, tightGapCount };
}
