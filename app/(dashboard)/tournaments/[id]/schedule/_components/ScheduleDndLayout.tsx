'use client';

import { useMemo, type ReactNode } from 'react';
import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import {
  computeEffectivePxPerMinute,
  DEFAULT_TIMELINE_CARD_ESTIMATE_PX,
} from './timeline-card-layout';
import { ScheduleDndProvider } from './ScheduleDndContext';
import type { ScheduleDropPayload } from './schedule-dnd-types';

interface ScheduleDndLayoutProps {
  enabled: boolean;
  courts: ScheduleCourt[];
  allMatches: ScheduleMatch[];
  scheduledMatches: ScheduleMatch[];
  dayRange: [number, number];
  selectedDate: string;
  isPastDate?: boolean;
  minRestMinutes?: number;
  courtBufferMinutes?: number;
  onScheduleDrop: (payload: ScheduleDropPayload) => void | Promise<void>;
  onUnscheduleDrop?: (matchId: string) => void | Promise<void>;
  children: ReactNode;
}

export function ScheduleDndLayout({
  enabled,
  courts,
  allMatches,
  scheduledMatches,
  dayRange,
  selectedDate,
  isPastDate = false,
  minRestMinutes = 0,
  courtBufferMinutes = 5,
  onScheduleDrop,
  onUnscheduleDrop,
  children,
}: ScheduleDndLayoutProps) {
  const pxPerMinute = useMemo(
    () =>
      computeEffectivePxPerMinute(
        scheduledMatches,
        DEFAULT_TIMELINE_CARD_ESTIMATE_PX,
        'slot',
      ),
    [scheduledMatches],
  );

  const gridMetrics = useMemo(
    () => ({
      dayStart: dayRange[0],
      dayEnd: dayRange[1],
      pxPerMinute,
    }),
    [dayRange, pxPerMinute],
  );

  const dndOn = enabled && !isPastDate;

  if (!dndOn) return <>{children}</>;

  return (
    <ScheduleDndProvider
      enabled
      matches={allMatches}
      courts={courts}
      selectedDate={selectedDate}
      gridMetrics={gridMetrics}
      minRestMinutes={minRestMinutes}
      courtBufferMinutes={courtBufferMinutes}
      onScheduleDrop={onScheduleDrop}
      onUnscheduleDrop={onUnscheduleDrop}
    >
      {children}
    </ScheduleDndProvider>
  );
}
