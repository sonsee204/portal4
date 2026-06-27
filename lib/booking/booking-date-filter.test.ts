/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import {
  filterBookingsByDateRange,
  isBookingDateInRange,
} from './booking-date-filter';

describe('booking-date-filter', () => {
  it('matches booking dates within inclusive ISO range', () => {
    expect(isBookingDateInRange('2026-06-15', '2026-06-01', '2026-06-30')).toBe(
      true,
    );
    expect(isBookingDateInRange('2026-05-31', '2026-06-01', '2026-06-30')).toBe(
      false,
    );
    expect(isBookingDateInRange('2026-07-01', '2026-06-01', '2026-06-30')).toBe(
      false,
    );
  });

  it('filters booking list by date range', () => {
    const bookings = [
      { _id: '1', date: '2026-06-10' },
      { _id: '2', date: '2026-06-20' },
      { _id: '3', date: '2026-07-01' },
    ];

    expect(
      filterBookingsByDateRange(bookings, '2026-06-01', '2026-06-30').map(
        (item) => item._id,
      ),
    ).toEqual(['1', '2']);
  });
});
