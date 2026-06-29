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

import type { ManualKnockoutDrawPreview } from '@/graphql/generated';
import { syncAllPairByes } from './manual-draw.derived';
import type {
  BracketCategoryData,
  BracketMatch,
  BracketPlayer,
  DrawSlot,
} from './types';

function toPlayer(name: string, isBye: boolean, isPlaceholder: boolean): BracketPlayer {
  if (isBye || name === 'BYE') {
    return { id: 'bye', name: 'BYE' };
  }
  return {
    id: isPlaceholder ? `placeholder-${name}` : name,
    name,
    isPlaceholder,
  };
}

function r1NamesFromSlots(
  slots: DrawSlot[],
  pairIndex: number,
): [string, string] {
  const normalized = syncAllPairByes(slots, slots.length / 2);
  const s1 = normalized[pairIndex * 2];
  const s2 = normalized[pairIndex * 2 + 1];
  const n1 = s1?.player?.name ?? (s1?.isBye ? 'BYE' : '—');
  const n2 = s2?.player?.name ?? (s2?.isBye ? 'BYE' : '—');
  return [n1, n2];
}

export function previewToBracketCategoryData(
  preview: ManualKnockoutDrawPreview,
  slots: DrawSlot[],
  meta: {
    categoryId: string;
    categoryTitle: string;
    ageLabel: string;
  },
): BracketCategoryData {
  const byRound = new Map<
    number,
    { label: string; rows: typeof preview.matchupRows }
  >();

  for (const row of preview.matchupRows) {
    const bucket = byRound.get(row.meetingRound) ?? {
      label: row.meetingRoundLabel,
      rows: [],
    };
    bucket.rows.push(row);
    byRound.set(row.meetingRound, bucket);
  }

  let matchCounter = 1;
  const rounds = [...byRound.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([, { label, rows }]) => {
      const matches: BracketMatch[] = rows.map((row, pos) => {
        let p1Name = row.player1Name;
        let p2Name = row.player2Name;

        if (row.meetingRound === 1 && row.r1PairIndex != null) {
          [p1Name, p2Name] = r1NamesFromSlots(slots, row.r1PairIndex);
        }

        const isPlaceholder = (n: string) =>
          n.startsWith('Thắng ') || n === '—';

        return {
          id: `preview-${row.meetingRound}-${pos}`,
          matchNumber: matchCounter++,
          status: row.isR1ByeWalkover ? 'walkover' : 'scheduled',
          isBye: row.isR1ByeWalkover,
          players: [
            toPlayer(p1Name, p1Name === 'BYE', isPlaceholder(p1Name)),
            toPlayer(p2Name, p2Name === 'BYE', isPlaceholder(p2Name)),
          ],
        };
      });

      return { label, matches };
    });

  return {
    categoryId: meta.categoryId,
    categoryTitle: meta.categoryTitle,
    ageLabel: meta.ageLabel,
    rounds,
  };
}
