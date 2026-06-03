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

import { useCallback } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_TOURNAMENT_BRACKET } from '@/graphql/queries/tournament';
import { GENERATE_BRACKET, RESET_BRACKET, SEED_PLAYERS } from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { createMatchSubscription } from '@/lib/utils/subscription';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentMatch, SeedPlayerInput } from '@/graphql/generated';

export function useTournamentBracket(categoryId: string, skip = false) {
  const { data, loading, error, refetch, subscribeToMore } = useQuery<{
    tournamentBracket: TournamentMatch[];
  }>(GET_TOURNAMENT_BRACKET, {
    variables: { categoryId },
    fetchPolicy: 'cache-and-network',
    skip: skip || !categoryId,
  });

  const subscribeToMatchUpdates = useCallback(
    (tournamentId: string) =>
      createMatchSubscription(subscribeToMore, refetch, tournamentId),
    [subscribeToMore, refetch],
  );

  return {
    matches: data?.tournamentBracket ?? [],
    loading,
    error,
    refetch,
    subscribeToMatchUpdates,
  };
}

export function useGenerateBracket(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    generateBracket: TournamentMatch[];
  }>(GENERATE_BRACKET, {
    ...createMutationOptions('GenerateBracket', TOURNAMENT.SUCCESS_GENERATE_BRACKET),
    onCompleted: () => options?.onSuccess?.(),
  });

  const generateBracket = useCallback(
    (categoryId: string) => mutation({ variables: { input: { categoryId } } }),
    [mutation],
  );

  return { generateBracket, loading };
}

export function useResetBracket(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation(RESET_BRACKET, {
    ...createMutationOptions('ResetBracket', TOURNAMENT.SUCCESS_RESET_BRACKET),
    onCompleted: () => options?.onSuccess?.(),
  });

  const resetBracket = useCallback(
    (categoryId: string) => mutation({ variables: { categoryId } }),
    [mutation],
  );

  return { resetBracket, loading };
}

export function useSeedPlayers(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation(SEED_PLAYERS, {
    ...createMutationOptions('SeedPlayers', TOURNAMENT.SUCCESS_SEED_PLAYERS),
    onCompleted: () => options?.onSuccess?.(),
  });

  const seedPlayers = useCallback(
    (categoryId: string, seeds: SeedPlayerInput[]) =>
      mutation({ variables: { input: { categoryId, seeds } } }),
    [mutation],
  );

  return { seedPlayers, loading };
}
