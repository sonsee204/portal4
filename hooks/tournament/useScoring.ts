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
import { GET_MATCH_SCORECARD } from '@/graphql/tournament/queries';
import {
  START_MATCH,
  SCORE_POINT,
  UNDO_LAST_POINT,
  UPDATE_MATCH_RESULT,
} from '@/graphql/tournament/mutations/scoring';
import { MATCH_SCORE_UPDATED_SUB } from '@/graphql/tournament/subscriptions';
import { createSilentMutationOptions, createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  MatchScorecard,
  ScorePointInput,
  StartMatchInput,
  ManualMatchResultInput,
} from '@/graphql/generated';

export function useMatchScorecard(matchId: string, skip = false) {
  const { data, loading, error, refetch, subscribeToMore } = useQuery<{
    matchScorecard: MatchScorecard | null;
  }>(GET_MATCH_SCORECARD, {
    variables: { matchId },
    fetchPolicy: 'cache-and-network',
    skip: skip || !matchId,
  });

  const subscribeToScoreUpdates = () =>
    subscribeToMore<{ matchScoreUpdated: MatchScorecard }>({
      document: MATCH_SCORE_UPDATED_SUB,
      variables: { _matchId: matchId },
      updateQuery: (prev, { subscriptionData }) => {
        const incoming = subscriptionData.data?.matchScoreUpdated;
        if (!incoming) return prev as { matchScorecard: MatchScorecard | null };
        const existing = prev?.matchScorecard;
        if (existing?.updatedAt && incoming.updatedAt && existing.updatedAt >= incoming.updatedAt) {
          return prev as { matchScorecard: MatchScorecard | null };
        }
        return { matchScorecard: incoming } as { matchScorecard: MatchScorecard | null };
      },
    });

  return {
    scorecard: data?.matchScorecard ?? null,
    loading,
    error,
    refetch,
    subscribeToScoreUpdates,
  };
}

export function useScorePoint() {
  const [mutation, { loading }] = useMutation<{
    scorePoint: MatchScorecard;
  }>(SCORE_POINT, createSilentMutationOptions('ScorePoint'));

  const scorePoint = useCallback(
    (input: ScorePointInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { scorePoint, loading };
}

export function useUndoPoint() {
  const [mutation, { loading }] = useMutation<{
    undoLastPoint: MatchScorecard;
  }>(UNDO_LAST_POINT, createSilentMutationOptions('UndoLastPoint'));

  const undoPoint = useCallback(
    (matchId: string) => mutation({ variables: { matchId } }),
    [mutation],
  );

  return { undoPoint, loading };
}

export function useStartMatch() {
  const [mutation, { loading }] = useMutation<{
    startMatch: MatchScorecard;
  }>(START_MATCH, createSilentMutationOptions('StartMatch'));

  const startMatch = useCallback(
    (input: StartMatchInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { startMatch, loading };
}

export function useUpdateMatchResult(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    updateMatchResult: MatchScorecard;
  }>(UPDATE_MATCH_RESULT, {
    ...createMutationOptions('UpdateMatchResult', TOURNAMENT.SUCCESS_UPDATE_RESULT),
    onCompleted: () => options?.onSuccess?.(),
  });

  const updateResult = useCallback(
    (input: ManualMatchResultInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { updateResult, loading };
}
