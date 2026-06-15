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
  resolveEffectiveBracketPositions,
} from '../bracket-row-layout';
import { formatPrintMatchPair } from '../format-player-name';
import { formatPrintScheduledLabel } from '../format-print-scheduled-label';
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

/**
 * Build round columns for one half of the bracket.
 *
 * Always generates ALL expected round columns (log₂(fullBracketSize)), even
 * when later rounds have no match data yet.  This ensures every category
 * always looks like a complete bracket structure regardless of which rounds
 * have been played.
 */
function buildRoundColumns(
  matches: PrintMatchInput[],
  halfSlotStart: number,
  halfSlotCount: number,
  fullBracketSize: number,
): PrintBracketRoundColumn[] {
  const bpMap = resolveEffectiveBracketPositions(matches);

  const roundsMap = new Map<number, PrintMatchInput[]>();
  for (const m of matches) {
    const list = roundsMap.get(m.round) ?? [];
    list.push(m);
    roundsMap.set(m.round, list);
  }

  const totalRounds = eliminationRoundCount(fullBracketSize);

  // Pre-generate every round column (1 … totalRounds) so the bracket always
  // shows the full skeleton even before later rounds are played.
  return Array.from({ length: totalRounds }, (_, idx) => {
    const roundNum = idx + 1;
    const roundMatches = (roundsMap.get(roundNum) ?? []).sort(
      (a, b) => (bpMap.get(a.id) ?? 0) - (bpMap.get(b.id) ?? 0),
    );

    const dataLabel = roundMatches[0]?.roundLabel ?? '';
    // Compute label purely from position when no match data exists for this round.
    const shortLabel = roundShortLabel(idx, totalRounds, dataLabel);
    const label = dataLabel || shortLabel;

    const positionedMatches = roundMatches
      .map((m) => {
        const bp = bpMap.get(m.id) ?? 0;
        const { globalFrom, globalTo } = matchGlobalRowSpan(roundNum, bp, bp);
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
          scheduledLabel: formatPrintScheduledLabel(m),
        };
      })
      .filter((m): m is NonNullable<typeof m> => m !== null);

    return { label, shortLabel, matches: positionedMatches };
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

  // Split into two halves for brackets with 32+ players so each half fits a
  // portrait/landscape page with a readable number of rows.
  if (effectiveSize >= 32) {
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
  if (effectiveSize >= 32) {
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
