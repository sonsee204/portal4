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
import { CREATE_TOURNAMENT } from '@/graphql/mutations/tournament';
import { GET_MY_TOURNAMENTS } from '@/graphql/queries/tournament';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type { Tournament, CreateTournamentInput } from '@/graphql/generated';

export function useCreateTournament(options?: { onSuccess?: (tournament: Tournament) => void }) {
  const [mutation, { loading }] = useMutation<{
    createTournament: Tournament;
  }>(CREATE_TOURNAMENT, {
    refetchQueries: [{ query: GET_MY_TOURNAMENTS }],
    ...createMutationOptions('CreateTournament', TOURNAMENT.SUCCESS_CREATE),
    onCompleted: (data) => {
      options?.onSuccess?.(data.createTournament);
    },
  });

  const createTournament = useCallback(
    (input: CreateTournamentInput) => mutation({ variables: { input } }),
    [mutation],
  );

  return { createTournament, loading };
}
