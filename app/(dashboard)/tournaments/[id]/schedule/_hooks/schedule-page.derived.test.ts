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
  calendarKeyFromIso,
  formatScheduleDate,
  selectedGridDateTime,
} from './schedule-page.derived';

describe('schedule-page.derived', () => {
  it('calendarKeyFromIso extracts YYYY-MM-DD from ISO datetime', () => {
    expect(calendarKeyFromIso('2026-06-15T08:30:00.000Z')).toMatch(
      /^2026-06-1[45]$/,
    );
  });

  it('formatScheduleDate returns non-empty localized string', () => {
    expect(formatScheduleDate('2026-06-15T08:00:00')).toBeTruthy();
  });

  it('selectedGridDateTime combines today date with court time', () => {
    const value = selectedGridDateTime('court-1', '09:30');
    expect(value).toMatch(/^\d{4}-\d{2}-\d{2}T09:30$/);
  });
});
