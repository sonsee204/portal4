'use client';

import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import {
  PUBLISH_TOURNAMENT,
  OPEN_REGISTRATION,
  CLOSE_REGISTRATION,
  START_TOURNAMENT,
  COMPLETE_TOURNAMENT,
  CANCEL_TOURNAMENT,
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
