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
import {
  addDays,
  addMonths,
  buildMonthGrid,
  getMondayBasedWeekday,
  isDateDisabled,
  isSameDay,
  parseIsoDateString,
  startOfDay,
  toIsoDateString,
} from './calendar';

describe('calendar utils', () => {
  it('formats and parses ISO date strings in local calendar', () => {
    const date = new Date(2026, 4, 16);
    expect(toIsoDateString(date)).toBe('2026-05-16');
    expect(parseIsoDateString('2026-05-16')).toEqual(startOfDay(date));
  });

  it('builds a Monday-first month grid with 42 cells', () => {
    const viewMonth = new Date(2026, 4, 1);
    const grid = buildMonthGrid(viewMonth);

    expect(grid).toHaveLength(42);
    expect(getMondayBasedWeekday(grid[0]!.date)).toBe(0);
    expect(grid.some((cell) => isSameDay(cell.date, new Date(2026, 4, 16)))).toBe(
      true,
    );
    expect(grid.filter((cell) => cell.inCurrentMonth)).toHaveLength(31);
  });

  it('adds days and months without mutating input', () => {
    const base = new Date(2026, 4, 16);
    expect(addDays(base, 1).getDate()).toBe(17);
    expect(base.getDate()).toBe(16);
    expect(addMonths(base, 1).getMonth()).toBe(5);
  });

  it('respects min/max bounds', () => {
    const min = new Date(2026, 4, 10);
    const max = new Date(2026, 4, 20);

    expect(isDateDisabled(new Date(2026, 4, 9), min, max)).toBe(true);
    expect(isDateDisabled(new Date(2026, 4, 15), min, max)).toBe(false);
    expect(isDateDisabled(new Date(2026, 4, 21), min, max)).toBe(true);
  });
});
