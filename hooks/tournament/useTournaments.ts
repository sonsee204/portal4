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
import { GET_MY_TOURNAMENTS } from '@/graphql/tournament/queries';
import type {
  GetMyTournamentsQuery,
  GetMyTournamentsQueryVariables,
  TournamentFilterInput,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  totalPagesFromCount,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

interface UseMyTournamentsOptions {
  filter?: TournamentFilterInput;
  pagination?: LegacyPagePagination;
  skip?: boolean;
}

export function useMyTournaments(options: UseMyTournamentsOptions = {}) {
  const { filter, pagination, skip } = options;
  const first = resolveConnectionFirst(pagination);

  const { data, loading, error, refetch, fetchMore, subscribeToMore } = useQuery<
    GetMyTournamentsQuery,
    GetMyTournamentsQueryVariables
  >(GET_MY_TOURNAMENTS, {
    variables: {
      filter,
      pagination: { first, after: pagination?.after ?? null },
    },
    fetchPolicy: 'cache-and-network',
    skip,
  });

  const connection = data?.myTournamentsConnection;
  const tournaments = connectionNodes(connection?.edges);
  const pageInfo = connection?.pageInfo;
  const total = connection?.totalCount ?? 0;

  const { loadMore, isLoadingMore } = useConnectionLoadMore({
    data,
    hasNextPage: pageInfo?.hasNextPage ?? false,
    endCursor: pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      filter,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...prev,
      myTournamentsConnection: {
        ...next.myTournamentsConnection!,
        edges: mergeConnectionEdges(
          prev.myTournamentsConnection?.edges ?? [],
          next.myTournamentsConnection?.edges ?? [],
        ),
      },
    }),
  });

  const page = pagination?.page ?? 1;

  return {
    tournaments,
    total,
    page,
    totalPages: totalPagesFromCount(total, first),
    hasNextPage: pageInfo?.hasNextPage ?? false,
    hasPrevPage: pageInfo?.hasPreviousPage ?? false,
    loading,
    error,
    refetch,
    subscribeToMore,
    loadMore,
    isLoadingMore,
  };
}
