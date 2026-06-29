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

import { describe, expect, it } from 'vitest';
import { computeVisibleSlotCount } from './compute-visible-slots';
import {
  computeManualEditorPairCount,
  getR1PairCount,
  getR1Pairs,
  getR2MatchIndex,
} from './bracket-topology';
import { computeLayoutStats, projectR2Counts } from './layout-stats';
import { createEmptySlots } from './mappers';
import { syncAllPairByes } from './manual-draw.derived';
import { placePlayerOnSlot } from './r1-match-draft';
import { previewToBracketCategoryData } from './preview-to-bracket-tree';
import type { DrawPlayer } from './types';

const players: DrawPlayer[] = Array.from({ length: 19 }, (_, i) => ({
  id: `p${i}`,
  name: `Pair ${i + 1}`,
}));

/** BTC organizer layout: 3 TvT + 13 walkover at R1 → 8 TvT at V2. */
function buildOrganizer19PairLayout() {
  let slots = createEmptySlots(32);
  let playerIdx = 0;

  const walkoverPairIndices = [0, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14];
  for (const pairIndex of walkoverPairIndices) {
    slots = placePlayerOnSlot(slots, pairIndex * 2, players[playerIdx++]!);
  }

  for (const pairIndex of [1, 9, 15]) {
    slots = placePlayerOnSlot(slots, pairIndex * 2, players[playerIdx++]!);
    slots = placePlayerOnSlot(slots, pairIndex * 2 + 1, players[playerIdx++]!);
  }

  return syncAllPairByes(slots, 16);
}

describe('bracket-topology', () => {
  it('maps slot indices to R1/R2 groups', () => {
    expect(getR1PairCount(32)).toBe(16);
    expect(getR2MatchIndex(1)).toBe(0);
    expect(getR2MatchIndex(10)).toBe(5);
    expect(computeManualEditorPairCount(32)).toBe(16);
    expect(getR1Pairs(32)).toHaveLength(16);
  });
});

describe('manual 19-pair BTC layout', () => {
  it('yields 3 TvT + 13 walkover at R1 and 8 TvT at V2', () => {
    const slots = buildOrganizer19PairLayout();
    const stats = computeLayoutStats(slots, 32, 19);

    expect(stats.assignedCount).toBe(19);
    expect(stats.tvtCount).toBe(3);
    expect(stats.walkoverCount).toBe(13);
    expect(stats.structuralEmptyCount).toBe(0);
    expect(stats.r2TvTCount).toBe(8);
    expect(stats.r2WalkoverCount).toBe(0);
  });

  it('projects R2 counts from normalized slots', () => {
    const slots = buildOrganizer19PairLayout();
    const r2 = projectR2Counts(slots, 32);
    expect(r2.r2TvTCount).toBe(8);
    expect(r2.r2WalkoverCount).toBe(0);
  });
});

describe('previewToBracketCategoryData', () => {
  it('builds round columns from synthetic preview rows', () => {
    const slots = buildOrganizer19PairLayout();

    const preview = {
      valid: true,
      bracketSize: 32,
      totalByes: 0,
      r1TvTCount: 3,
      maxR1TvT: 18,
      layoutHints: {
        approvedCount: 19,
        r1PairCount: 16,
        minR1TvT: 3,
        structuralEmptyPairs: 0,
        r1WalkoverCount: 13,
        r1TvTCount: 3,
        r2TvTCount: 8,
        r2WalkoverCount: 0,
      },
      errors: [],
      matchupRows: [
        {
          player1Name: 'Pair 1',
          player2Name: 'BYE',
          isR1ByeWalkover: true,
          meetingRound: 1,
          meetingRoundLabel: 'Vòng 1',
          r1PairIndex: 0,
        },
        {
          player1Name: 'Thắng Vòng 1 #1',
          player2Name: 'Thắng Vòng 1 #2',
          isR1ByeWalkover: false,
          meetingRound: 2,
          meetingRoundLabel: 'Vòng 2',
        },
      ],
    };

    const tree = previewToBracketCategoryData(preview, slots, {
      categoryId: 'cat1',
      categoryTitle: 'Test',
      ageLabel: 'U36',
    });
    expect(tree.rounds.length).toBeGreaterThanOrEqual(2);
    expect(tree.rounds[0]?.matches[0]?.players[0]?.name).toBe('Pair 1');
  });
});

describe('computeManualEditorPairCount vs legacy visible', () => {
  it('manual editor uses full bracket for 19 on 32', () => {
    expect(computeManualEditorPairCount(32)).toBe(16);
    expect(createEmptySlots(32)).toHaveLength(32);
  });

  it('legacy visible count still caps at ceil(n/2) for non-manual use', () => {
    const slots = createEmptySlots(32);
    expect(computeVisibleSlotCount(32, slots, 19)).toBe(20);
  });
});
