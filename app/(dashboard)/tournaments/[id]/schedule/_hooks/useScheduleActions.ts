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

import { useCallback, useEffect, useMemo } from 'react';
import {
  useAssignReferee,
  useCascadeReschedule,
  usePreviewRepackCourtSchedule,
  useRepackCourtSchedule,
  useScheduleMatch,
  useUnscheduleMatch,
} from '@/hooks/tournament';
import { computeRefereeScheduleIssues } from '@/lib/tournament/referee-schedule-conflicts';
import type { TournamentMatch } from '@/graphql/generated';
import { calendarKeyFromIso } from './schedule-page.derived';
import type { SchedulePageData } from './useScheduleData';

export function useScheduleActions(data: SchedulePageData) {
  const {
    tournamentId,
    scheduleMatchesMapped,
    courtBufferMinutes,
    courtOptions,
    repackAnchor,
    repackOpen,
    setSchedulingMatchId,
    setScheduleDate,
    setScheduleCourt,
    setRepackPreview,
    setRepackAnchor,
    setRepackOpen,
    setCascadeOpen,
    refetch,
  } = data;

  const onSuccess = useCallback(() => void refetch(), [refetch]);

  const { scheduleMatch, loading: scheduling } = useScheduleMatch({ onSuccess });
  const { unscheduleMatch, loading: unscheduling } = useUnscheduleMatch({
    onSuccess,
  });
  const { assignReferee, loading: assigning } = useAssignReferee({ onSuccess });
  const { cascadeReschedule, loading: cascading } = useCascadeReschedule({
    onSuccess,
  });
  const {
    previewRepackCourtSchedule,
    loading: repackPreviewLoading,
    data: repackPreviewData,
    error: repackPreviewQueryError,
  } = usePreviewRepackCourtSchedule();
  const { repackCourtSchedule, loading: repacking } = useRepackCourtSchedule({
    onSuccess,
  });

  const isActionLoading =
    scheduling || unscheduling || assigning || cascading || repacking;

  const repackOverdueMatchIds = useMemo(
    () => data.findRepackOverdueIds(repackPreviewData?.preview),
    [data, repackPreviewData?.preview],
  );

  useEffect(() => {
    if (
      !repackOpen ||
      !repackAnchor?.court?.name ||
      !repackAnchor.scheduledAt
    ) {
      return;
    }
    void previewRepackCourtSchedule({
      tournamentId,
      courtName: repackAnchor.court.name,
      calendarDate: calendarKeyFromIso(repackAnchor.scheduledAt),
      anchorMatchId: repackAnchor._id,
    });
  }, [repackOpen, repackAnchor, tournamentId, previewRepackCourtSchedule]);

  const openScheduleForm = useCallback(
    (matchId: string) => {
      setSchedulingMatchId(matchId);
      setScheduleDate('');
      setScheduleCourt(courtOptions[0]?.value ?? '');
    },
    [courtOptions, setScheduleCourt, setScheduleDate, setSchedulingMatchId],
  );

  const closeScheduleForm = useCallback(() => {
    setSchedulingMatchId(null);
    setScheduleDate('');
    setScheduleCourt('');
  }, [setScheduleCourt, setScheduleDate, setSchedulingMatchId]);

  const handleScheduleSubmit = useCallback(() => {
    if (!data.schedulingMatchId || !data.scheduleDate) return;
    void scheduleMatch({
      matchId: data.schedulingMatchId,
      scheduledAt: data.scheduleDate,
      courtName: data.scheduleCourt || undefined,
      estimatedDurationMinutes: 30,
    });
    closeScheduleForm();
  }, [
    closeScheduleForm,
    data.scheduleCourt,
    data.scheduleDate,
    data.schedulingMatchId,
    scheduleMatch,
  ]);

  const handleAssignReferee = useCallback(
    (matchId: string) => {
      const issues = computeRefereeScheduleIssues(scheduleMatchesMapped, {
        courtBufferMinutes,
      });
      const issue = issues.get(matchId);
      if (issue?.severity === 'overlap') {
        const proceed = window.confirm(
          `Trận này trùng lịch trọng tài với #${issue.peerMatchNumbers.join(', #')}. Vẫn gán?`,
        );
        if (!proceed) return;
      } else if (issue?.severity === 'tight_gap') {
        const proceed = window.confirm(
          `Trận này sát giờ với #${issue.peerMatchNumbers.join(', #')} — TT khó kịp di chuyển. Vẫn gán?`,
        );
        if (!proceed) return;
      }

      const refereeName = window.prompt('Tên trọng tài:');
      if (refereeName) {
        void assignReferee(matchId, '', refereeName);
      }
    },
    [assignReferee, courtBufferMinutes, scheduleMatchesMapped],
  );

  const openRepack = useCallback(
    (match: TournamentMatch) => {
      setRepackPreview(undefined);
      setRepackAnchor(match);
      setRepackOpen(true);
    },
    [setRepackAnchor, setRepackOpen, setRepackPreview],
  );

  const handleRepackConfirm = useCallback(async () => {
    if (!repackAnchor?.court?.name || !repackAnchor.scheduledAt) return;
    const result = await repackCourtSchedule({
      tournamentId,
      courtName: repackAnchor.court.name,
      calendarDate: calendarKeyFromIso(repackAnchor.scheduledAt),
      anchorMatchId: repackAnchor._id,
    });
    const preview = result.data?.repackCourtSchedule.preview;
    if (preview?.length) {
      setRepackPreview(preview);
    } else {
      setRepackOpen(false);
    }
  }, [
    repackAnchor,
    repackCourtSchedule,
    setRepackOpen,
    setRepackPreview,
    tournamentId,
  ]);

  const handleCascadeConfirm = useCallback(
    (matchId: string, shiftMinutes: number) => {
      void cascadeReschedule({ matchId, shiftMinutes });
      setCascadeOpen(false);
    },
    [cascadeReschedule, setCascadeOpen],
  );

  return {
    isActionLoading,
    repackPreviewData,
    repackPreviewLoading,
    repackPreviewQueryError,
    repackOverdueMatchIds,
    repacking,
    cascading,
    openScheduleForm,
    closeScheduleForm,
    handleScheduleSubmit,
    handleAssignReferee,
    openRepack,
    handleRepackConfirm,
    handleCascadeConfirm,
    unscheduleMatch,
  };
}

export type SchedulePageActions = ReturnType<typeof useScheduleActions>;
