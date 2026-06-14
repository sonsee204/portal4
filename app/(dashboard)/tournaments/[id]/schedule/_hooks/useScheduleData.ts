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

import { useEffect, useMemo, useState } from 'react';
import {
  useTournament,
  useTournamentCategories,
  useTournamentMatches,
  useTournamentScheduleMatches,
} from '@/hooks/tournament';
import { mapMatchesToSchedule } from '@/lib/tournament/mappers/schedule';
import {
  MatchStatus,
  type ScheduleShiftPreview,
  type TournamentMatch,
} from '@/graphql/generated';
import { ALL_MATCH_STATUS } from './schedule-page.constants';
import { findPortalRepackOverdueMatchIds } from './schedule-page.derived';

export type ScheduleViewMode = 'grid' | 'list';

export function useScheduleData(tournamentId: string) {
  const [viewMode, setViewMode] = useState<ScheduleViewMode>('grid');
  const [statusFilter, setStatusFilter] = useState<
    MatchStatus | typeof ALL_MATCH_STATUS
  >(ALL_MATCH_STATUS);
  const [schedulingMatchId, setSchedulingMatchId] = useState<string | null>(
    null,
  );
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleCourt, setScheduleCourt] = useState('');
  const [correctionMatch, setCorrectionMatch] =
    useState<TournamentMatch | null>(null);
  const [repackAnchor, setRepackAnchor] = useState<TournamentMatch | null>(
    null,
  );
  const [repackOpen, setRepackOpen] = useState(false);
  const [repackPreview, setRepackPreview] = useState<
    ScheduleShiftPreview[] | undefined
  >(undefined);
  const [cascadeAnchor, setCascadeAnchor] = useState<TournamentMatch | null>(
    null,
  );
  const [cascadeOpen, setCascadeOpen] = useState(false);

  const { tournament } = useTournament(tournamentId);
  const { categories } = useTournamentCategories(tournamentId);
  const { matches: scheduleRawMatches } = useTournamentScheduleMatches({
    tournamentId,
  });

  const scheduleMatchesMapped = useMemo(
    () => mapMatchesToSchedule(scheduleRawMatches, categories),
    [scheduleRawMatches, categories],
  );

  const courtBufferMinutes =
    tournament?.scheduleConfig?.courtBufferMinutes ?? 5;

  const availableCourts = useMemo(
    () =>
      (tournament?.courts ?? []).filter(
        (c) => !c.status || c.status === 'available',
      ),
    [tournament?.courts],
  );

  const courtOptions = useMemo(
    () =>
      availableCourts.map((c) => ({
        label: c.name,
        value: c.name,
      })),
    [availableCourts],
  );

  const { matches: gridRawMatches } = useTournamentScheduleMatches({
    tournamentId,
    skip: viewMode !== 'grid',
  });

  const { matches, loading, refetch, subscribeToMatchUpdates } =
    useTournamentMatches({
      tournamentId,
      filter:
        statusFilter === ALL_MATCH_STATUS
          ? undefined
          : { status: statusFilter },
      pagination: { page: 1, limit: 100 },
      skip: viewMode !== 'list',
    });

  useEffect(() => {
    if (viewMode !== 'list' || !tournamentId) return;
    const unsubscribe = subscribeToMatchUpdates();
    return () => unsubscribe();
  }, [subscribeToMatchUpdates, tournamentId, viewMode]);

  return {
    tournamentId,
    viewMode,
    setViewMode,
    statusFilter,
    setStatusFilter,
    schedulingMatchId,
    setSchedulingMatchId,
    scheduleDate,
    setScheduleDate,
    scheduleCourt,
    setScheduleCourt,
    correctionMatch,
    setCorrectionMatch,
    repackAnchor,
    setRepackAnchor,
    repackOpen,
    setRepackOpen,
    repackPreview,
    setRepackPreview,
    cascadeAnchor,
    setCascadeAnchor,
    cascadeOpen,
    setCascadeOpen,
    tournament,
    categories,
    scheduleRawMatches,
    scheduleMatchesMapped,
    courtBufferMinutes,
    courtOptions,
    gridRawMatches,
    matches,
    loading,
    refetch,
    findRepackOverdueIds: (preview: ScheduleShiftPreview[] | undefined) =>
      findPortalRepackOverdueMatchIds(preview, matches),
  };
}

export type SchedulePageData = ReturnType<typeof useScheduleData>;
