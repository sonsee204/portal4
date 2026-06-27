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

import type { ApolloClient } from '@apollo/client';
import { GET_TOURNAMENT_MATCHES } from '@/graphql/tournament/queries';
import type {
  GetTournamentMatchesQuery,
  GetTournamentMatchesQueryVariables,
  MatchFilterInput,
  TournamentMatch,
} from '@/graphql/generated';
import { fetchAllConnectionPages } from '@/hooks/shared/useCursorConnection';
import {
  dedupeTournamentMatchesById,
  loadTournamentScheduleMatchesComplete,
  type ScheduleMatchLoadResult,
} from '@/lib/tournament/load-tournament-schedule-matches';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';

export async function fetchScheduleMatchesConnectionPage(
  client: ApolloClient,
  args: {
    tournamentId: string;
    filter?: MatchFilterInput;
    after?: string | null;
  },
) {
  const { data } = await client.query<
    GetTournamentMatchesQuery,
    GetTournamentMatchesQueryVariables
  >({
    query: GET_TOURNAMENT_MATCHES,
    variables: {
      tournamentId: args.tournamentId,
      filter: args.filter,
      pagination: { first: CURSOR_PAGE_MAX, after: args.after ?? null },
    },
    fetchPolicy: 'network-only',
  });

  const conn = data?.tournamentMatchesConnection;
  return {
    edges: conn?.edges ?? [],
    pageInfo: {
      hasNextPage: conn?.pageInfo?.hasNextPage ?? false,
      endCursor: conn?.pageInfo?.endCursor,
    },
    totalCount: conn?.totalCount ?? 0,
  };
}

async function loadGlobalScheduleMatches(
  client: ApolloClient,
  tournamentId: string,
  filter?: MatchFilterInput,
): Promise<ScheduleMatchLoadResult> {
  let totalCount = 0;
  const { nodes, stoppedReason } = await fetchAllConnectionPages<TournamentMatch>(
    {
      getExpectedTotal: () => (totalCount > 0 ? totalCount : undefined),
      getMaxPages: () =>
        totalCount > 0 ? Math.ceil(totalCount / CURSOR_PAGE_MAX) + 2 : 500,
      fetchPage: async (after) => {
        const page = await fetchScheduleMatchesConnectionPage(client, {
          tournamentId,
          filter,
          after,
        });
        totalCount = page.totalCount || totalCount;
        return {
          edges: page.edges,
          pageInfo: page.pageInfo,
        };
      },
    },
  );

  const deduped = dedupeTournamentMatchesById(nodes);
  const expected = totalCount || deduped.length;
  const complete =
    stoppedReason === 'complete' &&
    (expected === 0 || deduped.length >= expected);

  return {
    matches: deduped,
    expectedTotal: expected,
    loadedTotal: deduped.length,
    isComplete: complete,
    perCategoryTotals: {},
  };
}

export async function loadScheduleMatchesForHook(
  client: ApolloClient,
  args: {
    tournamentId: string;
    filter?: MatchFilterInput;
    categoryIds: string[];
    isStale: () => boolean;
  },
): Promise<ScheduleMatchLoadResult> {
  const { tournamentId, filter, categoryIds, isStale } = args;

  return loadTournamentScheduleMatchesComplete({
    categoryIds,
    fetchCategoryPage: async (categoryId, after) => {
      if (isStale()) {
        return {
          edges: [],
          pageInfo: { hasNextPage: false },
          totalCount: 0,
        };
      }

      return fetchScheduleMatchesConnectionPage(client, {
        tournamentId,
        filter: {
          ...(filter ?? {}),
          categoryId,
        },
        after,
      });
    },
    globalFallback: () => loadGlobalScheduleMatches(client, tournamentId, filter),
  });
}
