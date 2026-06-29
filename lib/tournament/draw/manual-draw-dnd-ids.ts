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

export const MANUAL_DRAW_POOL_ID = 'manual-draw-pool';

export function manualDrawPoolPlayerId(playerId: string): string {
  return `manual-draw-pool-player:${playerId}`;
}

export function manualDrawLeafId(slotIndex: number): string {
  return `manual-draw-leaf:${slotIndex}`;
}

export function parseManualDrawPoolPlayerId(id: string): string | null {
  const prefix = 'manual-draw-pool-player:';
  return id.startsWith(prefix) ? id.slice(prefix.length) : null;
}

export function parseManualDrawLeafId(id: string): number | null {
  const prefix = 'manual-draw-leaf:';
  if (!id.startsWith(prefix)) return null;
  const n = Number(id.slice(prefix.length));
  return Number.isFinite(n) ? n : null;
}

export function isManualDrawPoolId(id: string): boolean {
  return id === MANUAL_DRAW_POOL_ID;
}
