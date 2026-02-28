'use client';

import { useQuery } from '@apollo/client/react';
import { GET_MY_TOURNAMENTS } from '@/graphql/queries/tournament';
import type {
  TournamentList,
  TournamentFilterInput,
  PaginationInput,
} from '@/graphql/generated';

interface UseMyTournamentsOptions {
  filter?: TournamentFilterInput;
  pagination?: PaginationInput;
  skip?: boolean;
}

export function useMyTournaments(options: UseMyTournamentsOptions = {}) {
  const { filter, pagination, skip } = options;

  const { data, loading, error, refetch } = useQuery<{
    myTournaments: TournamentList;
  }>(GET_MY_TOURNAMENTS, {
    variables: { filter, pagination },
    fetchPolicy: 'cache-and-network',
    skip,
  });

  const result = data?.myTournaments;

  return {
    tournaments: result?.tournaments ?? [],
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    hasNextPage: result?.hasNextPage ?? false,
    hasPrevPage: result?.hasPrevPage ?? false,
    loading,
    error,
    refetch,
  };
}
