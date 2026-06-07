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
) {
  const debouncedRefetch = debounceCallback(() => {
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
