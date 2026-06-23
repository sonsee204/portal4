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

/** Calendar date-only string from GraphQL (YYYY-MM-DD). */
const ISO_DATE_ONLY = /^(\d{4})-(\d{2})-(\d{2})$/;

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

/**
 * Parse a value for display. YYYY-MM-DD is treated as a local calendar date
 * to avoid UTC timezone shifting (e.g. 2026-06-16 → 15/06/2026 in UTC+7).
 */
export function parseDisplayDate(value: string | Date): Date | null {
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const trimmed = value.trim();
  const dateOnly = ISO_DATE_ONLY.exec(trimmed);
  if (dateOnly) {
    const year = Number.parseInt(dateOnly[1], 10);
    const month = Number.parseInt(dateOnly[2], 10);
    const day = Number.parseInt(dateOnly[3], 10);
    const parsed = new Date(year, month - 1, day);
    if (
      parsed.getFullYear() !== year ||
      parsed.getMonth() !== month - 1 ||
      parsed.getDate() !== day
    ) {
      return null;
    }
    return parsed;
  }

  const parsed = new Date(trimmed);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** dd/MM/yyyy */
export function formatDateParts(date: Date): string {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/** dd/MM/yyyy, HH:mm (24h) */
export function formatDateTimeParts(date: Date): string {
  return `${formatDateParts(date)}, ${pad2(date.getHours())}:${pad2(date.getMinutes())}`;
}

/**
 * Format date for UI display — Vietnamese standard dd/MM/yyyy.
 */
export function formatDisplayDateValue(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  },
): string {
  const parsed = parseDisplayDate(date);
  if (!parsed) {
    return typeof date === 'string' ? date : '—';
  }

  if (
    options.day === '2-digit' &&
    options.month === '2-digit' &&
    options.year === 'numeric' &&
    Object.keys(options).length === 3
  ) {
    return formatDateParts(parsed);
  }

  return parsed.toLocaleDateString('vi-VN', options);
}

/**
 * Format date and time for UI display — dd/MM/yyyy, HH:mm.
 */
export function formatDisplayDateTimeValue(date: string | Date): string {
  const parsed = parseDisplayDate(date);
  if (!parsed) {
    return typeof date === 'string' ? date : '—';
  }
  return formatDateTimeParts(parsed);
}
