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

import { beforeEach, describe, expect, it } from 'vitest';
import { FinanceCompareMode } from '@/graphql/generated';
import {
  getDefaultOwnerDateRangeState,
  OWNER_DATE_RANGE_STORAGE_KEY,
  readStoredOwnerDateRangeState,
  writeStoredOwnerDateRangeState,
} from './owner-date-range-storage';

describe('owner-date-range-storage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('returns default state when storage is empty', () => {
    expect(readStoredOwnerDateRangeState()).toBeNull();
    expect(getDefaultOwnerDateRangeState().datePreset).toBe('month');
  });

  it('persists and restores a custom range', () => {
    writeStoredOwnerDateRangeState({
      datePreset: 'custom',
      dateRange: { from: '2026-01-01', to: '2026-06-20' },
      compareMode: FinanceCompareMode.SamePeriodLastYear,
    });

    expect(window.localStorage.getItem(OWNER_DATE_RANGE_STORAGE_KEY)).toBeTruthy();
    expect(readStoredOwnerDateRangeState()).toEqual({
      datePreset: 'custom',
      dateRange: { from: '2026-01-01', to: '2026-06-20' },
      compareMode: FinanceCompareMode.SamePeriodLastYear,
    });
  });
});
