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
} from './bracket-row-layout';
import { buildSingleEliminationBracket } from './builders/single-elimination';
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

  it('formatPrintScheduledLabel includes court when present', () => {
    const label = formatPrintScheduledLabel({
      scheduledAt: '2026-06-15T08:30:00.000Z',
      courtName: 'S1',
    });
    expect(label).toContain('S1');
    expect(label).toMatch(/\d{2}:\d{2}/);
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
    expect(half.rounds.length).toBe(2);
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

    // Both halves should have 2 round columns
    expect(halves[0]?.rounds.length).toBe(2);
    expect(halves[1]?.rounds.length).toBe(2);

    // Nhánh 1 R1 should have 16 matches (bp 0-15), Nhánh 1 R2 should have 8
    expect(halves[0]?.rounds[0]?.matches.length).toBe(16);
    expect(halves[0]?.rounds[1]?.matches.length).toBe(8);

    // Row position of first R2 match in half 1 spans rows 0-3
    expect(halves[0]?.rounds[1]?.matches[0]).toMatchObject({
      rowIndexFrom: 0,
      rowIndexTo: 3,
    });
  });

  it('buildBracketDocument round robin', () => {
    const matches: PrintMatchInput[] = [
      match({ id: 'm1', matchNumber: 1, player1: { name: 'A' }, player2: { name: 'B' } }),
      match({ id: 'm2', matchNumber: 2, round: 2, roundLabel: 'Vòng 2', player1: { name: 'C' }, player2: { name: 'D' } }),
    ];
    const doc = buildBracketDocument(tournament, cat('ROUND_ROBIN'), matches);
    expect(doc?.roundRobinRows?.length).toBe(2);
    expect(doc?.orientation).toBe('portrait');
  });

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
