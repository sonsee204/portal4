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

'use client';

import { useMemo } from 'react';
import type { Tournament } from '@/graphql/generated';
import { mapTournamentCourts } from '@/lib/tournament/mappers/schedule';
import { filterMatchesByScheduleDate } from '@/lib/tournament/schedule-match-scope';
import { computeTimelineDayRange } from '@/lib/tournament/compute-timeline-day-range';
import type { ScheduleMatch } from '@/types/tournament-schedule';
import { dedupeScheduleMatchesById } from '../_components/timeline-card-layout';
import {
  isPastScheduleDate,
  todayCalendarDate,
} from './schedule-page.derived';

export function useScheduleGridDerived({
  tournament,
  displayMatches,
  gridSelectedDate,
}: {
  tournament: Tournament | null | undefined;
  displayMatches: ScheduleMatch[];
  gridSelectedDate: string;
}) {
  const courts = useMemo(
    () => mapTournamentCourts(tournament?.courts ?? []),
    [tournament?.courts],
  );

  const scheduleDates = useMemo(() => {
    const dates = new Set<string>();
    for (const m of displayMatches) {
      if (m.scheduledDate) dates.add(m.scheduledDate);
    }
    return [...dates].sort();
  }, [displayMatches]);

  const activeDate = useMemo(() => {
    if (gridSelectedDate && scheduleDates.includes(gridSelectedDate)) {
      return gridSelectedDate;
    }
    return scheduleDates[0] ?? '';
  }, [gridSelectedDate, scheduleDates]);

  const today = useMemo(() => todayCalendarDate(), []);
  const isPastDate =
    activeDate !== '' && isPastScheduleDate(activeDate, today);
  const courtBufferMinutes =
    tournament?.scheduleConfig?.courtBufferMinutes ?? 5;
  const minRestMinutes = tournament?.scheduleConfig?.minRestMinutes ?? 0;

  const dayMatches = useMemo(
    () =>
      activeDate
        ? filterMatchesByScheduleDate(displayMatches, activeDate, {
          includeUnscheduledWithoutDate: false,
        })
        : displayMatches,
    [displayMatches, activeDate],
  );

  const scheduledDayMatches = useMemo(() => {
    const scheduled = dayMatches.filter((m) => m.courtId && m.startTime);
    return dedupeScheduleMatchesById(scheduled);
  }, [dayMatches]);

  const dayRange = useMemo(
    () =>
      computeTimelineDayRange(scheduledDayMatches, {
        selectedDate: activeDate,
      }),
    [scheduledDayMatches, activeDate],
  );

  return {
    courts,
    scheduleDates,
    activeDate,
    dayMatches,
    scheduledDayMatches,
    dayRange,
    isPastDate,
    minRestMinutes,
    courtBufferMinutes,
    today,
  };
}
