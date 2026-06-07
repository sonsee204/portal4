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
  useScheduleMatch,
  useUnscheduleMatch,
} from '@/hooks/tournament';
import {
  mapMatchesToSchedule,
  mapTournamentCourts,
} from '@/lib/tournament/mappers/schedule';
import { filterMatchesByScheduleDate } from '@/lib/tournament/schedule-match-scope';
import {
  createMatchSubscription,
  SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS,
} from '@/lib/utils/subscription';
import { useScheduleOptimisticMoves } from '@/lib/tournament/use-schedule-optimistic-moves';
import { detectRepackAfterDrop } from '@/lib/tournament/detect-repack-after-drop';
import type { RepackAfterDropHint } from '@/lib/tournament/detect-repack-after-drop';
import { showError, showSuccessWithAction, showWarning } from '@/lib/toast';
import { ScheduleGrid } from './ScheduleGrid';
import { computeTimelineDayRange } from './TournamentCourtTimelineGrid';
import { ScheduleAutoRepackBanner } from './ScheduleAutoRepackBanner';
import { ScheduleDriftBanner } from './ScheduleDriftBanner';
import { ScheduleDndLayout } from './ScheduleDndLayout';
import { ScheduleRepackAfterDropBanner } from './ScheduleRepackAfterDropBanner';
import type { ScheduleDropPayload } from './schedule-dnd-types';

interface ScheduleTimelineViewProps {
  tournamentId: string;
  onMatchClick: (matchId: string) => void;
  onEmptyClick: (courtId: string, time: string) => void;
  onRepackRequest?: (anchorMatchId: string) => void;
}

export function ScheduleTimelineView({
  tournamentId,
  onMatchClick,
  onEmptyClick,
  onRepackRequest,
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

  const {
    applyOptimisticMove,
    commitMove,
    rollbackMove,
    patchMatches,
    hasPendingMoves,
  } = useScheduleOptimisticMoves();

  const displayMatches = useMemo(
    () => patchMatches(scheduleMatches),
    [scheduleMatches, patchMatches]
  );

  const { scheduleMatch } = useScheduleMatch({
    onSuccess: () => void refetch(),
    onWarnings: (warnings: string[]) => warnings.forEach((w) => showWarning(w)),
  });
  const { unscheduleMatch } = useUnscheduleMatch({
    onSuccess: () => void refetch(),
  });

  const [repackAfterDropHint, setRepackAfterDropHint] =
    useState<RepackAfterDropHint | null>(null);

  const courts = useMemo(
    () => mapTournamentCourts(tournament?.courts ?? []),
    [tournament?.courts]
  );

  const scheduleDates = useMemo(() => {
    const dates = new Set<string>();
    for (const m of displayMatches) {
      if (m.scheduledDate) dates.add(m.scheduledDate);
    }
    return [...dates].sort();
  }, [displayMatches]);

  const [selectedDate, setSelectedDate] = useState('');

  const activeDate = useMemo(() => {
    if (selectedDate && scheduleDates.includes(selectedDate)) {
      return selectedDate;
    }
    return scheduleDates[0] ?? '';
  }, [selectedDate, scheduleDates]);

  const today = useMemo(() => new Date().toLocaleDateString('en-CA'), []);
  const isPastDate = activeDate !== '' && activeDate < today;
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
    [displayMatches, activeDate]
  );

  const scheduledDayMatches = useMemo(
    () => dayMatches.filter((m) => m.courtId && m.startTime),
    [dayMatches]
  );

  const dayRange = useMemo(
    () =>
      computeTimelineDayRange(scheduledDayMatches, {
        selectedDate: activeDate,
      }),
    [scheduledDayMatches, activeDate]
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
      tournamentId,
      SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS,
      () => !hasPendingMoves()
    );
    return () => unsubscribe();
  }, [subscribeToMore, refetch, tournamentId, hasPendingMoves]);

  const handleScheduleDrop = useCallback(
    async ({ matchId, courtId, time }: ScheduleDropPayload) => {
      if (isPastDate || !activeDate) return;
      const match = scheduleMatches.find((m) => m.id === matchId);
      if (!match) return;

      const undoSnapshot = {
        courtId: match.courtId,
        startTime: match.startTime,
        scheduledDate: match.scheduledDate ?? activeDate,
      };

      applyOptimisticMove(match, courtId, time, activeDate);

      try {
        await scheduleMatch({
          matchId,
          courtName: courtId,
          scheduledAt: `${activeDate}T${time}:00`,
        });
        commitMove(matchId);

        const hint = detectRepackAfterDrop(
          { ...match, courtId, startTime: time, scheduledDate: activeDate },
          patchMatches(scheduleMatches),
          courtBufferMinutes
        );
        if (hint) setRepackAfterDropHint(hint);

        showSuccessWithAction(`Đã đổi lịch trận #${match.matchNumber}`, {
          label: 'Hoàn tác',
          onClick: () => {
            if (!undoSnapshot.courtId || !undoSnapshot.startTime) return;
            void scheduleMatch({
              matchId,
              courtName: undoSnapshot.courtId,
              scheduledAt: `${undoSnapshot.scheduledDate}T${undoSnapshot.startTime}:00`,
            });
          },
        });
      } catch (err) {
        rollbackMove(matchId);
        showError(
          err instanceof Error ? err.message : 'Không thể đổi lịch trận'
        );
      }
    },
    [
      isPastDate,
      activeDate,
      scheduleMatches,
      applyOptimisticMove,
      scheduleMatch,
      commitMove,
      rollbackMove,
      patchMatches,
      courtBufferMinutes,
    ]
  );

  const handleUnscheduleDrop = useCallback(
    async (matchId: string) => {
      try {
        await unscheduleMatch(matchId);
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Không thể gỡ lịch');
      }
    },
    [unscheduleMatch]
  );

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

      {repackAfterDropHint ? (
        <ScheduleRepackAfterDropBanner
          hint={repackAfterDropHint}
          courtName={
            courts.find((c) => c.id === repackAfterDropHint.courtId)?.name
          }
          onPreviewRepack={() => {
            onRepackRequest?.(repackAfterDropHint.anchorMatchId);
            setRepackAfterDropHint(null);
          }}
          onDismiss={() => setRepackAfterDropHint(null)}
        />
      ) : null}

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
        ) : (
          <ScheduleDndLayout
            enabled
            courts={courts}
            allMatches={displayMatches}
            scheduledMatches={scheduledDayMatches}
            dayRange={dayRange}
            selectedDate={activeDate}
            isPastDate={isPastDate}
            minRestMinutes={minRestMinutes}
            courtBufferMinutes={courtBufferMinutes}
            onScheduleDrop={handleScheduleDrop}
            onUnscheduleDrop={handleUnscheduleDrop}
          >
            {scheduledDayMatches.length === 0 ? (
              <p className="text-muted border-surface-border border-b px-4 py-2 text-center text-xs">
                Chưa có trận xếp lịch — nhấn ô trống trên lưới để xếp lịch
              </p>
            ) : null}
            <ScheduleGrid
              courts={courts}
              matches={scheduledDayMatches}
              dayRange={dayRange}
              selectedDate={activeDate}
              isPastDate={isPastDate}
              onClickEmpty={onEmptyClick}
              onClickMatch={handleMatchClick}
              courtBufferMinutes={courtBufferMinutes}
              dragDropEnabled
              emptyColumnHint="Nhấn hoặc kéo thả để xếp lịch"
            />
          </ScheduleDndLayout>
        )}
      </GlassPanel>
    </div>
  );
}
