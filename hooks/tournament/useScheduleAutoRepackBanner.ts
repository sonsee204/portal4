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

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  detectScheduleAutoRepack,
  type AutoRepackBannerPayload,
} from '@/lib/tournament/detect-schedule-auto-repack';
import type { ScheduleMatch } from '@/types/tournament-schedule';

type CourtLike = { id: string; name: string };

export function useScheduleAutoRepackBanner(
  matches: ScheduleMatch[],
  courts: CourtLike[],
) {
  const [autoRepackBanner, setAutoRepackBanner] =
    useState<AutoRepackBannerPayload | null>(null);
  const scheduleSnapshotRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const { nextSnapshot, banner } = detectScheduleAutoRepack(
      scheduleSnapshotRef.current,
      matches,
      courts,
    );
    scheduleSnapshotRef.current = nextSnapshot;
    if (banner) {
      queueMicrotask(() => setAutoRepackBanner(banner));
    }
  }, [matches, courts]);

  const dismissAutoRepackBanner = useCallback(
    () => setAutoRepackBanner(null),
    [],
  );

  return { autoRepackBanner, dismissAutoRepackBanner };
}
