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
