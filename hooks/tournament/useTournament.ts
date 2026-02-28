'use client';

import { useQuery } from '@apollo/client/react';
import { GET_TOURNAMENT } from '@/graphql/queries/tournament';
import type { Tournament } from '@/graphql/generated';

export function useTournament(id: string, skip = false) {
  const { data, loading, error, refetch } = useQuery<{
    tournament: Tournament;
  }>(GET_TOURNAMENT, {
    variables: { id },
    fetchPolicy: 'cache-and-network',
    skip: skip || !id,
  });

  return {
    tournament: data?.tournament,
    loading,
    error,
    refetch,
  };
}
