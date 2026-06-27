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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useApolloClient, useQuery } from '@apollo/client/react';
import { GET_TOURNAMENT_MATCHES } from '@/graphql/tournament/queries';
import type {
  GetTournamentMatchesQuery,
  MatchFilterInput,
  ScoreSummary,
  TournamentMatch,
} from '@/graphql/generated';
import { loadScheduleMatchesForHook } from './tournament-schedule-matches.client-load';

interface UseTournamentScheduleMatchesOptions {
  tournamentId: string;
  skip?: boolean;
  filter?: MatchFilterInput;
  categoryIds?: string[];
}

export function useTournamentScheduleMatches(
  options: UseTournamentScheduleMatchesOptions,
) {
  const { tournamentId, skip = false, filter, categoryIds } = options;
  const filterKey = useMemo(() => JSON.stringify(filter ?? null), [filter]);
  const stableFilter = useMemo(
    () => filter,
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable by serialized filter
    [filterKey],
  );
  const categoryIdsKey = useMemo(
    () => (categoryIds?.length ? categoryIds.join(',') : ''),
    [categoryIds],
  );
  const stableCategoryIds = useMemo(
    () => categoryIds ?? [],
    // eslint-disable-next-line react-hooks/exhaustive-deps -- stable by serialized ids
    [categoryIdsKey],
  );

  const client = useApolloClient();
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [total, setTotal] = useState(0);
  const [expectedTotal, setExpectedTotal] = useState(0);
  const [isComplete, setIsComplete] = useState(true);
  const [initialLoading, setInitialLoading] = useState(!skip && !!tournamentId);
  const [error, setError] = useState<Error | undefined>();

  const hasLoadedRef = useRef(false);
  const inFlightRef = useRef(false);
  const mountedRef = useRef(true);
  const requestEpochRef = useRef(0);

  const { subscribeToMore } = useQuery<GetTournamentMatchesQuery>(
    GET_TOURNAMENT_MATCHES,
    {
      variables: {
        tournamentId,
        filter: stableFilter ?? undefined,
        pagination: { first: 1, after: null },
      },
      skip: skip || !tournamentId,
      fetchPolicy: 'cache-only',
    },
  );

  const loadAll = useCallback(async () => {
    if (skip || !tournamentId || !mountedRef.current) return;

    const epochAtStart = requestEpochRef.current;
    if (inFlightRef.current) return;

    inFlightRef.current = true;
    if (!hasLoadedRef.current) setInitialLoading(true);

    try {
      const result = await loadScheduleMatchesForHook(client, {
        tournamentId,
        filter: stableFilter,
        categoryIds: stableCategoryIds,
        isStale: () =>
          !mountedRef.current || requestEpochRef.current !== epochAtStart,
      });

      if (
        !mountedRef.current ||
        requestEpochRef.current !== epochAtStart
      ) {
        return;
      }

      setMatches(result.matches);
      setTotal(result.expectedTotal || result.loadedTotal);
      setExpectedTotal(result.expectedTotal);
      setIsComplete(result.isComplete);
      hasLoadedRef.current = true;
    } catch (err) {
      if (
        !mountedRef.current ||
        requestEpochRef.current !== epochAtStart
      ) {
        return;
      }
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (
        mountedRef.current &&
        requestEpochRef.current === epochAtStart
      ) {
        inFlightRef.current = false;
        setInitialLoading(false);
      } else {
        inFlightRef.current = false;
      }
    }
  }, [client, tournamentId, skip, stableFilter, stableCategoryIds]);

  const refetch = useCallback(() => {
    hasLoadedRef.current = false;
    void loadAll();
  }, [loadAll]);

  const patchMatch = useCallback(
    (matchId: string, patch: Partial<TournamentMatch>) => {
      setMatches((prev) =>
        prev.map((m) => (m._id === matchId ? { ...m, ...patch } : m)),
      );
    },
    [],
  );

  const patchMatchScore = useCallback(
    (matchId: string, scoreSummary: ScoreSummary) => {
      patchMatch(matchId, { scoreSummary });
    },
    [patchMatch],
  );

  useEffect(() => {
    requestEpochRef.current += 1;
    mountedRef.current = true;

    if (skip || !tournamentId) {
      hasLoadedRef.current = false;
      inFlightRef.current = false;
      setMatches([]);
      setTotal(0);
      setExpectedTotal(0);
      setIsComplete(true);
      setInitialLoading(false);
      return;
    }

    hasLoadedRef.current = false;
    void loadAll();

    return () => {
      requestEpochRef.current += 1;
      mountedRef.current = false;
      inFlightRef.current = false;
    };
  }, [tournamentId, skip, filterKey, categoryIdsKey, loadAll]);

  return {
    matches,
    total,
    expectedTotal,
    loadedTotal: matches.length,
    isComplete,
    loading: initialLoading,
    error,
    refetch,
    patchMatch,
    patchMatchScore,
    subscribeToMore,
  };
}
