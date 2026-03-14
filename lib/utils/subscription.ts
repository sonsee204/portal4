import type { DocumentNode } from '@apollo/client';
import {
  TOURNAMENT_MATCHES_UPDATED_SUB,
  TOURNAMENT_STATUS_CHANGED_SUB,
} from '@/graphql/mutations/tournament';

/**
 * Shared subscription factory for tournament match updates.
 * Triggers a refetch on each subscription event and returns the unsubscribe function.
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
) {
  return subscribeToMore({
    document: TOURNAMENT_MATCHES_UPDATED_SUB,
    variables: { tournamentId },
    updateQuery: () => {
      void refetch();
    },
    onError: (err: Error) => {
      console.error('[tournamentMatchesUpdated subscription]', err.message);
    },
  });
}

/**
 * Subscribe to status changes for multiple tournaments.
 * When any tournament's status changes, refetches the list.
 * Returns unsubscribe function.
 */
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
