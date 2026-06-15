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
import {
  mapMatchesToPrintDrawSlots,
  slotsToEntryRows,
} from '../map-draw-slots';
import { nextPowerOf2, roundShortLabel } from '../round-labels';
import type {
  PrintBracketHalf,
  PrintBracketRoundColumn,
  PrintCategoryInput,
  PrintMatchInput,
} from '../types';

function isLosersBracketMatch(m: PrintMatchInput): boolean {
  return !!m.losersNextMatchId || m.roundLabel.toLowerCase().includes('thua');
}

function buildRoundColumnsForSubset(
  matches: PrintMatchInput[],
  entryCount: number,
): PrintBracketRoundColumn[] {
  const roundsMap = new Map<number, PrintMatchInput[]>();
  for (const m of matches) {
    const list = roundsMap.get(m.round) ?? [];
    list.push(m);
    roundsMap.set(m.round, list);
  }
  const roundNums = [...roundsMap.keys()].sort((a, b) => a - b);
  const totalRounds = roundNums.length;

  return roundNums.map((roundNum, ri) => {
    const roundMatches = (roundsMap.get(roundNum) ?? []).sort(
      (a, b) =>
        (a.bracketPosition ?? a.matchNumber) -
        (b.bracketPosition ?? b.matchNumber),
    );
    const label = roundMatches[0]?.roundLabel ?? `Vòng ${roundNum}`;
    const span = Math.max(1, entryCount / Math.max(1, roundMatches.length));

    return {
      label,
      shortLabel: roundShortLabel(ri, totalRounds, label),
      matches: roundMatches.map((m, mi) => {
        const pair = formatPrintMatchPair(
          m.player1,
          m.player2,
          m.player1SlotLabel,
          m.player2SlotLabel,
          m.isBye,
        );
        return {
          matchNumber: m.matchNumber,
          matchId: m.id,
          rowIndexFrom: Math.floor(mi * span),
          rowIndexTo: Math.floor((mi + 1) * span) - 1,
          player1Label: pair.player1,
          player2Label: pair.player2,
        };
      }),
    };
  });
}

function buildBracketHalf(
  title: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf {
  const slots = mapMatchesToPrintDrawSlots(matches, bracketSize);
  return {
    title,
    entries: slotsToEntryRows(slots),
    rounds: buildRoundColumnsForSubset(matches, slots.length),
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
