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

import { getRoundLabel, getR1PairCount, getTotalRounds } from './bracket-topology';
import { syncAllPairByes } from './manual-draw.derived';
import type { DrawSlot } from './types';

export interface LayoutStats {
  tvtCount: number;
  walkoverCount: number;
  structuralEmptyCount: number;
  assignedCount: number;
  r2TvTCount: number;
  r2WalkoverCount: number;
  minR1TvT: number;
}

type SimNode = { isBye: boolean };

function slotToNode(slot: DrawSlot | undefined): SimNode {
  if (slot?.player) return { isBye: false };
  return { isBye: true };
}

function countR1Stats(slots: DrawSlot[], pairCount: number) {
  let tvtCount = 0;
  let walkoverCount = 0;
  let structuralEmptyCount = 0;
  let assignedCount = 0;

  for (let p = 0; p < pairCount; p++) {
    const s1 = slots[p * 2];
    const s2 = slots[p * 2 + 1];
    const has1 = !!s1?.player;
    const has2 = !!s2?.player;
    if (has1) assignedCount++;
    if (has2) assignedCount++;

    if (!has1 && !has2 && !s1?.isBye && !s2?.isBye) {
      structuralEmptyCount++;
    } else if (has1 && has2) {
      tvtCount++;
    } else if (has1 || has2) {
      walkoverCount++;
    }
  }

  return { tvtCount, walkoverCount, structuralEmptyCount, assignedCount };
}

/** Mirror backend simulateMatchups for R2 walkover vs TvT counts. */
export function projectR2Counts(
  slots: DrawSlot[],
  bracketSize: number,
): { r2TvTCount: number; r2WalkoverCount: number } {
  const pairCount = getR1PairCount(bracketSize);
  const totalRounds = getTotalRounds(bracketSize);
  const normalized = syncAllPairByes(slots, pairCount);

  let roundNodes: SimNode[][] = [];

  for (let p = 0; p < pairCount; p++) {
    const n1 = slotToNode(normalized[p * 2]);
    const n2 = slotToNode(normalized[p * 2 + 1]);
    const bothBye = n1.isBye && n2.isBye;
    const winner: SimNode = bothBye
      ? { isBye: true }
      : n1.isBye
        ? n2
        : n2.isBye
          ? n1
          : { isBye: false };
    roundNodes.push([winner]);
  }

  let r2TvTCount = 0;
  let r2WalkoverCount = 0;

  for (let round = 2; round <= totalRounds; round++) {
    const nextRound: SimNode[][] = [];
    for (let i = 0; i < roundNodes.length; i += 2) {
      const left = roundNodes[i]?.[0] ?? { isBye: true };
      const right = roundNodes[i + 1]?.[0] ?? { isBye: true };
      if (round === 2) {
        if (left.isBye && right.isBye) {
          /* double-BYE subtree — no R2 match row */
        } else if (left.isBye || right.isBye) {
          r2WalkoverCount++;
        } else {
          r2TvTCount++;
        }
      }

      const winner: SimNode =
        left.isBye && right.isBye
          ? { isBye: true }
          : left.isBye
            ? right
            : right.isBye
              ? left
              : { isBye: false };
      nextRound.push([winner]);
    }
    roundNodes = nextRound;
  }

  return { r2TvTCount, r2WalkoverCount };
}

export function computeLayoutStats(
  slots: DrawSlot[],
  bracketSize: number,
  playerCount: number,
): LayoutStats {
  const pairCount = getR1PairCount(bracketSize);
  const normalized = syncAllPairByes(slots, pairCount);
  const r1 = countR1Stats(normalized, pairCount);
  const r2 = projectR2Counts(normalized, bracketSize);
  const minR1TvT = Math.max(0, playerCount - pairCount);

  return {
    ...r1,
    ...r2,
    minR1TvT,
  };
}

export { getRoundLabel };
