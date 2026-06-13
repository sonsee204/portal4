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

  const { data, loading, error, refetch, subscribeToMore } = useQuery<{
    myTournaments: TournamentList;
  }>(GET_MY_TOURNAMENTS, {
    variables: { filter, pagination },
    fetchPolicy: 'cache-and-network',
    skip,
  });

  const result = data?.myTournaments;
  const tournaments = result?.tournaments ?? [];

  return {
    tournaments,
    total: result?.total ?? 0,
    page: result?.page ?? 1,
    totalPages: result?.totalPages ?? 1,
    hasNextPage: result?.hasNextPage ?? false,
    hasPrevPage: result?.hasPrevPage ?? false,
    loading,
    error,
    refetch,
    subscribeToMore,
  };
}
