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
  addDays,
  addMonths,
  parseIsoDateString,
  startOfDay,
  toIsoDateString,
} from '@/lib/date/calendar';

export type ExpenseCoverageMode = 'single' | 'period';

export const EXPENSE_COVERAGE_PRESETS = [
  { label: '1 tháng', months: 1 },
  { label: '3 tháng', months: 3 },
  { label: '6 tháng', months: 6 },
  { label: '12 tháng', months: 12 },
] as const;

export function diffDaysInclusive(from: Date, to: Date): number {
  const start = from.getTime();
  const end = to.getTime();
  return Math.floor((end - start) / (24 * 60 * 60 * 1000)) + 1;
}

export function applyCoveragePreset(
  paymentDate: Date,
  months: number,
): { from: Date; to: Date } {
  const from = startOfDay(paymentDate);
  const to = addDays(addMonths(from, months), -1);
  return { from, to };
}

export function matchesCoveragePreset(
  coverageFrom: Date,
  coverageTo: Date,
  paymentDate: Date,
  months: number,
): boolean {
  const preset = applyCoveragePreset(paymentDate, months);
  return (
    toIsoDateString(startOfDay(coverageFrom)) === toIsoDateString(preset.from) &&
    toIsoDateString(startOfDay(coverageTo)) === toIsoDateString(preset.to)
  );
}

export function formatCoverageLabel(from: string, to: string): string {
  if (from === to) {
    return 'Một lần';
  }
  return `${from} – ${to}`;
}

export function estimateDailyRate(
  amount: number,
  coverageFrom: Date,
  coverageTo: Date,
): number {
  const days = diffDaysInclusive(coverageFrom, coverageTo);
  if (days <= 0 || amount <= 0) {
    return 0;
  }
  return Math.floor(amount / days);
}

export function estimateMonthlyPreview(
  amount: number,
  coverageFrom: Date,
  coverageTo: Date,
): string | null {
  if (amount <= 0) {
    return null;
  }

  const days = diffDaysInclusive(coverageFrom, coverageTo);
  if (days <= 30) {
    return null;
  }

  const monthStart = new Date(
    coverageFrom.getFullYear(),
    coverageFrom.getMonth(),
    1,
  );
  const monthEnd = new Date(
    coverageFrom.getFullYear(),
    coverageFrom.getMonth() + 1,
    0,
  );
  const overlapFrom =
    coverageFrom > monthStart ? coverageFrom : monthStart;
  const overlapTo = coverageTo < monthEnd ? coverageTo : monthEnd;

  if (overlapFrom > overlapTo) {
    return null;
  }

  const overlapDays = diffDaysInclusive(overlapFrom, overlapTo);
  const allocated = Math.floor((amount * overlapDays) / days);
  const monthLabel = `${coverageFrom.getMonth() + 1}/${coverageFrom.getFullYear()}`;

  return `Tháng ${monthLabel} (${overlapDays} ngày): ~${allocated.toLocaleString('vi-VN')}₫`;
}

export function parseIsoDateOrToday(value: string): Date {
  return parseIsoDateString(value) ?? new Date();
}

export function toIsoDateOrEmpty(date: Date): string {
  return toIsoDateString(date);
}

export function isPeriodCoverage(from: string, to: string): boolean {
  return from !== to;
}

export function resolveInitialCoverageMode(
  editing: { coverageFrom?: string | null; coverageTo?: string | null; date: string } | null,
): ExpenseCoverageMode {
  if (!editing) {
    return 'single';
  }

  const from = editing.coverageFrom ?? editing.date;
  const to = editing.coverageTo ?? from;
  return isPeriodCoverage(from, to) ? 'period' : 'single';
}
