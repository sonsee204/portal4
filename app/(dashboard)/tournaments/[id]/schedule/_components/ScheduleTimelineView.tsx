'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import {
  useTournament,
  useTournamentCategories,
  useTournamentScheduleMatches,
  useScheduleAutoRepackBanner,
  useScheduleDriftBanner,
} from '@/hooks/tournament';
import {
  mapMatchesToSchedule,
  mapTournamentCourts,
} from '@/lib/tournament/mappers/schedule';
import { filterMatchesByScheduleDate } from '@/lib/tournament/schedule-match-scope';
import { createMatchSubscription } from '@/lib/utils/subscription';
import { ScheduleGrid } from './ScheduleGrid';
import { computeTimelineDayRange } from './TournamentCourtTimelineGrid';
import { ScheduleAutoRepackBanner } from './ScheduleAutoRepackBanner';
import { ScheduleDriftBanner } from './ScheduleDriftBanner';

interface ScheduleTimelineViewProps {
  tournamentId: string;
  onMatchClick: (matchId: string) => void;
  onEmptyClick: (courtId: string, time: string) => void;
}

export function ScheduleTimelineView({
  tournamentId,
  onMatchClick,
  onEmptyClick,
}: ScheduleTimelineViewProps) {
  const { tournament } = useTournament(tournamentId);
  const { categories } = useTournamentCategories(tournamentId);
  const {
    matches: rawMatches,
    loading,
    refetch,
    subscribeToMore,
  } = useTournamentScheduleMatches({ tournamentId });

  const scheduleMatches = useMemo(
    () => mapMatchesToSchedule(rawMatches, categories),
    [rawMatches, categories]
  );

  const courts = useMemo(
    () => mapTournamentCourts(tournament?.courts ?? []),
    [tournament?.courts]
  );

  const scheduleDates = useMemo(() => {
    const dates = new Set<string>();
    for (const m of scheduleMatches) {
      if (m.scheduledDate) dates.add(m.scheduledDate);
    }
    return [...dates].sort();
  }, [scheduleMatches]);

  const [selectedDate, setSelectedDate] = useState('');

  const activeDate = useMemo(() => {
    if (selectedDate && scheduleDates.includes(selectedDate)) {
      return selectedDate;
    }
    return scheduleDates[0] ?? '';
  }, [selectedDate, scheduleDates]);

  const dayMatches = useMemo(
    () =>
      activeDate
        ? filterMatchesByScheduleDate(scheduleMatches, activeDate, {
            includeUnscheduledWithoutDate: false,
          })
        : scheduleMatches,
    [scheduleMatches, activeDate]
  );

  const dayRange = useMemo(
    () => computeTimelineDayRange(dayMatches),
    [dayMatches]
  );

  const { autoRepackBanner, dismissAutoRepackBanner } =
    useScheduleAutoRepackBanner(scheduleMatches, courts);
  const { driftBanner, dismissDriftBanner } =
    useScheduleDriftBanner(rawMatches);

  useEffect(() => {
    if (!tournamentId) return;
    const unsubscribe = createMatchSubscription(
      subscribeToMore,
      refetch,
      tournamentId
    );
    return () => unsubscribe();
  }, [subscribeToMore, refetch, tournamentId]);

  const handleMatchClick = useCallback(
    (matchId: string) => onMatchClick(matchId),
    [onMatchClick]
  );

  if (loading && scheduleMatches.length === 0) {
    return (
      <GlassPanel card>
        <div className="flex items-center justify-center py-16">
          <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  return (
    <div className="space-y-4">
      <ScheduleAutoRepackBanner
        open={autoRepackBanner != null}
        kind={autoRepackBanner?.kind}
        courtLabels={autoRepackBanner?.courtLabels ?? []}
        shifts={autoRepackBanner?.shifts ?? []}
        anchorMatchNumber={autoRepackBanner?.anchorMatchNumber}
        onDismiss={dismissAutoRepackBanner}
      />
      <ScheduleDriftBanner
        open={driftBanner != null}
        payload={driftBanner}
        onDismiss={dismissDriftBanner}
      />

      {scheduleDates.length > 0 ? (
        <div className="max-w-xs">
          <Select
            label="Ngày thi đấu"
            value={activeDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            options={scheduleDates.map((d) => ({
              label: new Date(`${d}T12:00:00`).toLocaleDateString('vi-VN', {
                weekday: 'short',
                day: '2-digit',
                month: '2-digit',
              }),
              value: d,
            }))}
          />
        </div>
      ) : null}

      <GlassPanel card className="overflow-hidden p-0">
        {courts.length === 0 ? (
          <p className="text-muted p-8 text-center text-sm">
            Chưa có sân. Thêm sân trong phần cài đặt giải.
          </p>
        ) : dayMatches.length === 0 ? (
          <p className="text-muted p-8 text-center text-sm">
            Chưa có trận nào được xếp lịch trong ngày này.
          </p>
        ) : (
          <ScheduleGrid
            courts={courts}
            matches={dayMatches}
            dayRange={dayRange}
            onClickEmpty={onEmptyClick}
            onClickMatch={handleMatchClick}
            courtBufferMinutes={
              tournament?.scheduleConfig?.courtBufferMinutes ?? 5
            }
          />
        )}
      </GlassPanel>
    </div>
  );
}
