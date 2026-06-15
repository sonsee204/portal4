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

import { describe, expect, it } from 'vitest';
import { buildMasterSchedule } from './build-master-schedule';
import { buildBracketDocument, computePrintReadiness } from './build-bracket-sheet';
import {
  intersectHalfSpan,
  matchGlobalRowSpan,
  eliminationRoundCount,
} from './bracket-row-layout';
import { buildKnockoutHalvesFromMatches, buildSingleEliminationBracket } from './builders/single-elimination';
import { dedupePrintMatchesById } from './dedupe-matches';
import { formatPrintScheduledLabel } from './format-print-scheduled-label';
import { formatDateRangeLabel } from './round-labels';
import type {
  PrintCategoryInput,
  PrintMatchInput,
  PrintScheduleMatchInput,
  PrintTournamentInput,
} from './types';

const tournament: PrintTournamentInput = {
  id: 't1',
  title: 'Giải test',
  status: 'PUBLISHED',
  locationName: 'Sân ABC',
  startDate: '2026-06-15',
  courtCount: 7,
};

function cat(format: PrintCategoryInput['format']): PrintCategoryInput {
  return {
    id: 'c1',
    title: 'Đôi nam',
    format,
    status: 'DRAW_COMPLETED',
    bracketSize: 8,
    displayOrder: 0,
  };
}

function match(partial: Partial<PrintMatchInput> & Pick<PrintMatchInput, 'id' | 'matchNumber'>): PrintMatchInput {
  return {
    categoryId: 'c1',
    round: 1,
    roundLabel: 'Vòng 1',
    status: 'NOT_STARTED',
    isBye: false,
    ...partial,
  };
}

describe('print kernel', () => {
  it('dedupePrintMatchesById keeps last', () => {
    const a = match({ id: 'm1', matchNumber: 1, player1: { name: 'A' } });
    const b = match({ id: 'm1', matchNumber: 1, player1: { name: 'B' } });
    expect(dedupePrintMatchesById([a, b])[0]?.player1?.name).toBe('B');
  });

  it('buildMasterSchedule groups by hour and category', () => {
    const schedule: PrintScheduleMatchInput[] = [
      {
        id: '1',
        matchNumber: 1,
        categoryId: 'c1',
        categoryTitle: 'Đôi nam',
        round: 1,
        roundLabel: 'R16',
        scheduledDate: '2026-06-15',
        startTime: '08:30',
      },
      {
        id: '2',
        matchNumber: 2,
        categoryId: 'c1',
        categoryTitle: 'Đôi nam',
        round: 1,
        roundLabel: 'R16',
        scheduledDate: '2026-06-15',
        startTime: '08:45',
      },
    ];
    const doc = buildMasterSchedule(tournament, [cat('SINGLE_ELIMINATION')], schedule, 5);
    expect(doc.grandTotal).toBe(2);
    expect(doc.sections[0]?.rows[0]?.matchCount).toBe(2);
    expect(doc.unscheduledCount).toBe(3);
  });

  it('buildBracketDocument single elimination', () => {
    const matches: PrintMatchInput[] = [
      match({
        id: 'm1',
        matchNumber: 1,
        bracketPosition: 0,
        player1: { name: 'A', club: 'CLB A' },
        player2: { name: 'B' },
      }),
      match({
        id: 'm2',
        matchNumber: 2,
        bracketPosition: 1,
        player1: { name: 'C' },
        player2: { name: 'D' },
      }),
    ];
    const doc = buildBracketDocument(tournament, cat('SINGLE_ELIMINATION'), matches);
    expect(doc?.format).toBe('SINGLE_ELIMINATION');
    expect(doc?.halves?.[0]?.entries.length).toBeGreaterThan(0);
  });

  // ── schedule label ──────────────────────────────────────────────────────

  it('formatPrintScheduledLabel format: time · date · court', () => {
    // Use a timezone-agnostic check — we only verify structure, not the exact
    // hour value, because getHours() depends on the test runner's locale.
    const label = formatPrintScheduledLabel({
      scheduledAt: '2026-06-15T08:30:00.000Z',
      courtName: 'S1',
    });
    // Expected format: HH:mm · DD/MM · court
    expect(label).toMatch(/^\d{2}:\d{2} · \d{2}\/\d{2} · S1$/);
  });

  it('formatPrintScheduledLabel returns undefined when no scheduledAt', () => {
    expect(formatPrintScheduledLabel({ scheduledAt: null })).toBeUndefined();
    expect(formatPrintScheduledLabel({ scheduledAt: undefined })).toBeUndefined();
  });

  it('formatPrintScheduledLabel omits court when absent', () => {
    const label = formatPrintScheduledLabel({ scheduledAt: '2026-06-15T08:30:00.000Z' });
    expect(label).toMatch(/^\d{2}:\d{2} · \d{2}\/\d{2}$/);
  });

  it('single elimination bracket includes scheduledLabel on matches', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 8 };
    const matches: PrintMatchInput[] = [
      match({
        id: 'm1',
        matchNumber: 1,
        bracketPosition: 0,
        scheduledAt: '2026-06-15T08:30:00.000Z',
        courtName: 'S1',
        player1: { name: 'A' },
        player2: { name: 'B' },
      }),
    ];
    const halves = buildSingleEliminationBracket(category, matches);
    expect(halves[0]?.rounds[0]?.matches[0]?.scheduledLabel).toContain('S1');
  });

  // ── round column pre-generation ──────────────────────────────────────────

  it('pre-generates all round columns even when later rounds have no data', () => {
    // bracketSize=16 → 4 rounds (R16, TK, BK, CK).
    // Only round 1 has match data → should still produce 4 columns.
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 16 };
    const matches: PrintMatchInput[] = [
      match({ id: 'm1', matchNumber: 1, round: 1, bracketPosition: 0 }),
    ];
    const halves = buildSingleEliminationBracket(category, matches);
    const expectedRounds = eliminationRoundCount(16); // 4
    expect(halves[0]?.rounds.length).toBe(expectedRounds);
    // Empty rounds still have correct labels
    expect(halves[0]?.rounds[0]?.shortLabel).toBe('R16');
    expect(halves[0]?.rounds[1]?.shortLabel).toBe('TK');
    expect(halves[0]?.rounds[2]?.shortLabel).toBe('BK');
    expect(halves[0]?.rounds[3]?.shortLabel).toBe('CK');
    // Later rounds render structural placeholder boxes (full skeleton) so the
    // printed sheet shows the whole bracket; they carry no real match data.
    const laterRound = halves[0]?.rounds[1];
    expect(laterRound?.matches.length).toBeGreaterThan(0);
    expect(
      laterRound?.matches.every(
        (m) => m.isPlaceholder === true && m.matchNumber === undefined,
      ),
    ).toBe(true);
  });

  it('renders full skeleton: missing semifinal + final still get boxes', () => {
    // 8-player bracket = 4 QF + 2 SF + 1 final. Provide all 4 QF but only ONE
    // semifinal (and no final) → BK column must still show 2 boxes and CK 1 box.
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 8 };
    const qf: PrintMatchInput[] = Array.from({ length: 4 }, (_, i) =>
      match({
        id: `qf-${i}`,
        matchNumber: 95 + i,
        round: 1,
        bracketPosition: i,
        player1: { name: `A${i}` },
        player2: { name: `B${i}` },
      }),
    );
    const sf0 = match({
      id: 'sf-0',
      matchNumber: 99,
      round: 2,
      bracketPosition: 0,
    });
    const halves = buildSingleEliminationBracket(category, [...qf, sf0]);
    const half = halves[0]!;
    expect(half.rounds.map((r) => r.shortLabel)).toEqual(['TK', 'BK', 'CK']);
    expect(half.rounds[0]?.matches).toHaveLength(4);
    // BK: 2 boxes (one real #99, one placeholder for the missing semifinal).
    expect(half.rounds[1]?.matches).toHaveLength(2);
    expect(half.rounds[1]?.matches[0]?.matchNumber).toBe(99);
    expect(half.rounds[1]?.matches[1]?.isPlaceholder).toBe(true);
    // CK: 1 placeholder box for the not-yet-created final.
    expect(half.rounds[2]?.matches).toHaveLength(1);
    expect(half.rounds[2]?.matches[0]?.isPlaceholder).toBe(true);
  });

  it('fills player names, schedule and score on later-round matches', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 8 };
    const qf: PrintMatchInput[] = Array.from({ length: 4 }, (_, i) =>
      match({
        id: `qf-${i}`,
        matchNumber: 95 + i,
        round: 1,
        bracketPosition: i,
        player1: { name: `A${i}` },
        player2: { name: `B${i}` },
      }),
    );
    const matches: PrintMatchInput[] = [
      ...qf,
      match({
        id: 'sf-0',
        matchNumber: 99,
        round: 2,
        bracketPosition: 0,
        status: 'FINISHED',
        winner: 1,
        player1: { name: 'Winner A', members: [{ name: 'Winner A' }] },
        player2: { name: 'Loser B' },
        scheduledAt: '2026-03-21T09:15:00.000Z',
        courtName: 'S2',
        scoreSummary: {
          sets: [
            { player1: 21, player2: 15 },
            { player1: 21, player2: 18 },
          ],
        },
      }),
      match({
        id: 'sf-1',
        matchNumber: 100,
        round: 2,
        bracketPosition: 1,
        player1SlotLabel: 'Thắng trận #97',
        player2SlotLabel: 'Thắng trận #98',
        scheduledAt: '2026-03-21T09:30:00.000Z',
        courtName: 'S2',
      }),
      match({
        id: 'f-0',
        matchNumber: 101,
        round: 3,
        bracketPosition: 0,
        scheduledAt: '2026-03-21T10:00:00.000Z',
        courtName: 'S1',
      }),
    ];
    const halves = buildSingleEliminationBracket(category, matches);
    const half = halves[0]!;
    const sfTop = half.rounds[1]?.matches[0];
    const sfBot = half.rounds[1]?.matches[1];
    const finalMatch = half.rounds[2]?.matches[0];

    expect(sfTop?.player1Label).toContain('Winner');
    expect(sfTop?.scheduledLabel).toContain('S2');
    expect(sfTop?.scoreLabel).toBe('21-15, 21-18');
    expect(sfTop?.winnerSide).toBe(1);
    expect(sfBot?.matchNumber).toBe(100);
    expect(sfBot?.player1Label).toBe('Thắng trận #97');
    expect(sfBot?.scheduledLabel).toContain('S2');
    expect(finalMatch?.matchNumber).toBe(101);
    expect(finalMatch?.scheduledLabel).toContain('S1');
  });

  it('normalizes GROUP_KNOCKOUT knockout rounds (100+) onto bracket layout', () => {
    const matches: PrintMatchInput[] = Array.from({ length: 4 }, (_, i) =>
      match({
        id: `ko-r1-${i}`,
        matchNumber: 95 + i,
        round: 100,
        bracketPosition: i,
        player1: { name: `A${i}` },
        player2: { name: `B${i}` },
      }),
    );
    matches.push(
      match({
        id: 'ko-sf-0',
        matchNumber: 99,
        round: 101,
        bracketPosition: 0,
        scheduledAt: '2026-03-21T09:15:00.000Z',
        courtName: 'S2',
      }),
      match({
        id: 'ko-sf-1',
        matchNumber: 100,
        round: 101,
        bracketPosition: 1,
        player1: { name: 'C' },
        player2: { name: 'D' },
      }),
    );
    const halves = buildKnockoutHalvesFromMatches('Knockout', matches, 8);
    const half = halves[0]!;
    expect(half.entries.length).toBe(8);
    expect(half.rounds[0]?.matches).toHaveLength(4);
    expect(half.rounds[1]?.matches).toHaveLength(2);
    expect(half.rounds[1]?.matches[1]?.matchNumber).toBe(100);
    expect(half.rounds[1]?.matches[1]?.player1Label).toBe('C');
  });

  it('pre-generates all columns for 128-player bracket (7 rounds)', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 128 };
    const matches: PrintMatchInput[] = [
      match({ id: 'm1', matchNumber: 1, round: 1, bracketPosition: 0 }),
    ];
    const halves = buildSingleEliminationBracket(category, matches);
    const expectedRounds = eliminationRoundCount(128); // 7
    // 128-player bracket splits into 2 halves; each half has all 7 round columns
    expect(halves).toHaveLength(2);
    expect(halves[0]?.rounds.length).toBe(expectedRounds);
    expect(halves[0]?.rounds[0]?.shortLabel).toBe('R128');
    expect(halves[0]?.rounds[6]?.shortLabel).toBe('CK');
  });

  // ── 32-draw split ────────────────────────────────────────────────────────

  it('32-draw splits into 2 halves, each with 8 round-1 matches and 5 total rounds', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 32 };
    const r1: PrintMatchInput[] = Array.from({ length: 16 }, (_, i) =>
      match({
        id: `r1-${i}`,
        round: 1,
        bracketPosition: i,
        matchNumber: 411 + i,
        scheduledAt: '2026-06-06T07:30:00.000Z',
        courtName: 'S4B',
        player1: { name: `A${i}` },
        player2: { name: `B${i}` },
      }),
    );
    const halves = buildSingleEliminationBracket(category, r1);
    expect(halves).toHaveLength(2);
    expect(halves[0]?.rounds.length).toBe(eliminationRoundCount(32)); // 5
    expect(halves[0]?.rounds[0]?.matches.length).toBe(8);
    expect(halves[1]?.rounds[0]?.matches.length).toBe(8);
  });

  it('trims trailing all-Bye rows from each half', () => {
    // 32-player bracket: only 4 real matches in the first 8 slots of Nhánh 2,
    // the remaining 8 slots in Nhánh 2 are phantom Byes (no match).
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 32 };
    // Build 8 matches for Nhánh 1 (bp 0-7) and 4 matches for Nhánh 2 (bp 8-11)
    const r1: PrintMatchInput[] = [
      ...Array.from({ length: 8 }, (_, i) =>
        match({ id: `h1-${i}`, round: 1, bracketPosition: i, matchNumber: 100 + i, player1: { name: `A${i}` }, player2: { name: `B${i}` } }),
      ),
      ...Array.from({ length: 4 }, (_, i) =>
        match({ id: `h2-${i}`, round: 1, bracketPosition: 8 + i, matchNumber: 200 + i, player1: { name: `C${i}` }, player2: i === 0 ? undefined : { name: `D${i}` } }),
      ),
    ];
    const halves = buildSingleEliminationBracket(category, r1);
    // Nhánh 1: all 8 matches have real players → 16 entries
    expect(halves[0]?.entries.length).toBe(16);
    // Nhánh 2: only bp 8-11 have real players → slots 0-7 in half (8 entries, trailing Byes trimmed)
    expect(halves[1]?.entries.length).toBe(8);
    expect(halves[1]?.rounds[0]?.matches.length).toBe(4);
  });

  // ── row layout ───────────────────────────────────────────────────────────

  it('single elimination rows pair entries in round 1', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 16 };
    const matches: PrintMatchInput[] = [
      match({
        id: 'r1m0',
        matchNumber: 1,
        round: 1,
        bracketPosition: 0,
        player1: { name: 'A' },
        player2: { name: 'B' },
      }),
      match({
        id: 'r1m1',
        matchNumber: 2,
        round: 1,
        bracketPosition: 1,
        player1: { name: 'C' },
        player2: { name: 'D' },
      }),
      match({
        id: 'r2m0',
        matchNumber: 5,
        round: 2,
        roundLabel: 'Vòng 2',
        bracketPosition: 0,
        player1: { name: 'A' },
        player2: { name: 'C' },
      }),
    ];
    const halves = buildSingleEliminationBracket(category, matches);
    const half = halves[0]!;
    // 16-player bracket → 4 round columns (R16, TK, BK, CK)
    expect(half.rounds.length).toBe(eliminationRoundCount(16));
    expect(half.rounds[0]?.shortLabel).toBe('R16');
    expect(half.rounds[0]?.matches[0]).toMatchObject({
      rowIndexFrom: 0,
      rowIndexTo: 1,
    });
    expect(half.rounds[1]?.matches[0]).toMatchObject({
      rowIndexFrom: 0,
      rowIndexTo: 3,
    });
  });

  it('matchGlobalRowSpan follows bracket tree depth', () => {
    expect(matchGlobalRowSpan(1, 0, 0)).toEqual({ globalFrom: 0, globalTo: 1 });
    expect(matchGlobalRowSpan(2, 0, 0)).toEqual({ globalFrom: 0, globalTo: 3 });
    expect(
      intersectHalfSpan(0, 3, 0, 16),
    ).toEqual({ localFrom: 0, localTo: 3 });
    expect(intersectHalfSpan(8, 11, 0, 8)).toBeNull();
  });

  it('single elim: null bracketPosition inferred from matchNumber rank', () => {
    const category = { ...cat('SINGLE_ELIMINATION'), bracketSize: 64, status: 'COMPLETED' };
    const makeMatch = (id: string, round: number, bp: number | null, mn: number): PrintMatchInput => ({
      id,
      matchNumber: mn,
      categoryId: 'c1',
      round,
      roundLabel: `V${round}`,
      bracketPosition: bp,
      status: 'FINISHED',
      isBye: false,
      player1: { name: `P${mn}a` },
      player2: { name: `P${mn}b` },
    });

    // Simulate 64-draw: R1 has 32 matches (mn=500-531), R2 has 16 (mn=532-547)
    // bracketPosition is null for R2 (old data scenario)
    const r1: PrintMatchInput[] = Array.from({ length: 32 }, (_, i) =>
      makeMatch(`r1m${i}`, 1, i, 500 + i),
    );
    const r2: PrintMatchInput[] = Array.from({ length: 16 }, (_, i) =>
      makeMatch(`r2m${i}`, 2, null, 532 + i), // null bracketPosition!
    );
    const allMatches = [...r1, ...r2];
    const halves = buildSingleEliminationBracket(category, allMatches);

    // 64-player bracket → 6 round columns (R64, R32, R16, TK, BK, CK), split into 2 halves
    const expectedRounds = eliminationRoundCount(64); // 6
    expect(halves[0]?.rounds.length).toBe(expectedRounds);
    expect(halves[1]?.rounds.length).toBe(expectedRounds);

    // Nhánh 1 R1 should have 16 matches (bp 0-15), Nhánh 1 R2 should have 8
    expect(halves[0]?.rounds[0]?.matches.length).toBe(16);
    expect(halves[0]?.rounds[1]?.matches.length).toBe(8);

    // Row position of first R2 match in half 1 spans rows 0-3
    expect(halves[0]?.rounds[1]?.matches[0]).toMatchObject({
      rowIndexFrom: 0,
      rowIndexTo: 3,
    });
  });

  // ── round robin ──────────────────────────────────────────────────────────

  it('buildBracketDocument round robin', () => {
    const matches: PrintMatchInput[] = [
      match({ id: 'm1', matchNumber: 1, player1: { name: 'A' }, player2: { name: 'B' } }),
      match({ id: 'm2', matchNumber: 2, round: 2, roundLabel: 'Vòng 2', player1: { name: 'C' }, player2: { name: 'D' } }),
    ];
    const doc = buildBracketDocument(tournament, cat('ROUND_ROBIN'), matches);
    expect(doc?.roundRobinRows?.length).toBe(2);
    expect(doc?.orientation).toBe('portrait');
  });

  // ── misc ─────────────────────────────────────────────────────────────────

  it('computePrintReadiness', () => {
    const r = computePrintReadiness(
      [
        cat('SINGLE_ELIMINATION'),
        { ...cat('ROUND_ROBIN'), id: 'c2', status: 'DRAW_PENDING' },
      ],
      3,
      10,
    );
    expect(r.unscheduledCount).toBe(7);
    expect(r.undrawnCategoryIds).toEqual(['c2']);
  });

  it('formatDateRangeLabel accepts ISO datetime from GraphQL', () => {
    const label = formatDateRangeLabel(
      '2026-06-04T12:30:04.784Z',
      '2026-06-08T18:00:00.000Z',
    );
    expect(label).not.toContain('Invalid');
    expect(label).toContain('2026');
  });
});
