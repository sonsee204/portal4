'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  detectScheduleAutoRepack,
  type AutoRepackBannerPayload,
} from '@/lib/tournament/detect-schedule-auto-repack';
import type { TournamentMatch } from '@/graphql/generated';

export function useScheduleAutoRepackBanner(
  matches: TournamentMatch[],
  formatScheduleDate: (iso: string) => string
) {
  const [autoRepackBanner, setAutoRepackBanner] =
    useState<AutoRepackBannerPayload | null>(null);
  const scheduleSnapshotRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    const { nextSnapshot, banner } = detectScheduleAutoRepack(
      scheduleSnapshotRef.current,
      matches,
      formatScheduleDate
    );
    scheduleSnapshotRef.current = nextSnapshot;
    if (banner) {
      queueMicrotask(() => setAutoRepackBanner(banner));
    }
  }, [matches, formatScheduleDate]);

  const dismissAutoRepackBanner = useCallback(
    () => setAutoRepackBanner(null),
    []
  );

  return { autoRepackBanner, dismissAutoRepackBanner };
}
