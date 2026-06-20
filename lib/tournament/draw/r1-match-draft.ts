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

import type { DrawSlot, R1MatchDraft } from './types';
import { createEmptySlots } from './mappers';
import { syncAllPairByes } from './manual-draw.derived';

export function slotsToR1Matches(
  slots: DrawSlot[],
  visiblePairCount?: number,
): R1MatchDraft[] {
  const pairCount = visiblePairCount ?? slots.length / 2;
  const drafts: R1MatchDraft[] = [];

  for (let i = 0; i < pairCount; i++) {
    const slotIndex1 = i * 2;
    const slotIndex2 = i * 2 + 1;
    const s1 = slots[slotIndex1];
    const s2 = slots[slotIndex2];
    drafts.push({
      matchIndex: i + 1,
      slotIndex1,
      slotIndex2,
      player1: s1?.player,
      player2: s2?.player,
      isBye1: s1?.isBye,
      isBye2: s2?.isBye,
    });
  }

  return drafts;
}

export function r1MatchesToSlots(
  drafts: R1MatchDraft[],
  bracketSize: number,
): DrawSlot[] {
  const slots = createEmptySlots(bracketSize);
  for (const draft of drafts) {
    if (draft.isBye1) {
      slots[draft.slotIndex1] = { slotIndex: draft.slotIndex1, isBye: true };
    } else if (draft.player1) {
      slots[draft.slotIndex1] = {
        slotIndex: draft.slotIndex1,
        player: draft.player1,
      };
    }
    if (draft.isBye2) {
      slots[draft.slotIndex2] = { slotIndex: draft.slotIndex2, isBye: true };
    } else if (draft.player2) {
      slots[draft.slotIndex2] = {
        slotIndex: draft.slotIndex2,
        player: draft.player2,
      };
    }
  }
  return slots;
}

export function placePlayerOnSlot(
  slots: DrawSlot[],
  slotIndex: number,
  player: DrawSlot['player'],
): DrawSlot[] {
  if (!player) return slots;

  const next = slots.map((s) => ({ ...s }));
  for (const slot of next) {
    if (slot.player?.id === player.id) {
      delete slot.player;
      delete slot.isBye;
    }
  }
  next[slotIndex] = { slotIndex, player };
  return syncAllPairByes(next, next.length / 2);
}

export function clearSlot(slots: DrawSlot[], slotIndex: number): DrawSlot[] {
  const next = slots.map((s) =>
    s.slotIndex === slotIndex ? { slotIndex } : { ...s },
  );
  return syncAllPairByes(next, next.length / 2);
}

export function toggleSlotBye(slots: DrawSlot[], slotIndex: number): DrawSlot[] {
  const slot = slots[slotIndex];
  if (!slot) return slots;

  const pairCount = slots.length / 2;
  if (slot.isBye) {
    return syncAllPairByes(
      slots.map((s) =>
        s.slotIndex === slotIndex ? { slotIndex } : { ...s },
      ),
      pairCount,
    );
  }

  return syncAllPairByes(
    slots.map((s) =>
      s.slotIndex === slotIndex
        ? { slotIndex, isBye: true, player: undefined }
        : s.player?.id === slot.player?.id
          ? { slotIndex: s.slotIndex }
          : { ...s },
    ),
    pairCount,
  );
}
