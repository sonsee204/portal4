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

import type { ScheduleShiftPreview, TournamentMatch } from '@/graphql/generated';
import { isPortalMatchOverdue } from '@/lib/tournament/schedule-overdue';

export function todayCalendarDate(): string {
  return new Date().toLocaleDateString('en-CA');
}

export function isPastScheduleDate(
  selectedDate: string,
  today: string,
): boolean {
  return selectedDate !== '' && selectedDate < today;
}

export function calendarKeyFromIso(iso: string): string {
  const d = new Date(iso);
  const y = d.getFullYear();
  const mo = String(d.getMonth() + 1).padStart(2, '0');
  const da = String(d.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}`;
}

export function formatScheduleDate(dateStr: string): string {
  return new Date(dateStr).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function selectedGridDateTime(courtId: string, time: string): string {
  const today = new Date();
  const y = today.getFullYear();
  const mo = String(today.getMonth() + 1).padStart(2, '0');
  const da = String(today.getDate()).padStart(2, '0');
  return `${y}-${mo}-${da}T${time}`;
}

export function findPortalRepackOverdueMatchIds(
  preview: ReadonlyArray<ScheduleShiftPreview> | undefined,
  matches: ReadonlyArray<TournamentMatch>,
): Set<string> | undefined {
  if (!preview) return undefined;
  const ids = new Set<string>();
  for (const row of preview) {
    const m = matches.find((x) => x._id === row.matchId);
    if (m && isPortalMatchOverdue(m)) ids.add(row.matchId);
  }
  return ids.size > 0 ? ids : undefined;
}
