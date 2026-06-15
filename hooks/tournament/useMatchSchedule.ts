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

import { useCallback, useEffect } from 'react';
import { useApolloClient, useQuery, useMutation, useLazyQuery } from '@apollo/client/react';
import {
  GET_TOURNAMENT_MATCHES,
  GET_REFEREE_MATCHES,
} from '@/graphql/tournament/queries';
import {
  SCHEDULE_MATCH,
  BULK_SCHEDULE_MATCHES,
  UNSCHEDULE_MATCH,
  ASSIGN_REFEREE,
  CASCADE_RESCHEDULE,
  REPACK_COURT_SCHEDULE,
} from '@/graphql/tournament/mutations/schedule';
import { PREVIEW_REPACK_COURT_SCHEDULE } from '@/graphql/tournament/queries';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { createMatchSubscription } from '@/lib/utils/subscription';
import { TOURNAMENT } from '@/lib/strings';
import type {
  TournamentMatch,
  MatchFilterInput,
  ScheduleMatchInput,
  CascadeRescheduleInput,
  CascadeRescheduleResult,
  RepackCourtScheduleInput,
  RepackCourtScheduleResult,
  RepackCourtSchedulePreviewResult,
  GetTournamentMatchesQuery,
} from '@/graphql/generated';
import {
  resolveConnectionFirst,
  totalPagesFromCount,
  connectionNodes,
} from '@/hooks/shared/useCursorConnection';
import { useConnectionPageAfter } from '@/hooks/shared/useConnectionPageAfter';
import type { LegacyPagePagination } from '@/hooks/shared/useCursorConnection';

interface UseTournamentMatchesOptions {
  tournamentId: string;
  filter?: MatchFilterInput;
  pagination?: LegacyPagePagination;
  skip?: boolean;
}

export function useTournamentMatches(options: UseTournamentMatchesOptions) {
  const { tournamentId, filter, pagination, skip } = options;
  const page = pagination?.page ?? 1;
  const first = resolveConnectionFirst(pagination);
  const resetKey = JSON.stringify({ tournamentId, filter });

  const client = useApolloClient();
  const prefetchPage = useCallback(
    async (after: string | null, pageSize: number) => {
      const { data } = await client.query<GetTournamentMatchesQuery>({
        query: GET_TOURNAMENT_MATCHES,
        variables: {
          tournamentId,
          filter,
          pagination: { first: pageSize, after },
        },
        fetchPolicy: 'network-only',
      });
      const conn = data?.tournamentMatchesConnection;
      return {
        endCursor: conn?.pageInfo?.endCursor,
        hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      };
    },
    [client, tournamentId, filter],
  );

  const { after, resolving, rememberEndCursor } = useConnectionPageAfter({
    page,
    first,
    resetKey,
    prefetchPage,
  });

  const { data, loading, error, refetch, subscribeToMore } =
    useQuery<GetTournamentMatchesQuery>(GET_TOURNAMENT_MATCHES, {
      variables: {
        tournamentId,
        filter,
        pagination: { first, after },
      },
      fetchPolicy: 'cache-and-network',
      skip: skip || !tournamentId || (page > 1 && resolving),
    });

  const connection = data?.tournamentMatchesConnection;
  useEffect(() => {
    rememberEndCursor(page, connection?.pageInfo?.endCursor);
  }, [page, connection?.pageInfo?.endCursor, rememberEndCursor]);

  const subscribeToMatchUpdates = useCallback(
    () => createMatchSubscription(subscribeToMore, refetch, tournamentId),
    [subscribeToMore, refetch, tournamentId],
  );

  return {
    matches: connectionNodes(connection?.edges) ?? [],
    total: connection?.totalCount ?? 0,
    page,
    totalPages: totalPagesFromCount(connection?.totalCount ?? 0, first),
    loading: loading || resolving,
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

export function useScheduleMatch(
  options?: {
    onSuccess?: () => void;
    onWarnings?: (warnings: string[]) => void;
  },
) {
  const [mutation, { loading }] = useMutation<{
    scheduleMatch: { match: TournamentMatch; warnings?: string[] };
  }>(SCHEDULE_MATCH, {
    ...createMutationOptions('ScheduleMatch', TOURNAMENT.SUCCESS_SCHEDULE),
    onCompleted: (data) => {
      const warnings = data.scheduleMatch.warnings ?? [];
      if (warnings.length > 0) options?.onWarnings?.(warnings);
      options?.onSuccess?.();
    },
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

export function useCascadeReschedule(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    cascadeReschedule: CascadeRescheduleResult;
  }>(CASCADE_RESCHEDULE, {
    onCompleted: () => options?.onSuccess?.(),
  });

  const cascadeReschedule = useCallback(
    (input: CascadeRescheduleInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { cascadeReschedule, loading };
}

export function usePreviewRepackCourtSchedule() {
  const [fetchPreview, { loading, data, error }] = useLazyQuery<{
    previewRepackCourtSchedule: RepackCourtSchedulePreviewResult;
  }>(PREVIEW_REPACK_COURT_SCHEDULE, {
    fetchPolicy: 'network-only',
  });

  const previewRepackCourtSchedule = useCallback(
    (input: RepackCourtScheduleInput) =>
      fetchPreview({ variables: { input } }),
    [fetchPreview],
  );

  return {
    previewRepackCourtSchedule,
    loading,
    data: data?.previewRepackCourtSchedule,
    error,
  };
}

export function useRepackCourtSchedule(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    repackCourtSchedule: RepackCourtScheduleResult;
  }>(REPACK_COURT_SCHEDULE, {
    onCompleted: () => options?.onSuccess?.(),
  });

  const repackCourtSchedule = useCallback(
    (input: RepackCourtScheduleInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { repackCourtSchedule, loading };
}
