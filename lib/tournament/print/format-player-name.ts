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

import type { PrintPlayerInput } from './types';

export function formatPrintPlayerName(
  player: PrintPlayerInput | null | undefined,
  slotLabel?: string | null,
): string {
  if (player?.name?.trim()) {
    const members = player.members
      ?.map((m) => m?.name?.trim())
      .filter(Boolean) as string[] | undefined;
    if (members && members.length > 0) {
      return members.join(' & ');
    }
    return player.name.trim();
  }
  if (slotLabel?.trim()) return slotLabel.trim();
  return '—';
}

export function formatPrintPlayerClub(
  player: PrintPlayerInput | null | undefined,
): string | undefined {
  if (player?.club?.trim()) return player.club.trim();
  const memberClub = player?.members?.find((m) => m?.club?.trim())?.club?.trim();
  return memberClub || undefined;
}

export function formatPrintMatchPair(
  player1: PrintPlayerInput | null | undefined,
  player2: PrintPlayerInput | null | undefined,
  slot1?: string | null,
  slot2?: string | null,
  isBye?: boolean,
): { player1: string; player2: string } {
  const p1 = formatPrintPlayerName(player1, slot1);
  const p2 = formatPrintPlayerName(player2, slot2);
  if (isBye) {
    if (p1 === '—') return { player1: 'Bye', player2: p2 };
    if (p2 === '—') return { player1: p1, player2: 'Bye' };
  }
  return { player1: p1, player2: p2 };
}
