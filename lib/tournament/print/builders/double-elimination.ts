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
  intersectHalfSpan,
  matchGlobalRowSpan,
  resolveEffectiveBracketPositions,
} from '../bracket-row-layout';
import { formatPrintMatchPair } from '../format-player-name';
import { formatPrintScheduledLabel } from '../format-print-scheduled-label';
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

/**
 * Build round columns for a half of an elimination bracket.
 *
 * Always generates ALL expected round columns up to max(log₂(bracketSize),
 * highestDataRound) so the printed sheet always shows the full bracket
 * skeleton even when later rounds have not been played yet.
 */
function buildRoundColumnsWithTree(
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketRoundColumn[] {
  const bpMap = resolveEffectiveBracketPositions(matches);

  const roundsMap = new Map<number, PrintMatchInput[]>();
  for (const m of matches) {
    const list = roundsMap.get(m.round) ?? [];
    list.push(m);
    roundsMap.set(m.round, list);
  }

  const roundNums = [...roundsMap.keys()].sort((a, b) => a - b);
  const maxDataRound = roundNums[roundNums.length - 1] ?? 0;
  // Use the larger of the structurally-expected count vs actual data rounds so
  // we never under-render (missing structural columns) or over-render (spurious
  // columns beyond what the bracket format calls for).
  const totalRounds = Math.max(eliminationRoundCount(bracketSize), maxDataRound);

  return Array.from({ length: totalRounds }, (_, idx) => {
    const roundNum = idx + 1;
    const roundMatches = (roundsMap.get(roundNum) ?? []).sort(
      (a, b) => (bpMap.get(a.id) ?? 0) - (bpMap.get(b.id) ?? 0),
    );

    const dataLabel = roundMatches[0]?.roundLabel ?? '';
    const shortLabel = roundShortLabel(idx, totalRounds, dataLabel);
    const label = dataLabel || shortLabel;

    const positionedMatches = roundMatches
      .map((m) => {
        const bp = bpMap.get(m.id) ?? 0;
        const { globalFrom, globalTo } = matchGlobalRowSpan(roundNum, bp, bp);
        const local = intersectHalfSpan(globalFrom, globalTo, 0, bracketSize);
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

function buildBracketHalf(
  title: string,
  matches: PrintMatchInput[],
  bracketSize: number,
): PrintBracketHalf {
  const slots = mapMatchesToPrintDrawSlots(matches, bracketSize);
  return {
    title,
    entries: slotsToEntryRows(slots),
    rounds: buildRoundColumnsWithTree(matches, slots.length),
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
