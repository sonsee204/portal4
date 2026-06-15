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
  floorTimeToHourBlock,
  formatDateRangeLabel,
  formatTimeRangeFromBlocks,
  formatViDate,
} from './round-labels';
import type {
  PrintCategoryInput,
  PrintMasterScheduleDoc,
  PrintMasterScheduleRow,
  PrintMasterScheduleSection,
  PrintScheduleMatchInput,
  PrintTournamentInput,
} from './types';

const LUNCH_BREAK_LABEL = 'NGHỈ TRƯA';
const LUNCH_GAP_MINUTES = 120;

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

export interface BuildMasterScheduleOptions {
  /** Insert lunch break row when gap between hour blocks exceeds this (minutes). */
  lunchGapMinutes?: number;
}

export function buildMasterSchedule(
  tournament: PrintTournamentInput,
  categories: PrintCategoryInput[],
  matches: PrintScheduleMatchInput[],
  totalMatchCount: number,
  options: BuildMasterScheduleOptions = {},
): PrintMasterScheduleDoc {
  const lunchGap = options.lunchGapMinutes ?? LUNCH_GAP_MINUTES;
  const categoryOrder = new Map(
    categories.map((c, i) => [c.id, c.displayOrder ?? i]),
  );
  const categoryTitle = new Map(categories.map((c) => [c.id, c.title]));

  const scheduled = matches.filter((m) => m.scheduledDate && m.startTime);
  const unscheduledCount = Math.max(0, totalMatchCount - scheduled.length);

  const byDate = new Map<string, PrintScheduleMatchInput[]>();
  for (const m of scheduled) {
    const date = m.scheduledDate!;
    const list = byDate.get(date) ?? [];
    list.push(m);
    byDate.set(date, list);
  }

  const sections: PrintMasterScheduleSection[] = [];
  const allHourBlocks: string[] = [];

  for (const dateKey of [...byDate.keys()].sort()) {
    const dayMatches = byDate.get(dateKey)!;
    type GroupKey = string;
    const groups = new Map<
      GroupKey,
      { hourBlock: string; categoryId: string; roundLabel: string; round: number; matches: PrintScheduleMatchInput[] }
    >();

    for (const m of dayMatches) {
      const hourBlock = floorTimeToHourBlock(m.startTime!);
      allHourBlocks.push(hourBlock);
      const key = `${hourBlock}|${m.categoryId}|${m.roundLabel}|${m.round}`;
      const existing = groups.get(key);
      if (existing) {
        existing.matches.push(m);
      } else {
        groups.set(key, {
          hourBlock,
          categoryId: m.categoryId,
          roundLabel: m.roundLabel,
          round: m.round,
          matches: [m],
        });
      }
    }

    const sortedGroups = [...groups.values()].sort((a, b) => {
      const ta = timeToMinutes(a.hourBlock);
      const tb = timeToMinutes(b.hourBlock);
      if (ta !== tb) return ta - tb;
      const oa = categoryOrder.get(a.categoryId) ?? 0;
      const ob = categoryOrder.get(b.categoryId) ?? 0;
      if (oa !== ob) return oa - ob;
      return a.round - b.round;
    });

    const rows: PrintMasterScheduleRow[] = [];
    let dayTotal = 0;
    let prevBlockEndMin: number | null = null;

    for (const g of sortedGroups) {
      const blockStartMin = timeToMinutes(g.hourBlock);
      if (
        prevBlockEndMin != null &&
        blockStartMin - prevBlockEndMin >= lunchGap
      ) {
        rows.push({
          kind: 'break',
          breakLabel: LUNCH_BREAK_LABEL,
        });
      }

      const nums = g.matches.map((m) => m.matchNumber).sort((a, b) => a - b);
      const count = nums.length;
      dayTotal += count;

      rows.push({
        kind: 'match',
        timeLabel: g.hourBlock,
        categoryTitle:
          categoryTitle.get(g.categoryId) ??
          g.matches[0]?.categoryTitle ??
          '—',
        roundLabel: g.roundLabel,
        matchFrom: nums[0],
        matchTo: nums[nums.length - 1],
        matchCount: count,
      });

      prevBlockEndMin = blockStartMin + 60;
    }

    sections.push({
      dateKey,
      dateLabel: formatViDate(dateKey),
      rows,
      dayTotal,
    });
  }

  const timeRangeLabel = formatTimeRangeFromBlocks(allHourBlocks);

  return {
    header: {
      title: tournament.title,
      locationName: tournament.locationName ?? undefined,
      dateRangeLabel: formatDateRangeLabel(
        tournament.startDate,
        tournament.endDate,
      ),
      timeRangeLabel,
      courtCountLabel:
        tournament.courtCount > 0
          ? `Trên ${tournament.courtCount} sân`
          : '—',
      isDraft: tournament.status === 'DRAFT',
    },
    sections,
    grandTotal: scheduled.length,
    unscheduledCount,
  };
}

export function masterScheduleToExcelRows(
  doc: PrintMasterScheduleDoc,
): Record<string, string | number>[] {
  const rows: Record<string, string | number>[] = [];
  for (const section of doc.sections) {
    for (const row of section.rows) {
      if (row.kind === 'break') {
        rows.push({
          'Giờ dự kiến': '',
          'Nội dung': row.breakLabel ?? LUNCH_BREAK_LABEL,
          Vòng: '',
          'Số thứ tự trận': '',
          'Tổng số trận': '',
          Ngày: section.dateLabel,
        });
        continue;
      }
      rows.push({
        'Giờ dự kiến': row.timeLabel ?? '',
        'Nội dung': row.categoryTitle ?? '',
        Vòng: row.roundLabel ?? '',
        'Số thứ tự trận':
          row.matchFrom === row.matchTo
            ? `#${row.matchFrom}`
            : `#${row.matchFrom} – ${row.matchTo}`,
        'Tổng số trận': row.matchCount ?? 0,
        Ngày: section.dateLabel,
      });
    }
  }
  rows.push({
    'Giờ dự kiến': '',
    'Nội dung': 'TỔNG SỐ TRẬN',
    Vòng: '',
    'Số thứ tự trận': '',
    'Tổng số trận': doc.grandTotal,
    Ngày: '',
  });
  return rows;
}
