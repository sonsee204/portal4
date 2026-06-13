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
import { useApolloClient, useQuery } from '@apollo/client/react';
import { GET_TOURNAMENT_MATCHES } from '@/graphql/queries/tournament';
import type {
  MatchFilterInput,
  MatchList,
  TournamentMatch,
} from '@/graphql/generated';

const SCHEDULE_MATCHES_PAGE_SIZE = 500;

interface UseTournamentScheduleMatchesOptions {
  tournamentId: string;
  skip?: boolean;
  filter?: MatchFilterInput;
}

export function useTournamentScheduleMatches(
  options: UseTournamentScheduleMatchesOptions,
) {
  const { tournamentId, skip = false, filter } = options;
  const client = useApolloClient();
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [initialLoading, setInitialLoading] = useState(!skip && !!tournamentId);
  const [error, setError] = useState<Error | undefined>();

  const hasLoadedRef = useRef(false);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);

  const { subscribeToMore } = useQuery<{ tournamentMatches: MatchList }>(
    GET_TOURNAMENT_MATCHES,
    {
      variables: {
        tournamentId,
        pagination: { page: 1, limit: 1 },
      },
      skip: skip || !tournamentId,
      fetchPolicy: 'cache-only',
    },
  );

  const loadAll = useCallback(async () => {
    if (skip || !tournamentId || !mountedRef.current) return;
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    if (!hasLoadedRef.current) setInitialLoading(true);

    try {
      const all: TournamentMatch[] = [];
      let page = 1;
      let hasNextPage = true;
      let totalCount = 0;

      while (hasNextPage) {
        const { data } = await client.query<{ tournamentMatches: MatchList }>({
          query: GET_TOURNAMENT_MATCHES,
          variables: {
            tournamentId,
            filter: filter ?? undefined,
            pagination: { page, limit: SCHEDULE_MATCHES_PAGE_SIZE },
          },
          fetchPolicy: 'network-only',
        });
        const result = data?.tournamentMatches;
        if (!result) break;
        all.push(...result.matches);
        totalCount = result.total;
        hasNextPage = result.hasNextPage;
        page += 1;
      }

      if (!mountedRef.current) return;
      setMatches(all);
      setTotal(totalCount);
      hasLoadedRef.current = true;
    } catch (err) {
      if (!mountedRef.current) return;
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      inFlightRef.current = false;
      if (mountedRef.current) setInitialLoading(false);
    }
  }, [client, tournamentId, skip, filter]);

  const refetch = useCallback(() => {
    void loadAll();
  }, [loadAll]);

  useEffect(() => {
    mountedRef.current = true;
    if (skip || !tournamentId) {
      setMatches([]);
      setTotal(0);
      setInitialLoading(false);
      return;
    }
    hasLoadedRef.current = false;
    void loadAll();
    return () => {
      mountedRef.current = false;
    };
  }, [tournamentId, skip, loadAll]);

  return {
    matches,
    total,
    loading: initialLoading,
    error,
    refetch,
    subscribeToMore,
  };
}
