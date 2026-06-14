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

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx, avoiding conflicts
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const VND_FORMATTER = new Intl.NumberFormat('vi-VN', {
  style: 'currency',
  currency: 'VND',
  maximumFractionDigits: 0,
});

/**
 * Format number as VND currency
 */
export function formatCurrency(amount: number): string {
  return VND_FORMATTER.format(amount);
}

/**
 * Format amount for display - accepts string (e.g. "50000", "50.000đ") or number.
 * Uses unified VND format. Returns as-is if not parseable (e.g. "Miễn phí").
 */
export function formatCurrencyDisplay(value: string | number | undefined | null): string {
  if (value == null || value === '') return '';
  if (typeof value === 'number' && !Number.isNaN(value)) {
    return VND_FORMATTER.format(value);
  }
  const str = String(value).trim();
  const num = parseInt(str.replace(/[.\sđ,]/g, ''), 10);
  if (!Number.isNaN(num)) return VND_FORMATTER.format(num);
  return str;
}

/**
 * Format date for display (Vietnamese locale)
 */
export function formatDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('vi-VN', options);
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Format distance in km
 */
export function formatDistance(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}

/**
 * Format rating (e.g. 4.5 -> "4.5")
 */
export function formatRating(rating: number | undefined | null): string {
  if (rating == null) return '—';
  return rating.toFixed(1);
}

/**
 * Truncate text with ellipsis
 */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}
