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

import type { DateRangeValue } from '@/components/molecules/DateRangePicker';
import { FinanceCompareMode } from '@/graphql/generated';
import {
  resolveDateRangePreset,
  type DateRangePreset,
} from '@/lib/finance/stat-card-trend';

export const OWNER_DATE_RANGE_STORAGE_KEY = 'portal-owner-date-range';

const DATE_RANGE_PRESETS: readonly DateRangePreset[] = [
  'today',
  'week',
  'month',
  'last3months',
  'quarter',
  'year',
  'custom',
] as const;

const COMPARE_MODES: readonly FinanceCompareMode[] = [
  FinanceCompareMode.PreviousPeriod,
  FinanceCompareMode.SamePeriodLastYear,
] as const;

export interface OwnerDateRangeState {
  datePreset: DateRangePreset;
  dateRange: DateRangeValue;
  compareMode: FinanceCompareMode;
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE_PATTERN.test(value);
}

function isDateRangePreset(value: unknown): value is DateRangePreset {
  return (
    typeof value === 'string' &&
    DATE_RANGE_PRESETS.includes(value as DateRangePreset)
  );
}

function isCompareMode(value: unknown): value is FinanceCompareMode {
  return (
    typeof value === 'string' &&
    COMPARE_MODES.includes(value as FinanceCompareMode)
  );
}

export function getDefaultOwnerDateRangeState(): OwnerDateRangeState {
  return {
    datePreset: 'month',
    dateRange: resolveDateRangePreset('month'),
    compareMode: FinanceCompareMode.PreviousPeriod,
  };
}

export function readStoredOwnerDateRangeState(): OwnerDateRangeState | null {
  if (typeof window === 'undefined') return null;

  const raw = window.localStorage.getItem(OWNER_DATE_RANGE_STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<OwnerDateRangeState>;
    const dateRange = parsed.dateRange;
    if (
      !dateRange ||
      !isIsoDate(dateRange.from) ||
      !isIsoDate(dateRange.to) ||
      dateRange.from > dateRange.to
    ) {
      return null;
    }

    return {
      datePreset: isDateRangePreset(parsed.datePreset)
        ? parsed.datePreset
        : 'custom',
      dateRange: { from: dateRange.from, to: dateRange.to },
      compareMode: isCompareMode(parsed.compareMode)
        ? parsed.compareMode
        : FinanceCompareMode.PreviousPeriod,
    };
  } catch {
    return null;
  }
}

export function writeStoredOwnerDateRangeState(state: OwnerDateRangeState): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(
    OWNER_DATE_RANGE_STORAGE_KEY,
    JSON.stringify(state),
  );
}
