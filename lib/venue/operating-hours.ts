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

export interface VenueOperatingHour {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  is24Hours?: boolean | null;
}

export interface VenueHourRange {
  hours: number[];
  isClosed: boolean;
  openTime: string | null;
  closeTime: string | null;
  usedFallback: boolean;
}

const DEFAULT_OPEN_HOUR = 7;
const DEFAULT_CLOSE_HOUR = 18;

export function parseHourFromTime(time: string): number {
  const [hourPart] = time.split(':');
  const hour = Number.parseInt(hourPart ?? '0', 10);
  return Number.isFinite(hour) ? hour : 0;
}

export function getOperatingHoursForDate(
  operatingHours: VenueOperatingHour[],
  date: Date,
): VenueOperatingHour | null {
  const dayOfWeek = date.getDay();
  return operatingHours.find((entry) => entry.dayOfWeek === dayOfWeek) ?? null;
}

function buildInclusiveHourRange(startHour: number, endHour: number): number[] {
  if (endHour < startHour) {
    return Array.from({ length: 24 - startHour }, (_, index) => startHour + index);
  }

  const length = Math.max(endHour - startHour + 1, 1);
  return Array.from({ length }, (_, index) => startHour + index);
}

export function buildHourSlotsForDay(
  operatingHours: VenueOperatingHour[],
  date: Date,
): VenueHourRange {
  if (operatingHours.length === 0) {
    return {
      hours: buildInclusiveHourRange(DEFAULT_OPEN_HOUR, DEFAULT_CLOSE_HOUR),
      isClosed: false,
      openTime: `${String(DEFAULT_OPEN_HOUR).padStart(2, '0')}:00`,
      closeTime: `${String(DEFAULT_CLOSE_HOUR).padStart(2, '0')}:00`,
      usedFallback: true,
    };
  }

  const dayHours = getOperatingHoursForDate(operatingHours, date);

  if (!dayHours || dayHours.isClosed) {
    return {
      hours: [],
      isClosed: true,
      openTime: dayHours?.openTime ?? null,
      closeTime: dayHours?.closeTime ?? null,
      usedFallback: false,
    };
  }

  if (dayHours.is24Hours) {
    return {
      hours: Array.from({ length: 24 }, (_, index) => index),
      isClosed: false,
      openTime: '00:00',
      closeTime: '23:59',
      usedFallback: false,
    };
  }

  const startHour = parseHourFromTime(dayHours.openTime);
  const endHour = parseHourFromTime(dayHours.closeTime);

  return {
    hours: buildInclusiveHourRange(startHour, endHour),
    isClosed: false,
    openTime: dayHours.openTime,
    closeTime: dayHours.closeTime,
    usedFallback: false,
  };
}
