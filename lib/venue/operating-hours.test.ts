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
import { buildHourSlotsForDay } from './operating-hours';

describe('buildHourSlotsForDay', () => {
  const date = new Date('2026-05-16T10:00:00'); // Saturday = 6

  it('uses venue open/close hours for the selected day', () => {
    const result = buildHourSlotsForDay(
      [
        {
          dayOfWeek: 6,
          openTime: '06:00',
          closeTime: '22:00',
          isClosed: false,
        },
      ],
      date,
    );

    expect(result.isClosed).toBe(false);
    expect(result.hours[0]).toBe(6);
    expect(result.hours.at(-1)).toBe(22);
    expect(result.hours).toHaveLength(17);
  });

  it('returns empty range when venue is closed', () => {
    const result = buildHourSlotsForDay(
      [
        {
          dayOfWeek: 6,
          openTime: '06:00',
          closeTime: '22:00',
          isClosed: true,
        },
      ],
      date,
    );

    expect(result.isClosed).toBe(true);
    expect(result.hours).toEqual([]);
  });

  it('falls back when operating hours are missing', () => {
    const result = buildHourSlotsForDay([], date);

    expect(result.usedFallback).toBe(true);
    expect(result.hours[0]).toBe(7);
    expect(result.hours.at(-1)).toBe(18);
  });
});
