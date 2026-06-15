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

import {
  formatPrintPlayerClub,
  formatPrintPlayerName,
} from './format-player-name';
import type { PrintBracketEntryRow, PrintMatchInput } from './types';

export interface PrintDrawSlot {
  position: number;
  club?: string;
  athleteLabel: string;
  isBye?: boolean;
  matchNumber?: number;
}

export function mapMatchesToPrintDrawSlots(
  allMatches: PrintMatchInput[],
  bracketSize: number,
): PrintDrawSlot[] {
  const round1 = allMatches
    .filter((m) => m.round === 1)
    .sort((a, b) => (a.bracketPosition ?? 0) - (b.bracketPosition ?? 0));

  const slots: PrintDrawSlot[] = Array.from({ length: bracketSize }, (_, i) => ({
    position: i + 1,
    athleteLabel: '—',
  }));

  const covered = new Set<number>();

  for (const match of round1) {
    const p = match.bracketPosition ?? 0;
    const pos1 = p * 2;
    const pos2 = p * 2 + 1;
    const matchNum = match.matchNumber;

    const assign = (pos: number, player: PrintMatchInput['player1'], slotLabel?: string | null) => {
      if (pos >= bracketSize) return;
      covered.add(pos);
      const isByeSide = match.isBye && !player?.name?.trim();
      slots[pos] = {
        position: pos + 1,
        club: formatPrintPlayerClub(player ?? undefined),
        athleteLabel: isByeSide
          ? 'Bye'
          : formatPrintPlayerName(player ?? undefined, slotLabel),
        isBye: isByeSide || undefined,
        matchNumber: matchNum,
      };
    };

    assign(pos1, match.player1, match.player1SlotLabel);
    assign(pos2, match.player2, match.player2SlotLabel);
  }

  for (let i = 0; i < bracketSize; i++) {
    if (!covered.has(i) && slots[i].athleteLabel === '—') {
      slots[i] = { ...slots[i], athleteLabel: 'Bye', isBye: true };
    }
  }

  return slots;
}

export function slotsToEntryRows(slots: PrintDrawSlot[]): PrintBracketEntryRow[] {
  return slots.map((s, i) => ({
    index: i + 1,
    club: s.club,
    athleteLabel: s.athleteLabel,
    isBye: s.isBye,
  }));
}

export function splitSlotsIntoHalves(slots: PrintDrawSlot[]): {
  halfA: PrintDrawSlot[];
  halfB: PrintDrawSlot[];
} {
  const mid = Math.ceil(slots.length / 2);
  return {
    halfA: slots.slice(0, mid),
    halfB: slots.slice(mid),
  };
}

export function pairSlotsToMatches(slots: PrintDrawSlot[]): Array<{
  top: PrintDrawSlot;
  bottom: PrintDrawSlot;
  matchNumber: number;
}> {
  const pairs: Array<{
    top: PrintDrawSlot;
    bottom: PrintDrawSlot;
    matchNumber: number;
  }> = [];
  for (let i = 0; i < slots.length; i += 2) {
    pairs.push({
      top: slots[i]!,
      bottom: slots[i + 1] ?? {
        position: i + 2,
        athleteLabel: 'Bye',
        isBye: true,
      },
      matchNumber: slots[i]?.matchNumber ?? Math.floor(i / 2) + 1,
    });
  }
  return pairs;
}
