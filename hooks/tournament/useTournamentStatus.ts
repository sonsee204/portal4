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
import { GET_MY_TOURNAMENTS } from '@/graphql/queries/tournament';
import {
  PUBLISH_TOURNAMENT,
  OPEN_REGISTRATION,
  CLOSE_REGISTRATION,
  START_TOURNAMENT,
  COMPLETE_TOURNAMENT,
  CANCEL_TOURNAMENT,
  DELETE_TOURNAMENT,
  DUPLICATE_TOURNAMENT,
} from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type { Tournament } from '@/graphql/generated';

function useStatusMutation(
  document: ReturnType<typeof import('graphql-tag').gql>,
  operationName: string,
  successMessage: string,
  onSuccess?: () => void,
) {
  const [mutation, { loading }] = useMutation<Record<string, Tournament>>(document, {
    ...createMutationOptions(operationName, successMessage),
    onCompleted: () => onSuccess?.(),
  });

  const execute = useCallback(
    (id: string) => mutation({ variables: { id } }),
    [mutation],
  );

  return { execute, loading };
}

export function usePublishTournament(onSuccess?: () => void) {
  return useStatusMutation(PUBLISH_TOURNAMENT, 'PublishTournament', TOURNAMENT.SUCCESS_PUBLISH, onSuccess);
}

export function useOpenRegistration(onSuccess?: () => void) {
  return useStatusMutation(OPEN_REGISTRATION, 'OpenRegistration', TOURNAMENT.SUCCESS_OPEN_REG, onSuccess);
}

export function useCloseRegistration(onSuccess?: () => void) {
  return useStatusMutation(CLOSE_REGISTRATION, 'CloseRegistration', TOURNAMENT.SUCCESS_CLOSE_REG, onSuccess);
}

export function useStartTournament(onSuccess?: () => void) {
  return useStatusMutation(START_TOURNAMENT, 'StartTournament', TOURNAMENT.SUCCESS_START, onSuccess);
}

export function useCompleteTournament(onSuccess?: () => void) {
  return useStatusMutation(COMPLETE_TOURNAMENT, 'CompleteTournament', TOURNAMENT.SUCCESS_COMPLETE, onSuccess);
}

export function useCancelTournament(onSuccess?: () => void) {
  return useStatusMutation(CANCEL_TOURNAMENT, 'CancelTournament', TOURNAMENT.SUCCESS_CANCEL, onSuccess);
}

export function useDuplicateTournament(
  onSuccess?: (tournament: Tournament) => void,
) {
  const [mutation, { loading }] = useMutation<{
    duplicateTournament: Tournament;
  }>(DUPLICATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_MY_TOURNAMENTS }],
    ...createMutationOptions('DuplicateTournament', TOURNAMENT.SUCCESS_DUPLICATE),
    onCompleted: (data) => {
      onSuccess?.(data.duplicateTournament);
    },
  });

  const execute = useCallback(
    (id: string) => mutation({ variables: { id } }),
    [mutation],
  );

  return { execute, loading };
}

export function useDeleteTournament(onSuccess?: () => void) {
  const [mutation, { loading }] = useMutation<{ deleteTournament: { success: boolean } }>(
    DELETE_TOURNAMENT,
    {
      ...createMutationOptions('DeleteTournament', TOURNAMENT.SUCCESS_DELETE),
      // Evict the deleted tournament from cache immediately so the list
      // updates without requiring a network refetch or full page reload.
      update(cache, _result, { variables }) {
        const id = variables?.id as string | undefined;
        if (!id) return;
        cache.evict({ id: cache.identify({ __typename: 'Tournament', _id: id }) });
        cache.gc();
      },
      onCompleted: () => onSuccess?.(),
    },
  );

  const execute = useCallback(
    (id: string) => mutation({ variables: { id } }),
    [mutation],
  );

  return { execute, loading };
}
