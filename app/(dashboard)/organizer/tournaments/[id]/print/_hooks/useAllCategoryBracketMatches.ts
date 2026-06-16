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

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useApolloClient } from '@apollo/client/react';
import { GET_TOURNAMENT_BRACKET } from '@/graphql/tournament/queries';
import type {
  GetTournamentBracketQuery,
  GetTournamentBracketQueryVariables,
  TournamentMatch,
} from '@/graphql/generated';

/**
 * Fetches the COMPLETE match list (all rounds) for a set of categories by
 * calling `tournamentBracket(categoryId)` for each in parallel.
 *
 * This replaces the paginated `tournamentMatchesConnection` approach, which
 * only returns the first ~50-100 matches (sorted by round) and misses later
 * rounds for large tournaments.
 */
export function useAllCategoryBracketMatches(
  categoryIds: string[],
  skip = false,
): { matches: TournamentMatch[]; loading: boolean } {
  const client = useApolloClient();
  const [matches, setMatches] = useState<TournamentMatch[]>([]);
  const [loading, setLoading] = useState(!skip && categoryIds.length > 0);

  const idsKey = useMemo(() => JSON.stringify(categoryIds), [categoryIds]);
  const mountedRef = useRef(true);
  const epochRef = useRef(0);

  const fetchAll = useCallback(
    async (ids: string[]) => {
      if (skip || ids.length === 0) {
        setMatches([]);
        setLoading(false);
        return;
      }

      const epoch = epochRef.current;
      setLoading(true);

      try {
        const results = await Promise.all(
          ids.map((categoryId) =>
            client.query<
              GetTournamentBracketQuery,
              GetTournamentBracketQueryVariables
            >({
              query: GET_TOURNAMENT_BRACKET,
              variables: { categoryId },
              fetchPolicy: 'cache-first',
            }),
          ),
        );

        if (!mountedRef.current || epochRef.current !== epoch) return;

        const combined = results.flatMap(
          (r) => r.data?.tournamentBracket ?? [],
        );
        setMatches(combined);
      } catch {
        if (mountedRef.current && epochRef.current === epoch) {
          setMatches([]);
        }
      } finally {
        if (mountedRef.current && epochRef.current === epoch) {
          setLoading(false);
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- idsKey drives re-fetch
    [client, skip, idsKey],
  );

  useEffect(() => {
    mountedRef.current = true;
    epochRef.current += 1;

    // Parse the stable key back so we don't list categoryIds in deps directly
    const ids: string[] = JSON.parse(idsKey) as string[];
    void fetchAll(ids);

    return () => {
      mountedRef.current = false;
    };
  }, [idsKey, skip, fetchAll]);

  return { matches, loading };
}
