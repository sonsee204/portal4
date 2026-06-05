'use client';

import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { UPDATE_TOURNAMENT } from '@/graphql/mutations/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type { Tournament, UpdateTournamentInput } from '@/graphql/generated';

export function useUpdateTournament(options?: {
  onSuccess?: () => void;
  successMessage?: string;
}) {
  const [mutation, { loading }] = useMutation<{
    updateTournament: Tournament;
  }>(UPDATE_TOURNAMENT, {
    ...createMutationOptions(
      'UpdateTournament',
      options?.successMessage ?? TOURNAMENT.SUCCESS_UPDATE,
    ),
    onCompleted: () => {
      options?.onSuccess?.();
    },
  });

  const updateTournament = useCallback(
    (input: UpdateTournamentInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { updateTournament, loading };
}
