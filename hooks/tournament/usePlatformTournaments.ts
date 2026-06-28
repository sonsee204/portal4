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
import { GET_PLATFORM_TOURNAMENTS } from '@/graphql/tournament/queries';
import type {
  GetPlatformTournamentsQuery,
  GetPlatformTournamentsQueryVariables,
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

interface UsePlatformTournamentsOptions {
  filter?: TournamentFilterInput;
  pagination?: LegacyPagePagination;
  skip?: boolean;
}

export function usePlatformTournaments(options: UsePlatformTournamentsOptions = {}) {
  const { filter, pagination, skip } = options;
  const first = resolveConnectionFirst(pagination);

  const { data, loading, error, refetch, fetchMore, subscribeToMore } = useQuery<
    GetPlatformTournamentsQuery,
    GetPlatformTournamentsQueryVariables
  >(GET_PLATFORM_TOURNAMENTS, {
    variables: {
      filter,
      pagination: { first, after: pagination?.after ?? null },
    },
    fetchPolicy: 'cache-and-network',
    skip,
  });

  const connection = data?.platformTournamentsConnection;
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
      platformTournamentsConnection: {
        ...next.platformTournamentsConnection!,
        edges: mergeConnectionEdges(
          prev.platformTournamentsConnection?.edges ?? [],
          next.platformTournamentsConnection?.edges ?? [],
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
