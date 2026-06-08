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
