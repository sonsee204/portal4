'use client';

import { useQuery } from '@apollo/client/react';
import { useTournamentCategories } from '@/hooks/tournament';
import type { GetTournamentRankingsQuery, GetTournamentRankingsQueryVariables } from '@/graphql/generated';
import { GET_TOURNAMENT_RANKINGS } from '@/graphql/tournament/queries';

export function useLeaderboardData(tournamentId: string) {
    console.log('[Leaderboard] tournamentId:', tournamentId);
  const { categories, loading: categoriesLoading } = useTournamentCategories(tournamentId);
  console.log('[Leaderboard] categories:', categories);
  const firstCategoryId = categories?.[0]?._id ?? '';

  const { data, loading, error } = useQuery<GetTournamentRankingsQuery, GetTournamentRankingsQueryVariables>(
    GET_TOURNAMENT_RANKINGS,
    {
      variables: { categoryId: firstCategoryId },
      skip: !firstCategoryId,
    },
  );

  return {
    categories,
    rankings: data?.tournamentRankings ?? [],
    loading: categoriesLoading || loading,
    error,
  };
}