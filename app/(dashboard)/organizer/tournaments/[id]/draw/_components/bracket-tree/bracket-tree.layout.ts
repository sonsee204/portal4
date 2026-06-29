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

export const BRACKET_CARD_HEIGHT = 192;
export const BRACKET_CARD_WIDTH = 288;
export const BASE_GAP = 24;
export const CONNECTOR_W = 64;
export const LABEL_H = 40;

export function computeGap(roundIndex: number): number {
  if (roundIndex === 0) return BASE_GAP;
  return (
    BRACKET_CARD_HEIGHT * Math.pow(2, roundIndex) -
    BRACKET_CARD_HEIGHT +
    BASE_GAP * Math.pow(2, roundIndex)
  );
}

export function computeTopPad(roundIndex: number): number {
  if (roundIndex === 0) return 0;
  return (computeGap(roundIndex) - BASE_GAP) / 2;
}
