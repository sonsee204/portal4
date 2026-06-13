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

import type { DocumentNode } from '@apollo/client';
import {
  TOURNAMENT_MATCHES_UPDATED_SUB,
  TOURNAMENT_STATUS_CHANGED_SUB,
} from '@/graphql/mutations/tournament';

export const SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS = 3_000;

function debounceCallback(callback: () => void, waitMs: number): () => void {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      callback();
    }, waitMs);
  };
}

/**
 * Shared subscription factory for tournament match updates.
 * Triggers a debounced refetch on each subscription event.
 */
export function createMatchSubscription(
  subscribeToMore: (options: {
    document: DocumentNode;
    variables: Record<string, unknown>;
    updateQuery: () => void;
    onError: (err: Error) => void;
  }) => () => void,
  refetch: () => void,
  tournamentId: string,
  debounceMs = SCHEDULE_SUBSCRIPTION_REFETCH_DEBOUNCE_MS,
  shouldRefetch?: () => boolean,
) {
  const debouncedRefetch = debounceCallback(() => {
    if (shouldRefetch && !shouldRefetch()) return;
    void refetch();
  }, debounceMs);

  return subscribeToMore({
    document: TOURNAMENT_MATCHES_UPDATED_SUB,
    variables: { tournamentId },
    updateQuery: () => {
      debouncedRefetch();
    },
    onError: (err: Error) => {
      console.error('[tournamentMatchesUpdated subscription]', err.message);
    },
  });
}

export function createTournamentStatusSubscriptions(
  subscribeToMore: (options: {
    document: DocumentNode;
    variables: Record<string, unknown>;
    updateQuery: () => void;
    onError: (err: Error) => void;
  }) => () => void,
  refetch: () => void,
  tournamentIds: string[],
) {
  const unsubscribes = tournamentIds.map((tournamentId) =>
    subscribeToMore({
      document: TOURNAMENT_STATUS_CHANGED_SUB,
      variables: { tournamentId },
      updateQuery: () => {
        void refetch();
      },
      onError: (err: Error) => {
        console.error('[tournamentStatusChanged subscription]', err.message);
      },
    }),
  );
  return () => unsubscribes.forEach((fn) => fn());
}
