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

export function isBookingDateInRange(
  bookingDate: string,
  from?: string,
  to?: string,
): boolean {
  if (from && bookingDate < from) {
    return false;
  }
  if (to && bookingDate > to) {
    return false;
  }
  return true;
}

export function filterBookingsByDateRange<T extends { date: string }>(
  bookings: T[],
  from?: string,
  to?: string,
): T[] {
  if (!from && !to) {
    return bookings;
  }
  return bookings.filter((booking) =>
    isBookingDateInRange(booking.date, from, to),
  );
}
