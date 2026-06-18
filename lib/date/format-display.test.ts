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
  formatDisplayDateTimeValue,
  formatDisplayDateValue,
  parseDisplayDate,
} from './format-display';

describe('format-display', () => {
  it('parseDisplayDate treats YYYY-MM-DD as local calendar date', () => {
    const parsed = parseDisplayDate('2026-06-16');
    expect(parsed).not.toBeNull();
    expect(parsed!.getFullYear()).toBe(2026);
    expect(parsed!.getMonth()).toBe(5);
    expect(parsed!.getDate()).toBe(16);
  });

  it('formatDisplayDateValue formats calendar dates as dd/MM/yyyy', () => {
    expect(formatDisplayDateValue('2026-06-16')).toBe('16/06/2026');
    expect(formatDisplayDateValue('2026-01-05')).toBe('05/01/2026');
  });

  it('formatDisplayDateTimeValue formats ISO datetimes', () => {
    const value = formatDisplayDateTimeValue('2026-06-16T14:30:00');
    expect(value).toBe('16/06/2026, 14:30');
  });
});
