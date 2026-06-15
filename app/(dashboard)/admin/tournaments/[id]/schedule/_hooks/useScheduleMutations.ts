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
import { useScheduleOptimisticMoves } from '@/lib/tournament/use-schedule-optimistic-moves';
import { showWarning } from '@/lib/toast';
import {
  useScheduleMatch,
  useUnscheduleMatch,
} from '@/hooks/tournament';

export function useScheduleMutations(
  refetchSchedule: () => void | Promise<unknown>,
) {
  const onSuccess = useCallback(() => {
    void refetchSchedule();
  }, [refetchSchedule]);

  const { scheduleMatch, loading: scheduling } = useScheduleMatch({
    onSuccess,
    onWarnings: (warnings) => warnings.forEach((w) => showWarning(w)),
  });

  const { unscheduleMatch, loading: unscheduling } = useUnscheduleMatch({
    onSuccess,
  });

  const {
    applyOptimisticMove,
    commitMove,
    rollbackMove,
    patchMatches,
    hasPendingMoves,
  } = useScheduleOptimisticMoves();

  return {
    onSuccess,
    scheduleMatch,
    scheduling,
    unscheduleMatch,
    unscheduling,
    applyOptimisticMove,
    commitMove,
    rollbackMove,
    patchMatches,
    hasPendingMoves,
  };
}
