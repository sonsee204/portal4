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
import type { GhostRoundColumn } from './types';

export function previewToGhostRounds(
  preview: ManualKnockoutDrawPreview | null | undefined,
): GhostRoundColumn[] {
  if (!preview?.matchupRows?.length) return [];

  const byRound = new Map<number, GhostRoundColumn>();

  for (const row of preview.matchupRows) {
    if (row.meetingRound <= 1) continue;
    const existing = byRound.get(row.meetingRound) ?? {
      round: row.meetingRound,
      label: row.meetingRoundLabel,
      matchups: [],
    };
    existing.matchups.push({
      player1Name: row.player1Name,
      player2Name: row.player2Name,
    });
    byRound.set(row.meetingRound, existing);
  }

  return [...byRound.values()].sort((a, b) => a.round - b.round);
}
