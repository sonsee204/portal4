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

import { useEffect } from 'react';
import {
  createMatchSubscription,
  SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS,
} from '@/lib/utils/subscription';

export function useScheduleRealtime({
  tournamentId,
  subscribeToMore,
  refetchSchedule,
  hasPendingMoves,
}: {
  tournamentId: string;
  subscribeToMore: unknown;
  refetchSchedule: () => void | Promise<unknown>;
  hasPendingMoves: () => boolean;
}) {
  useEffect(() => {
    if (!tournamentId || !subscribeToMore) return;
    const unsubscribe = createMatchSubscription(
      subscribeToMore as Parameters<typeof createMatchSubscription>[0],
      () => void refetchSchedule(),
      tournamentId,
      SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS,
      () => !hasPendingMoves(),
    );
    return unsubscribe;
  }, [tournamentId, subscribeToMore, refetchSchedule, hasPendingMoves]);
}
