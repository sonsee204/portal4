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
import { useMutation } from '@apollo/client/react';
import {
  ORGANIZER_CORRECT_LIVE_SCORE,
  ORGANIZER_ABORT_LIVE_MATCH,
  SET_MATCH_WALKOVER,
  CORRECT_FINISHED_MATCH_RESULT,
  UPDATE_MATCH_RESULT,
} from '@/graphql/mutations/tournament';
import {
  createMutationOptions,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  MatchScorecard,
  TournamentMatch,
  OrganizerCorrectLiveScoreInput,
  OrganizerAbortLiveMatchInput,
  SetMatchWalkoverInput,
  CorrectFinishedMatchResultInput,
  ManualMatchResultInput,
} from '@/graphql/generated';

export function useOrganizerCorrectLiveScore(options?: {
  onSuccess?: () => void;
}) {
  const [mutation, { loading }] = useMutation<{
    organizerCorrectLiveScore: MatchScorecard;
  }>(ORGANIZER_CORRECT_LIVE_SCORE, {
    ...createMutationOptions(
      'OrganizerCorrectLiveScore',
      'Đã cập nhật tỉ số trận đấu',
    ),
    ...strictMutationErrorPolicy,
    onCompleted: () => options?.onSuccess?.(),
  });

  return {
    correctLiveScore: useCallback(
      (input: OrganizerCorrectLiveScoreInput) =>
        mutation({ variables: { input } }),
      [mutation],
    ),
    loading,
  };
}

export function useOrganizerAbortLiveMatch(options?: {
  onSuccess?: () => void;
}) {
  const [mutation, { loading }] = useMutation<{
    organizerAbortLiveMatch: TournamentMatch;
  }>(ORGANIZER_ABORT_LIVE_MATCH, {
    ...createMutationOptions(
      'OrganizerAbortLiveMatch',
      'Đã huỷ trận đang đấu',
    ),
    ...strictMutationErrorPolicy,
    onCompleted: () => options?.onSuccess?.(),
  });

  return {
    abortLiveMatch: useCallback(
      (input: OrganizerAbortLiveMatchInput) =>
        mutation({ variables: { input } }),
      [mutation],
    ),
    loading,
  };
}

export function useSetMatchWalkover(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    setMatchWalkover: TournamentMatch;
  }>(SET_MATCH_WALKOVER, {
    ...createMutationOptions('SetMatchWalkover', 'Đã ghi nhận walkover'),
    ...strictMutationErrorPolicy,
    onCompleted: () => options?.onSuccess?.(),
  });

  return {
    setWalkover: useCallback(
      (input: SetMatchWalkoverInput) => mutation({ variables: { input } }),
      [mutation],
    ),
    loading,
  };
}

export function useCorrectFinishedMatchResult(options?: {
  onSuccess?: () => void;
}) {
  const [mutation, { loading }] = useMutation<{
    correctFinishedMatchResult: TournamentMatch;
  }>(CORRECT_FINISHED_MATCH_RESULT, {
    ...createMutationOptions(
      'CorrectFinishedMatchResult',
      'Đã cập nhật kết quả trận',
    ),
    ...strictMutationErrorPolicy,
    onCompleted: () => options?.onSuccess?.(),
  });

  return {
    correctFinishedResult: useCallback(
      (input: CorrectFinishedMatchResultInput) =>
        mutation({ variables: { input } }),
      [mutation],
    ),
    loading,
  };
}

export function useUpdateMatchResult(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    updateMatchResult: MatchScorecard;
  }>(UPDATE_MATCH_RESULT, {
    ...createMutationOptions(
      'UpdateMatchResult',
      TOURNAMENT.SUCCESS_UPDATE_RESULT,
    ),
    ...strictMutationErrorPolicy,
    onCompleted: () => options?.onSuccess?.(),
  });

  return {
    updateResult: useCallback(
      (input: ManualMatchResultInput) => mutation({ variables: { input } }),
      [mutation],
    ),
    loading,
  };
}
