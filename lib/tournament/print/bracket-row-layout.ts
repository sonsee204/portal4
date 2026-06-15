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

export function filterMatchesForHalf(
  matches: PrintMatchInput[],
  halfSlotStart: number,
  halfSlotCount: number,
): PrintMatchInput[] {
  const out: PrintMatchInput[] = [];
  for (const m of matches) {
    const { globalFrom, globalTo } = matchGlobalRowSpan(
      m.round,
      m.bracketPosition,
      m.matchNumber - 1,
    );
    if (intersectHalfSpan(globalFrom, globalTo, halfSlotStart, halfSlotCount)) {
      out.push(m);
    }
  }
  return out;
}
