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
import { PREVIEW_LATE_ENTRY_PLACEMENT } from '@/graphql/tournament/queries';
import { ADD_LATE_ENTRY_TO_BYE_SLOT } from '@/graphql/tournament/mutations/registration';
import {
  GET_TOURNAMENT_REGISTRATIONS,
  GET_TOURNAMENT_CATEGORIES,
} from '@/graphql/tournament/queries';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import { showSuccess, showError, showInfo } from '@/lib/toast';
import { TOURNAMENT } from '@/lib/strings';
import {
  LateEntryAction,
  type AddLateEntryResult,
  type AddLateEntryToByeSlotInput,
  type LateEntryPlacementPreview,
} from '@/graphql/generated';

export function usePreviewLateEntryPlacement(categoryId: string | null) {
  const { data, loading, error, refetch } = useQuery<{
    previewLateEntryPlacement: LateEntryPlacementPreview;
  }>(PREVIEW_LATE_ENTRY_PLACEMENT, {
    variables: { categoryId: categoryId ?? '' },
    skip: !categoryId,
    fetchPolicy: 'network-only',
  });

  return {
    preview: data?.previewLateEntryPlacement ?? null,
    loading,
    error,
    refetch,
  };
}

interface UseAddLateEntryOptions {
  tournamentId: string;
  onSuccess?: () => void;
}

export function useAddLateEntryToByeSlot({
  tournamentId,
  onSuccess,
}: UseAddLateEntryOptions) {
  const [mutation, { loading }] = useMutation<{
    addLateEntryToByeSlot: AddLateEntryResult;
  }>(ADD_LATE_ENTRY_TO_BYE_SLOT, {
    refetchQueries: [
      { query: GET_TOURNAMENT_REGISTRATIONS, variables: { tournamentId } },
      { query: GET_TOURNAMENT_CATEGORIES, variables: { tournamentId } },
    ],
  });

  const addLateEntry = useCallback(
    async (input: AddLateEntryToByeSlotInput) => {
      try {
        const res = await mutation({ variables: { input } });
        const result = res.data?.addLateEntryToByeSlot;
        if (!result) return null;

        if (result.action === LateEntryAction.FilledBye) {
          showSuccess(TOURNAMENT.LATE_ENTRY_SUCCESS(result.opponentName ?? ''));
          onSuccess?.();
        } else if (result.action === LateEntryAction.NoByeSlot) {
          showInfo(result.message);
        } else if (result.action === LateEntryAction.Blocked) {
          showError(result.message);
        }

        return result;
      } catch (err) {
        showError(formatMutationError(err));
        return null;
      }
    },
    [mutation, onSuccess],
  );

  return { addLateEntry, loading };
}
