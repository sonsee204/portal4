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

import type { StatCardProps } from '@/components/molecules/StatCard';

export function toStatCardTrend(
  changePercent: number | null | undefined,
): StatCardProps['trend'] | undefined {
  if (changePercent == null || Number.isNaN(changePercent)) return undefined;

  const direction: 'up' | 'down' | 'neutral' =
    changePercent > 0 ? 'up' : changePercent < 0 ? 'down' : 'neutral';

  return {
    value: `${Math.abs(changePercent).toFixed(1)}%`,
    direction,
  };
}

export function formatIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function startOfMonthDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function startOfQuarterDate(date: Date): Date {
  const quarter = Math.floor(date.getMonth() / 3);
  return new Date(date.getFullYear(), quarter * 3, 1);
}

export function startOfYearDate(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export type DateRangePreset =
  | 'today'
  | 'week'
  | 'month'
  | 'quarter'
  | 'year'
  | 'custom';

export function resolveDateRangePreset(
  preset: DateRangePreset,
  reference = new Date(),
): { from: string; to: string } {
  const to = formatIsoDate(reference);

  switch (preset) {
    case 'today':
      return { from: to, to };
    case 'week': {
      const fromDate = new Date(reference);
      fromDate.setDate(fromDate.getDate() - 6);
      return { from: formatIsoDate(fromDate), to };
    }
    case 'month':
      return { from: formatIsoDate(startOfMonthDate(reference)), to };
    case 'quarter':
      return { from: formatIsoDate(startOfQuarterDate(reference)), to };
    case 'year':
      return { from: formatIsoDate(startOfYearDate(reference)), to };
    default:
      return { from: formatIsoDate(startOfMonthDate(reference)), to };
  }
}
