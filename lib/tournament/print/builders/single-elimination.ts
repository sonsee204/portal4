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
  splitSlotsIntoHalves,
} from '../map-draw-slots';
import { nextPowerOf2, roundShortLabel } from '../round-labels';
import type {
  PrintBracketHalf,
  PrintBracketRoundColumn,
  PrintCategoryInput,
  PrintMatchInput,
} from '../types';

function resolveBracketSize(
  category: PrintCategoryInput,
  matches: PrintMatchInput[],
): number {
  if (category.bracketSize && category.bracketSize >= 2) {
    return category.bracketSize;
  }
  const round1Count = matches.filter((m) => m.round === 1).length;
  return nextPowerOf2(Math.max(2, round1Count * 2));
}

function buildRoundColumns(
  matches: PrintMatchInput[],
  entryCount: number,
  halfOffset: number,
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
    const shortLabel = roundShortLabel(ri, totalRounds, label);
    const span = Math.max(1, entryCount / Math.max(1, roundMatches.length));

    return {
      label,
      shortLabel,
      matches: roundMatches.map((m, mi) => {
        const pair = formatPrintMatchPair(
          m.player1,
          m.player2,
          m.player1SlotLabel,
          m.player2SlotLabel,
          m.isBye,
        );
        const rowIndexFrom = halfOffset + Math.floor(mi * span);
        const rowIndexTo = halfOffset + Math.floor((mi + 1) * span) - 1;
        return {
          matchNumber: m.matchNumber,
          matchId: m.id,
          rowIndexFrom,
          rowIndexTo,
          player1Label: pair.player1,
          player2Label: pair.player2,
        };
      }),
    };
  });
}

function buildHalf(
  title: string,
  matches: PrintMatchInput[],
  bracketSize: number,
  halfOffset: number,
): PrintBracketHalf {
  const slots = mapMatchesToPrintDrawSlots(matches, bracketSize);
  return {
    title,
    entries: slotsToEntryRows(slots),
    rounds: buildRoundColumns(matches, slots.length, halfOffset),
  };
}

export function buildSingleEliminationBracket(
  category: PrintCategoryInput,
  matches: PrintMatchInput[],
): PrintBracketHalf[] {
  const effectiveSize = resolveBracketSize(category, matches);
  const slots = mapMatchesToPrintDrawSlots(matches, effectiveSize);

  if (effectiveSize > 32) {
    const { halfA, halfB } = splitSlotsIntoHalves(slots);
    return [
      buildHalf(`${category.title} — Nhánh 1`, matches, halfA.length, 0),
      buildHalf(`${category.title} — Nhánh 2`, matches, halfB.length, 0),
    ];
  }

  return [
    {
      title: category.title,
      entries: slotsToEntryRows(slots),
      rounds: buildRoundColumns(matches, effectiveSize, 0),
    },
  ];
}

export function buildKnockoutHalvesFromMatches(
  categoryTitle: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf[] {
  if (matches.length === 0) return [];
  const effectiveSize = bracketSize >= 2 ? bracketSize : resolveBracketSize(
    { id: '', title: categoryTitle, format: 'SINGLE_ELIMINATION' },
    matches,
  );
  const slots = mapMatchesToPrintDrawSlots(matches, effectiveSize);
  if (effectiveSize > 32) {
    const { halfA, halfB } = splitSlotsIntoHalves(slots);
    return [
      buildHalf(`${categoryTitle} — Nhánh 1`, matches, halfA.length, 0),
      buildHalf(`${categoryTitle} — Nhánh 2`, matches, halfB.length, 0),
    ];
  }
  return [
    {
      title: categoryTitle,
      entries: slotsToEntryRows(slots),
      rounds: buildRoundColumns(matches, effectiveSize, 0),
    },
  ];
}
