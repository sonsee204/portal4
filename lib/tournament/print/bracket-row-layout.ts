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

import type { PrintMatchInput } from './types';

/** GROUP_KNOCKOUT knockout phase uses round 100+ in the backend. */
export const KNOCKOUT_ROUND_OFFSET = 100;

/** Map backend knockout rounds (100, 101, …) to elimination depth (1, 2, …). */
export function normalizeEliminationRound(round: number): number {
  return round >= KNOCKOUT_ROUND_OFFSET
    ? round - KNOCKOUT_ROUND_OFFSET + 1
    : round;
}

/** Normalize GROUP_KNOCKOUT knockout matches for single-elim layout math. */
export function normalizeMatchesForEliminationPrint(
  matches: PrintMatchInput[],
): PrintMatchInput[] {
  const hasKnockout = matches.some((m) => m.round >= KNOCKOUT_ROUND_OFFSET);
  if (!hasKnockout) return matches;
  return matches.map((m) => ({
    ...m,
    round: normalizeEliminationRound(m.round),
  }));
}

/** Number of elimination rounds for a power-of-two draw size. */
export function eliminationRoundCount(bracketSize: number): number {
  const size = Math.max(2, bracketSize);
  return Math.round(Math.log2(size));
}

/** Global entry-row span covered by a match (round is 1-based). */
export function matchGlobalRowSpan(
  roundNum: number,
  bracketPosition: number | null | undefined,
  fallbackIndex: number,
): { globalFrom: number; globalTo: number } {
  const span = 2 ** roundNum;
  const bp = bracketPosition ?? fallbackIndex;
  return { globalFrom: bp * span, globalTo: (bp + 1) * span - 1 };
}

/** Map a global row span to local half indices, or null when outside the half. */
export function intersectHalfSpan(
  globalFrom: number,
  globalTo: number,
  halfSlotStart: number,
  halfSlotCount: number,
): { localFrom: number; localTo: number } | null {
  const halfEnd = halfSlotStart + halfSlotCount - 1;
  if (globalTo < halfSlotStart || globalFrom > halfEnd) return null;
  return {
    localFrom: Math.max(0, globalFrom - halfSlotStart),
    localTo: Math.min(halfSlotCount - 1, globalTo - halfSlotStart),
  };
}

/**
 * Pre-assign bracketPosition fallbacks for matches whose bracketPosition is
 * null/undefined by using their ordinal rank within the round, sorted by
 * matchNumber.  The backend always creates matches in bracketPosition order
 * (pos=0,1,2… → matchNumber increments), so rank-by-matchNumber is
 * equivalent to bracketPosition when the field is missing.
 */
export function resolveEffectiveBracketPositions(
  matches: PrintMatchInput[],
): Map<string, number> {
  const roundGroups = new Map<number, PrintMatchInput[]>();
  for (const m of matches) {
    const group = roundGroups.get(m.round) ?? [];
    group.push(m);
    roundGroups.set(m.round, group);
  }

  const result = new Map<string, number>();
  for (const group of roundGroups.values()) {
    group.sort((a, b) => a.matchNumber - b.matchNumber);
    for (let i = 0; i < group.length; i++) {
      const m = group[i]!;
      result.set(m.id, m.bracketPosition ?? i);
    }
  }
  return result;
}

export function filterMatchesForHalf(
  matches: PrintMatchInput[],
  halfSlotStart: number,
  halfSlotCount: number,
): PrintMatchInput[] {
  const bpMap = resolveEffectiveBracketPositions(matches);
  const out: PrintMatchInput[] = [];
  for (const m of matches) {
    const bp = bpMap.get(m.id) ?? m.bracketPosition ?? 0;
    const { globalFrom, globalTo } = matchGlobalRowSpan(m.round, bp, bp);
    if (intersectHalfSpan(globalFrom, globalTo, halfSlotStart, halfSlotCount)) {
      out.push(m);
    }
  }
  return out;
}
