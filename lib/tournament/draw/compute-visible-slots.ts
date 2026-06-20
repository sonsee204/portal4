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

import type { DrawSlot } from './types';

/** Visible leaf rows for fishbone editor (pairs × 2). */
export function computeVisibleSlotCount(
  bracketSize: number,
  slots: DrawSlot[],
  playerCount?: number,
): number {
  if (playerCount != null && playerCount > 0) {
    const minPairs = Math.ceil(playerCount / 2);
    return Math.min(bracketSize, minPairs * 2);
  }

  let lastUsed = -1;
  for (const slot of slots) {
    if (slot.player || slot.isBye) {
      lastUsed = Math.max(lastUsed, slot.slotIndex);
    }
  }

  if (lastUsed < 0) {
    return Math.min(bracketSize, 8);
  }

  const pairsNeeded = Math.floor(lastUsed / 2) + 1;
  return Math.min(bracketSize, pairsNeeded * 2);
}

export function computeVisiblePairCount(
  bracketSize: number,
  slots: DrawSlot[],
  playerCount?: number,
): number {
  return computeVisibleSlotCount(bracketSize, slots, playerCount) / 2;
}
