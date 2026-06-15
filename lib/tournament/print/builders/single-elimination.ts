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
  eliminationRoundCount,
  filterMatchesForHalf,
  intersectHalfSpan,
  matchGlobalRowSpan,
} from '../bracket-row-layout';
import { formatPrintMatchPair } from '../format-player-name';
import {
  mapMatchesToPrintDrawSlots,
  slotsToEntryRows,
  splitSlotsIntoHalves,
  type PrintDrawSlot,
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
  halfSlotStart: number,
  halfSlotCount: number,
  fullBracketSize: number,
): PrintBracketRoundColumn[] {
  const roundsMap = new Map<number, PrintMatchInput[]>();
  for (const m of matches) {
    const list = roundsMap.get(m.round) ?? [];
    list.push(m);
    roundsMap.set(m.round, list);
  }

  const roundNums = [...roundsMap.keys()].sort((a, b) => a - b);
  const totalRounds = eliminationRoundCount(fullBracketSize);

  return roundNums.map((roundNum) => {
    const roundMatches = (roundsMap.get(roundNum) ?? []).sort(
      (a, b) =>
        (a.bracketPosition ?? a.matchNumber) -
        (b.bracketPosition ?? b.matchNumber),
    );
    const label = roundMatches[0]?.roundLabel ?? `Vòng ${roundNum}`;
    const shortLabel = roundShortLabel(roundNum - 1, totalRounds, label);

    const positionedMatches = roundMatches
      .map((m, mi) => {
        const { globalFrom, globalTo } = matchGlobalRowSpan(
          roundNum,
          m.bracketPosition,
          mi,
        );
        const local = intersectHalfSpan(
          globalFrom,
          globalTo,
          halfSlotStart,
          halfSlotCount,
        );
        if (!local) return null;

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
          rowIndexFrom: local.localFrom,
          rowIndexTo: local.localTo,
          player1Label: pair.player1,
          player2Label: pair.player2,
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);

    return {
      label,
      shortLabel,
      matches: positionedMatches,
    };
  });
}

function buildHalfFromSlots(
  title: string,
  matches: PrintMatchInput[],
  slots: PrintDrawSlot[],
  halfSlotStart: number,
  fullBracketSize: number,
): PrintBracketHalf {
  const halfMatches = filterMatchesForHalf(
    matches,
    halfSlotStart,
    slots.length,
  );
  return {
    title,
    entries: slotsToEntryRows(slots),
    rounds: buildRoundColumns(
      halfMatches,
      halfSlotStart,
      slots.length,
      fullBracketSize,
    ),
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
    const halfBStart = halfA.length;
    return [
      buildHalfFromSlots(
        `${category.title} — Nhánh 1`,
        matches,
        halfA,
        0,
        effectiveSize,
      ),
      buildHalfFromSlots(
        `${category.title} — Nhánh 2`,
        matches,
        halfB,
        halfBStart,
        effectiveSize,
      ),
    ];
  }

  return [
    buildHalfFromSlots(category.title, matches, slots, 0, effectiveSize),
  ];
}

export function buildKnockoutHalvesFromMatches(
  categoryTitle: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf[] {
  if (matches.length === 0) return [];
  const effectiveSize =
    bracketSize >= 2
      ? bracketSize
      : resolveBracketSize(
          { id: '', title: categoryTitle, format: 'SINGLE_ELIMINATION' },
          matches,
        );
  const slots = mapMatchesToPrintDrawSlots(matches, effectiveSize);
  if (effectiveSize > 32) {
    const { halfA, halfB } = splitSlotsIntoHalves(slots);
    const halfBStart = halfA.length;
    return [
      buildHalfFromSlots(
        `${categoryTitle} — Nhánh 1`,
        matches,
        halfA,
        0,
        effectiveSize,
      ),
      buildHalfFromSlots(
        `${categoryTitle} — Nhánh 2`,
        matches,
        halfB,
        halfBStart,
        effectiveSize,
      ),
    ];
  }
  return [
    buildHalfFromSlots(categoryTitle, matches, slots, 0, effectiveSize),
  ];
}
