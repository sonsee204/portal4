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

import { eliminationRoundCount, normalizeMatchesForEliminationPrint } from '../bracket-row-layout';
import {
  mapMatchesToPrintDrawSlots,
  slotsToEntryRows,
} from '../map-draw-slots';
import { nextPowerOf2 } from '../round-labels';
import type {
  PrintBracketHalf,
  PrintCategoryInput,
  PrintMatchInput,
} from '../types';
import { buildEliminationRoundColumns } from './single-elimination';

function isLosersBracketMatch(m: PrintMatchInput): boolean {
  return !!m.losersNextMatchId || m.roundLabel.toLowerCase().includes('thua');
}

function buildBracketHalf(
  title: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf {
  const normalized = normalizeMatchesForEliminationPrint(matches);
  const slots = mapMatchesToPrintDrawSlots(normalized, bracketSize);

  const maxDataRound = normalized.reduce(
    (max, m) => Math.max(max, m.round),
    0,
  );
  const totalRounds = Math.max(
    eliminationRoundCount(slots.length),
    maxDataRound,
  );

  return {
    title,
    entries: slotsToEntryRows(slots),
    rounds: buildEliminationRoundColumns(
      normalized,
      0,
      slots.length,
      slots.length,
      totalRounds,
      false,
    ),
  };
}

export function buildDoubleEliminationBracket(
  category: PrintCategoryInput,
  matches: PrintMatchInput[],
): PrintBracketHalf[] {
  const winners = matches.filter((m) => !isLosersBracketMatch(m));
  const losers = matches.filter((m) => isLosersBracketMatch(m));

  const winnersSize =
    category.bracketSize ??
    nextPowerOf2(Math.max(2, winners.filter((m) => m.round === 1).length * 2));

  const halves: PrintBracketHalf[] = [
    buildBracketHalf(`${category.title} — Nhánh thắng`, winners, winnersSize),
  ];

  if (losers.length > 0) {
    const losersSize = nextPowerOf2(
      Math.max(2, losers.filter((m) => m.round === 1).length * 2),
    );
    halves.push(
      buildBracketHalf(`${category.title} — Nhánh thua`, losers, losersSize),
    );
  }

  return halves;
}
