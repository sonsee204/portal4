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
import type { ScheduleMatch } from '@/types/tournament-schedule';
import {
  buildTimelinePlacedMatches,
  dedupeScheduleMatchesById,
} from '../_components/timeline-card-layout';
import {
  calendarKeyFromIso,
  formatScheduleDate,
  isPastScheduleDate,
  selectedGridDateTime,
  todayCalendarDate,
} from './schedule-page.derived';

function mockScheduleMatch(
  id: string,
  startTime: string,
  courtId: string,
): ScheduleMatch {
  return {
    id,
    matchNumber: 1,
    categoryId: 'c1',
    categoryTitle: 'Test',
    round: 1,
    roundLabel: 'Vòng 1',
    players: [null, null],
    playerIds: [null, null],
    status: 'scheduled',
    courtId,
    startTime,
    estimatedDurationMinutes: 30,
  };
}

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

  it('isPastScheduleDate compares calendar strings', () => {
    expect(isPastScheduleDate('2026-06-10', '2026-06-13')).toBe(true);
    expect(isPastScheduleDate('2026-06-13', '2026-06-13')).toBe(false);
    expect(isPastScheduleDate('', '2026-06-13')).toBe(false);
  });

  it('todayCalendarDate returns YYYY-MM-DD format', () => {
    expect(todayCalendarDate()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe('timeline schedule dedupe', () => {
  it('dedupeScheduleMatchesById keeps last occurrence', () => {
    const first = mockScheduleMatch('m1', '09:00', 'Sân 1');
    const second = { ...first, startTime: '10:00' };
    expect(dedupeScheduleMatchesById([first, second])).toEqual([second]);
    expect(dedupeScheduleMatchesById([first])).toEqual([first]);
  });

  it('buildTimelinePlacedMatches renders one slot per match id per court', () => {
    const courts = [{ id: 'Sân 1', status: 'available' as const }];
    const dupes = [
      mockScheduleMatch('m1', '09:00', 'Sân 1'),
      mockScheduleMatch('m1', '10:00', 'Sân 1'),
    ];
    const placed = buildTimelinePlacedMatches(courts, dupes, 0, {
      sizing: 'slot',
      estimatedCardHeightPx: 188,
      pxPerMinute: 2,
      isConflict: () => false,
    });
    expect(placed.get('Sân 1')).toHaveLength(1);
    expect(placed.get('Sân 1')![0]!.match.startTime).toBe('10:00');
  });
});
