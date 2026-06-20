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
import { slotsToKnockoutInput, createEmptySlots } from './mappers';
import { autoFillRemainingByes, getUnassignedPlayers, hasBothByePair, syncAllPairByes } from './manual-draw.derived';
import { placePlayerOnSlot, slotsToR1Matches } from './r1-match-draft';
import type { DrawPlayer } from './types';

const players: DrawPlayer[] = Array.from({ length: 19 }, (_, i) => ({
  id: `p${i}`,
  name: `Pair ${i + 1}`,
}));

describe('computeVisibleSlotCount', () => {
  it('shows 20 leaf rows for 19 players on bracket 32', () => {
    const slots = createEmptySlots(32);
    expect(computeVisibleSlotCount(32, slots, 19)).toBe(20);
  });

  it('expands when player placed beyond initial window', () => {
    const slots = createEmptySlots(32);
    slots[18] = { slotIndex: 18, player: players[0] };
    expect(computeVisibleSlotCount(32, slots)).toBe(20);
  });
});

describe('manual draw kernel', () => {
  it('maps slots to knockout input', () => {
    const slots = createEmptySlots(4);
    slots[0] = { slotIndex: 0, player: players[0] };
    slots[1] = { slotIndex: 1, isBye: true };
    const input = slotsToKnockoutInput(slots);
    expect(input).toEqual([
      { slotIndex: 0, registrationId: 'p0' },
      { slotIndex: 1, registrationId: null },
    ]);
  });

  it('autofill places unassigned then marks remaining as BYE', () => {
    const slots = createEmptySlots(4);
    const filled = autoFillRemainingByes(slots, 4, players.slice(0, 2));
    expect(filled.filter((s) => s.player).length).toBe(2);
    expect(filled.filter((s) => s.isBye).length).toBe(2);
  });

  it('tracks unassigned pool', () => {
    const slots = createEmptySlots(8);
    slots[0] = { slotIndex: 0, player: players[0] };
    expect(getUnassignedPlayers(players.slice(0, 3), slots)).toHaveLength(2);
  });

  it('builds R1 match drafts from slots', () => {
    const slots = createEmptySlots(4);
    slots[0] = { slotIndex: 0, player: players[0] };
    slots[1] = { slotIndex: 1, isBye: true };
    const drafts = slotsToR1Matches(slots, 2);
    expect(drafts[0]?.matchIndex).toBe(1);
    expect(drafts[0]?.player1?.id).toBe('p0');
    expect(drafts[0]?.isBye2).toBe(true);
  });

  it('moves player between slots', () => {
    const slots = createEmptySlots(4);
    slots[0] = { slotIndex: 0, player: players[0] };
    const moved = placePlayerOnSlot(slots, 2, players[0]);
    expect(moved[0]?.player).toBeUndefined();
    expect(moved[2]?.player?.id).toBe('p0');
  });

  it('auto-marks sibling as BYE when only one side has a pair', () => {
    const slots = createEmptySlots(4);
    const placed = placePlayerOnSlot(slots, 0, players[0]);
    expect(placed[1]?.isBye).toBe(true);
  });

  it('sends implicit walkover BYE in knockout input', () => {
    const slots = createEmptySlots(4);
    slots[0] = { slotIndex: 0, player: players[0] };
    expect(slotsToKnockoutInput(slots)).toEqual([
      { slotIndex: 0, registrationId: 'p0' },
      { slotIndex: 1, registrationId: null },
    ]);
  });

  it('syncs multiple walkover pairs for 19-player layout', () => {
    const slots = createEmptySlots(32);
    for (let pair = 0; pair < 13; pair++) {
      slots[pair * 2] = { slotIndex: pair * 2, player: players[pair] };
    }
    const synced = syncAllPairByes(slots, 16);
    expect(synced.filter((s) => s.isBye).length).toBe(13);
    expect(synced.filter((s) => s.player).length).toBe(13);
  });
});

describe('hasBothByePair', () => {
  it('detects explicit BYE vs BYE on an R1 pair', () => {
    const slots = createEmptySlots(32);
    slots[20] = { slotIndex: 20, isBye: true };
    slots[21] = { slotIndex: 21, isBye: true };
    expect(hasBothByePair(slots, 16)).toBe(true);
  });

  it('allows walkover with one player and implicit sibling BYE', () => {
    const slots = createEmptySlots(4);
    slots[0] = { slotIndex: 0, player: players[0] };
    const synced = syncAllPairByes(slots, 2);
    expect(hasBothByePair(synced, 2)).toBe(false);
  });
});
