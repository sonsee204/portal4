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
import type { TournamentMatch } from '@/graphql/generated';

export type ScheduleDriftBannerPayload = {
  matchId: string;
  matchNumber: number;
  courtName: string;
  driftMinutes: number;
};

export function useScheduleDriftBanner(rawMatches: TournamentMatch[]) {
  const [driftBanner, setDriftBanner] =
    useState<ScheduleDriftBannerPayload | null>(null);
  const prevMatchStatusRef = useRef<Map<string, string>>(new Map());

  useEffect(() => {
    for (const raw of rawMatches) {
      const prev = prevMatchStatusRef.current.get(raw._id);
      if (
        prev === 'LIVE' &&
        (raw.status === 'FINISHED' ||
          raw.status === 'WALKOVER' ||
          raw.status === 'RETIREMENT')
      ) {
        if (raw.durationSeconds != null && raw.estimatedDurationMinutes) {
          const actualMin = Math.round(raw.durationSeconds / 60);
          const drift = actualMin - raw.estimatedDurationMinutes;
          if (Math.abs(drift) > 2) {
            queueMicrotask(() =>
              setDriftBanner({
                matchId: raw._id,
                matchNumber: raw.matchNumber,
                courtName: raw.court?.name ?? '',
                driftMinutes: drift,
              }),
            );
          }
        }
      }
      prevMatchStatusRef.current.set(raw._id, raw.status);
    }
  }, [rawMatches]);

  const dismissDriftBanner = useCallback(() => setDriftBanner(null), []);

  return { driftBanner, dismissDriftBanner };
}
