'use client';

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import {
  GET_TOURNAMENT_MATCHES,
  GET_REFEREE_MATCHES,
} from '@/graphql/queries/tournament';
import {
  SCHEDULE_MATCH,
  BULK_SCHEDULE_MATCHES,
  UNSCHEDULE_MATCH,
  ASSIGN_REFEREE,
} from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { createMatchSubscription } from '@/lib/utils/subscription';
import { TOURNAMENT } from '@/lib/strings';
import type {
  TournamentMatch,
  MatchList,
  MatchFilterInput,
  PaginationInput,
  ScheduleMatchInput,
} from '@/graphql/generated';

interface UseTournamentMatchesOptions {
  tournamentId: string;
  filter?: MatchFilterInput;
  pagination?: PaginationInput;
  skip?: boolean;
}

export function useTournamentMatches(options: UseTournamentMatchesOptions) {
  const { tournamentId, filter, pagination, skip } = options;

  const { data, loading, error, refetch, subscribeToMore } = useQuery<{
    tournamentMatches: MatchList;
  }>(GET_TOURNAMENT_MATCHES, {
    variables: { tournamentId, filter, pagination },
    fetchPolicy: 'cache-and-network',
    skip: skip || !tournamentId,
  });

  const result = data?.tournamentMatches;

  const subscribeToMatchUpdates = useCallback(
    () => createMatchSubscription(subscribeToMore, refetch, tournamentId),
    [subscribeToMore, refetch, tournamentId],
  );

  return {
    matches: result?.matches ?? [],
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    loading,
    error,
    refetch,
    subscribeToMatchUpdates,
  };
}

export function useRefereeMatches(tournamentId: string, skip = false) {
  const { data, loading, error, refetch } = useQuery<{
    refereeMatches: TournamentMatch[];
  }>(GET_REFEREE_MATCHES, {
    variables: { tournamentId },
    fetchPolicy: 'cache-and-network',
    skip: skip || !tournamentId,
  });

  return {
    matches: data?.refereeMatches ?? [],
    loading,
    error,
    refetch,
  };
}

export function useScheduleMatch(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    scheduleMatch: TournamentMatch;
  }>(SCHEDULE_MATCH, {
    ...createMutationOptions('ScheduleMatch', TOURNAMENT.SUCCESS_SCHEDULE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const scheduleMatch = useCallback(
    (input: ScheduleMatchInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { scheduleMatch, loading };
}

export function useBulkScheduleMatches(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    bulkScheduleMatches: TournamentMatch[];
  }>(BULK_SCHEDULE_MATCHES, {
    ...createMutationOptions('BulkScheduleMatches', TOURNAMENT.SUCCESS_BULK_SCHEDULE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const bulkSchedule = useCallback(
    (items: ScheduleMatchInput[]) => mutation({ variables: { input: { items } } }),
    [mutation],
  );

  return { bulkSchedule, loading };
}

export function useUnscheduleMatch(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    unscheduleMatch: TournamentMatch;
  }>(UNSCHEDULE_MATCH, {
    ...createMutationOptions('UnscheduleMatch', TOURNAMENT.SUCCESS_UNSCHEDULE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const unscheduleMatch = useCallback(
    (matchId: string) => mutation({ variables: { matchId } }),
    [mutation],
  );

  return { unscheduleMatch, loading };
}

export function useAssignReferee(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    assignReferee: TournamentMatch;
  }>(ASSIGN_REFEREE, {
    ...createMutationOptions('AssignReferee', TOURNAMENT.SUCCESS_ASSIGN_REFEREE),
    onCompleted: () => options?.onSuccess?.(),
  });

  const assignReferee = useCallback(
    (matchId: string, refereeId: string, refereeName?: string) =>
      mutation({ variables: { input: { matchId, refereeId, refereeName } } }),
    [mutation],
  );

  return { assignReferee, loading };
}
