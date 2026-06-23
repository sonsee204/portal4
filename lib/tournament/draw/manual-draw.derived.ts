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
import type { DrawPlayer, DrawSlot } from './types';
import { createEmptySlots } from './mappers';

/** When one R1 side has a pair and the other is empty, treat the empty side as BYE. */
function syncPairByes(slots: DrawSlot[], pairIndex: number): void {
  const i1 = pairIndex * 2;
  const i2 = i1 + 1;
  const s1 = slots[i1] ?? { slotIndex: i1 };
  const s2 = slots[i2] ?? { slotIndex: i2 };
  const has1 = !!s1.player;
  const has2 = !!s2.player;

  if (has1 && has2) {
    slots[i1] = { slotIndex: i1, player: s1.player };
    slots[i2] = { slotIndex: i2, player: s2.player };
    return;
  }

  if (has1 && !has2) {
    slots[i1] = { slotIndex: i1, player: s1.player };
    slots[i2] = { slotIndex: i2, isBye: true };
    return;
  }

  if (has2 && !has1) {
    slots[i1] = { slotIndex: i1, isBye: true };
    slots[i2] = { slotIndex: i2, player: s2.player };
    return;
  }

  if (s1.isBye && !s2.isBye) {
    slots[i1] = { slotIndex: i1, isBye: true };
    slots[i2] = { slotIndex: i2 };
    return;
  }

  if (s2.isBye && !s1.isBye) {
    slots[i2] = { slotIndex: i2, isBye: true };
    slots[i1] = { slotIndex: i1 };
    return;
  }

  if (!s1.isBye && !s2.isBye) {
    slots[i1] = { slotIndex: i1 };
    slots[i2] = { slotIndex: i2 };
  }
}

export function syncAllPairByes(
  slots: DrawSlot[],
  pairCount: number,
): DrawSlot[] {
  const next = slots.map((s) => ({ ...s }));
  for (let p = 0; p < pairCount; p++) {
    syncPairByes(next, p);
  }
  return next;
}

export function getAssignedPlayerIds(slots: DrawSlot[]): Set<string> {
  const ids = new Set<string>();
  for (const slot of slots) {
    if (slot.player?.id) ids.add(slot.player.id);
  }
  return ids;
}

export function getUnassignedPlayers(
  allPlayers: DrawPlayer[],
  slots: DrawSlot[],
): DrawPlayer[] {
  const assigned = getAssignedPlayerIds(slots);
  return allPlayers.filter((p) => !assigned.has(p.id));
}

export function canSubmitManualDraw(
  preview: ManualKnockoutDrawPreview | null | undefined,
  slots?: DrawSlot[],
  bracketSize?: number,
): boolean {
  if (!preview?.valid) return false;
  if (slots && bracketSize) {
    return !hasBothByePair(slots, bracketSize / 2);
  }
  return true;
}

/** R1 pair where both sides are explicit BYE. */
export function hasBothByePair(slots: DrawSlot[], pairCount: number): boolean {
  const normalized = syncAllPairByes(slots, pairCount);
  for (let p = 0; p < pairCount; p++) {
    const s1 = normalized[p * 2];
    const s2 = normalized[p * 2 + 1];
    if (s1?.isBye && s2?.isBye && !s1?.player && !s2?.player) {
      return true;
    }
  }
  return false;
}

export function autoFillRemainingByes(
  slots: DrawSlot[],
  bracketSize: number,
  unassigned: DrawPlayer[],
): DrawSlot[] {
  const next = slots.map((s) => ({ ...s }));
  let idx = 0;
  const pairCount = bracketSize / 2;

  for (let i = 0; i < bracketSize && idx < unassigned.length; i++) {
    const slot = next[i];
    if (!slot?.player && !slot?.isBye) {
      next[i] = { slotIndex: i, player: unassigned[idx++] };
    }
  }

  for (let i = 0; i < bracketSize; i++) {
    if (!next[i]?.player && !next[i]?.isBye) {
      next[i] = { slotIndex: i, isBye: true };
    }
  }

  return syncAllPairByes(next, pairCount);
}

export function clearAllSlots(bracketSize: number): DrawSlot[] {
  return createEmptySlots(bracketSize);
}

export function hasBlockingPreviewErrors(
  preview: ManualKnockoutDrawPreview | null | undefined,
): boolean {
  if (!preview) return true;
  return preview.errors.some(
    (e) =>
      e.code !== 'SAME_CLUB_R1' && e.code !== 'LAYOUT_PLAYIN_MISMATCH',
  );
}
