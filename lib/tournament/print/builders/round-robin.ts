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
import { formatPrintScheduledLabel } from '../format-print-scheduled-label';
import type { PrintMatchInput, PrintRoundRobinRow } from '../types';

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
        scheduledLabel: formatPrintScheduledLabel(m),
      };
    });
}
