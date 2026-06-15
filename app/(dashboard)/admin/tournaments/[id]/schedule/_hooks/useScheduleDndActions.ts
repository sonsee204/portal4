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

import { useCallback } from 'react';
import { detectRepackAfterDrop } from '@/lib/tournament/detect-repack-after-drop';
import {
  showError,
  showSuccessWithAction,
} from '@/lib/toast';
import type { ScheduleDropPayload } from '../_components/schedule-dnd-types';
import type { SchedulePageData } from './useScheduleData';

export function useScheduleDndActions(data: SchedulePageData) {
  const {
    scheduleMatchesMapped,
    activeDate,
    isPastDate,
    courtBufferMinutes,
    setRepackAfterDropHint,
    scheduleMatch,
    unscheduleMatch,
    applyOptimisticMove,
    commitMove,
    rollbackMove,
    patchMatches,
    refetchSchedule,
  } = data;

  const handleScheduleDrop = useCallback(
    async ({ matchId, courtId, time }: ScheduleDropPayload) => {
      if (isPastDate || !activeDate) return;
      const match = scheduleMatchesMapped.find((m) => m.id === matchId);
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
          patchMatches(scheduleMatchesMapped),
          courtBufferMinutes,
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
            }).then(() => void refetchSchedule());
          },
        });
      } catch (err) {
        rollbackMove(matchId);
        showError(
          err instanceof Error ? err.message : 'Không thể đổi lịch trận',
        );
      }
    },
    [
      isPastDate,
      activeDate,
      scheduleMatchesMapped,
      applyOptimisticMove,
      scheduleMatch,
      commitMove,
      rollbackMove,
      patchMatches,
      courtBufferMinutes,
      refetchSchedule,
      setRepackAfterDropHint,
    ],
  );

  const handleUnscheduleDrop = useCallback(
    async (matchId: string) => {
      try {
        await unscheduleMatch(matchId);
      } catch (err) {
        showError(err instanceof Error ? err.message : 'Không thể gỡ lịch');
      }
    },
    [unscheduleMatch],
  );

  return {
    handleScheduleDrop,
    handleUnscheduleDrop,
  };
}
