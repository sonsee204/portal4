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

export interface R1PairDescriptor {
  pairIndex: number;
  slotIndex1: number;
  slotIndex2: number;
  r2MatchIndex: number;
  matchLabel: string;
  slotRangeLabel: string;
}

export function getR1PairIndex(slotIndex: number): number {
  return Math.floor(slotIndex / 2);
}

export function getR2MatchIndex(r1PairIndex: number): number {
  return Math.floor(r1PairIndex / 2);
}

export function getTotalRounds(bracketSize: number): number {
  return Math.log2(bracketSize);
}

export function getR1PairCount(bracketSize: number): number {
  return bracketSize / 2;
}

export function getR1Pairs(bracketSize: number): R1PairDescriptor[] {
  const pairCount = getR1PairCount(bracketSize);
  return Array.from({ length: pairCount }, (_, pairIndex) => {
    const slotIndex1 = pairIndex * 2;
    const slotIndex2 = slotIndex1 + 1;
    return {
      pairIndex,
      slotIndex1,
      slotIndex2,
      r2MatchIndex: getR2MatchIndex(pairIndex),
      matchLabel: `Trận V1 #${pairIndex + 1}`,
      slotRangeLabel: `Slot ${slotIndex1}–${slotIndex2}`,
    };
  });
}

export function getRoundLabel(round: number, totalRounds: number): string {
  const remaining = totalRounds - round + 1;
  switch (remaining) {
    case 1:
      return 'Chung kết';
    case 2:
      return 'Bán kết';
    case 3:
      return 'Tứ kết';
    default:
      return `Vòng ${round}`;
  }
}

export function describeSlotPath(
  slotIndex: number,
  _bracketSize: number,
): { r1PairIndex: number; r2MatchIndex: number; r1MatchLabel: string; r2MatchLabel: string } {
  const r1PairIndex = getR1PairIndex(slotIndex);
  const r2MatchIndex = getR2MatchIndex(r1PairIndex);
  return {
    r1PairIndex,
    r2MatchIndex,
    r1MatchLabel: `Trận V1 #${r1PairIndex + 1}`,
    r2MatchLabel: `V2 #${r2MatchIndex + 1}`,
  };
}

/** Manual editor always shows every R1 pair on the configured bracket. */
export function computeManualEditorPairCount(bracketSize: number): number {
  return getR1PairCount(bracketSize);
}
