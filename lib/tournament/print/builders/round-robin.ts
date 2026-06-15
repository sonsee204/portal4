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

import { formatPrintMatchPair } from '../format-player-name';
import type { PrintMatchInput, PrintRoundRobinRow } from '../types';

function scheduledLabel(m: PrintMatchInput): string | undefined {
  if (!m.scheduledAt) return undefined;
  try {
    return new Date(m.scheduledAt).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return undefined;
  }
}

export function buildRoundRobinRows(
  matches: PrintMatchInput[],
): PrintRoundRobinRow[] {
  return [...matches]
    .sort((a, b) => a.round - b.round || a.matchNumber - b.matchNumber)
    .map((m) => {
      const pair = formatPrintMatchPair(
        m.player1,
        m.player2,
        m.player1SlotLabel,
        m.player2SlotLabel,
        m.isBye,
      );
      return {
        matchNumber: m.matchNumber,
        roundLabel: m.roundLabel,
        player1: pair.player1,
        player2: pair.player2,
        scheduledLabel: scheduledLabel(m),
      };
    });
}
