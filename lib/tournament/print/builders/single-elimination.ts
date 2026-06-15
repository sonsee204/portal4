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
  normalizeMatchesForEliminationPrint,
  resolveEffectiveBracketPositions,
} from '../bracket-row-layout';
import { formatPrintMatchPair } from '../format-player-name';
import {
  formatPrintScheduledLabel,
  formatPrintScoreLabel,
  resolvePrintWinnerSide,
} from '../format-print-scheduled-label';
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
  const normalized = normalizeMatchesForEliminationPrint(matches);
  const round1Count = normalized.filter((m) => m.round === 1).length;
  return nextPowerOf2(Math.max(2, round1Count * 2));
}

function toPositionedMatch(
  m: PrintMatchInput,
  local: { localFrom: number; localTo: number },
): PrintBracketRoundColumn['matches'][number] {
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
    scoreLabel: formatPrintScoreLabel(m),
    winnerSide: resolvePrintWinnerSide(m),
  };
}

/**
 * Compute how many slots to actually render.
 *
 * Trailing slots where every player is a Bye (no registered participant) are
 * stripped so the printed half doesn't show empty rows at the bottom.  The
 * count is always rounded up to the next even number so every displayed pair
 * stays intact.
 */
function computeVisibleSlotCount(slots: PrintDrawSlot[]): number {
  let lastNonByeIdx = -1;
  for (let i = slots.length - 1; i >= 0; i--) {
    if (!slots[i]?.isBye) {
      lastNonByeIdx = i;
      break;
    }
  }
  if (lastNonByeIdx < 0) {
    // All slots are Bye – keep the minimum (2 rows = 1 pair) rather than hiding the half entirely.
    return Math.min(slots.length, 2);
  }
  // Round up to the next even number so the last pair is always complete.
  return Math.min(slots.length, Math.ceil((lastNonByeIdx + 1) / 2) * 2);
}

/**
 * Build round columns for one half of an elimination bracket.
 *
 * Generates the FULL bracket skeleton: every structural match position in
 * every expected round (log₂(fullBracketSize) rounds, or up to the highest
 * data round when overridden) gets a box, even when the corresponding match
 * has not been created/scheduled yet.  Real match data (number, schedule,
 * players) is overlaid onto the skeleton wherever a match exists at that
 * (round, bracketPosition).  This guarantees the printed sheet always shows
 * the complete bracket — no missing semifinals/finals — so officials can fill
 * in results by hand.
 *
 * @param totalRoundsOverride Force a specific column count (used by double
 *   elimination where data rounds can exceed the structural depth).
 * @param fillSkeleton When true (default) empty structural positions render as
 *   placeholder boxes; set false for irregular trees (e.g. losers bracket)
 *   where only real matches should be drawn.
 */
export function buildEliminationRoundColumns(
  matches: PrintMatchInput[],
  halfSlotStart: number,
  halfSlotCount: number,
  fullBracketSize: number,
  totalRoundsOverride?: number,
  fillSkeleton = true,
): PrintBracketRoundColumn[] {
  const normalized = normalizeMatchesForEliminationPrint(matches);
  const bpMap = resolveEffectiveBracketPositions(normalized);

  const roundsMap = new Map<number, PrintMatchInput[]>();
  for (const m of normalized) {
    const list = roundsMap.get(m.round) ?? [];
    list.push(m);
    roundsMap.set(m.round, list);
  }

  const totalRounds =
    totalRoundsOverride ?? eliminationRoundCount(fullBracketSize);

  return Array.from({ length: totalRounds }, (_, idx) => {
    const roundNum = idx + 1;
    const span = 2 ** roundNum;
    const roundMatches = roundsMap.get(roundNum) ?? [];

    const dataLabel = roundMatches[0]?.roundLabel ?? '';
    const shortLabel = roundShortLabel(idx, totalRounds, dataLabel);
    const label = dataLabel || shortLabel;

    const structuralPositions = Math.floor(fullBracketSize / span);
    const dataMaxPos = roundMatches.reduce(
      (max, m) => Math.max(max, bpMap.get(m.id) ?? 0),
      -1,
    );
    const lastPos = Math.max(structuralPositions - 1, dataMaxPos);

    // Assign real matches to structural slots by bracketPosition, then fill
    // any remaining slots with unplaced matches (sorted by matchNumber) so
    // completed tournaments never lose semifinals/finals due to bad metadata.
    const slotAssignments: Array<PrintMatchInput | undefined> = Array.from(
      { length: lastPos + 1 },
      () => undefined,
    );
    for (const m of roundMatches) {
      const bp = bpMap.get(m.id) ?? 0;
      if (bp >= 0 && bp <= lastPos && slotAssignments[bp] === undefined) {
        slotAssignments[bp] = m;
      }
    }
    const unplaced = roundMatches
      .filter((m) => !slotAssignments.includes(m))
      .sort((a, b) => a.matchNumber - b.matchNumber);
    for (const m of unplaced) {
      const emptyIdx = slotAssignments.findIndex((s) => s === undefined);
      if (emptyIdx >= 0) slotAssignments[emptyIdx] = m;
    }

    const positionedMatches: PrintBracketRoundColumn['matches'] = [];
    for (let p = 0; p <= lastPos; p += 1) {
      const { globalFrom, globalTo } = matchGlobalRowSpan(roundNum, p, p);
      const local = intersectHalfSpan(
        globalFrom,
        globalTo,
        halfSlotStart,
        halfSlotCount,
      );
      if (!local) continue;

      const m = slotAssignments[p];
      if (m) {
        positionedMatches.push(toPositionedMatch(m, local));
      } else if (fillSkeleton) {
        positionedMatches.push({
          matchId: `placeholder-r${roundNum}-p${p}`,
          rowIndexFrom: local.localFrom,
          rowIndexTo: local.localTo,
          isPlaceholder: true,
        });
      }
    }

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
  // Trim trailing all-Bye rows so printed halves don't show empty rows when
  // fewer participants are registered than the bracket size.
  const visibleCount = computeVisibleSlotCount(slots);
  const visibleSlots = slots.slice(0, visibleCount);

  const halfMatches = filterMatchesForHalf(matches, halfSlotStart, visibleCount);
  return {
    title,
    entries: slotsToEntryRows(visibleSlots),
    rounds: buildEliminationRoundColumns(
      halfMatches,
      halfSlotStart,
      visibleCount,
      fullBracketSize,
    ),
  };
}

export function buildSingleEliminationBracket(
  category: PrintCategoryInput,
  matches: PrintMatchInput[],
): PrintBracketHalf[] {
  const normalized = normalizeMatchesForEliminationPrint(matches);
  const effectiveSize = resolveBracketSize(category, normalized);
  const slots = mapMatchesToPrintDrawSlots(normalized, effectiveSize);

  // Split into two halves for brackets with 32+ players so each half fits a
  // portrait/landscape page with a readable number of rows.
  if (effectiveSize >= 32) {
    const { halfA, halfB } = splitSlotsIntoHalves(slots);
    const halfBStart = halfA.length;
    return [
      buildHalfFromSlots(
        `${category.title} — Nhánh 1`,
        normalized,
        halfA,
        0,
        effectiveSize,
      ),
      buildHalfFromSlots(
        `${category.title} — Nhánh 2`,
        normalized,
        halfB,
        halfBStart,
        effectiveSize,
      ),
    ];
  }

  return [
    buildHalfFromSlots(category.title, normalized, slots, 0, effectiveSize),
  ];
}

export function buildKnockoutHalvesFromMatches(
  categoryTitle: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf[] {
  if (matches.length === 0) return [];
  const normalized = normalizeMatchesForEliminationPrint(matches);
  const effectiveSize =
    bracketSize >= 2
      ? bracketSize
      : resolveBracketSize(
        { id: '', title: categoryTitle, format: 'SINGLE_ELIMINATION' },
        normalized,
      );
  const slots = mapMatchesToPrintDrawSlots(normalized, effectiveSize);
  if (effectiveSize >= 32) {
    const { halfA, halfB } = splitSlotsIntoHalves(slots);
    const halfBStart = halfA.length;
    return [
      buildHalfFromSlots(
        `${categoryTitle} — Nhánh 1`,
        normalized,
        halfA,
        0,
        effectiveSize,
      ),
      buildHalfFromSlots(
        `${categoryTitle} — Nhánh 2`,
        normalized,
        halfB,
        halfBStart,
        effectiveSize,
      ),
    ];
  }
  return [
    buildHalfFromSlots(categoryTitle, normalized, slots, 0, effectiveSize),
  ];
}
