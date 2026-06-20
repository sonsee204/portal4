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

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client/react';
import { GET_TOURNAMENT_BRACKET } from '@/graphql/tournament/queries';
import { GENERATE_MANUAL_DRAW } from '@/graphql/tournament/mutations/manual-draw';
import { PREVIEW_MANUAL_KNOCKOUT_DRAW } from '@/graphql/tournament/queries/manual-draw-preview';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { TOURNAMENT } from '@/lib/strings';
import type {
  ManualKnockoutDrawPreview,
  PreviewManualKnockoutDrawInput,
  TournamentMatch,
} from '@/graphql/generated';
import type { ManualBracketSlotInput } from '@/graphql/generated';

const PREVIEW_DEBOUNCE_MS = 300;

export function usePreviewManualKnockoutDraw() {
  const [fetchPreview, { loading, data, error }] = useLazyQuery<{
    previewManualKnockoutDraw: ManualKnockoutDrawPreview;
  }>(PREVIEW_MANUAL_KNOCKOUT_DRAW, {
    fetchPolicy: 'network-only',
  });

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastInputRef = useRef<string>('');

  const preview = data?.previewManualKnockoutDraw ?? null;

  const requestPreview = useCallback(
    (input: PreviewManualKnockoutDrawInput) => {
      const key = JSON.stringify(input);
      if (key === lastInputRef.current && preview) return;
      lastInputRef.current = key;

      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        void fetchPreview({ variables: { input } });
      }, PREVIEW_DEBOUNCE_MS);
    },
    [fetchPreview, preview],
  );

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  return {
    preview,
    previewLoading: loading,
    previewError: error,
    requestPreview,
    flushPreview: useCallback(
      async (input: PreviewManualKnockoutDrawInput) => {
        if (timerRef.current) clearTimeout(timerRef.current);
        lastInputRef.current = JSON.stringify(input);
        await fetchPreview({ variables: { input } });
      },
      [fetchPreview],
    ),
  };
}

export function useGenerateManualDraw(options?: { onSuccess?: () => void }) {
  const [mutation, { loading }] = useMutation<{
    generateManualDraw: TournamentMatch[];
  }>(GENERATE_MANUAL_DRAW, {
    ...createMutationOptions(
      'GenerateManualDraw',
      TOURNAMENT.SUCCESS_MANUAL_DRAW,
    ),
    update(cache, { data }, { variables }) {
      const matches = data?.generateManualDraw;
      const categoryId = variables?.input.categoryId;
      if (!matches || !categoryId) return;
      cache.writeQuery({
        query: GET_TOURNAMENT_BRACKET,
        variables: { categoryId },
        data: { tournamentBracket: matches },
      });
    },
    onCompleted: () => options?.onSuccess?.(),
  });

  const generateManualDraw = useCallback(
    (categoryId: string, knockoutSlots: ManualBracketSlotInput[]) =>
      mutation({ variables: { input: { categoryId, knockoutSlots } } }),
    [mutation],
  );

  return useMemo(
    () => ({ generateManualDraw, loading }),
    [generateManualDraw, loading],
  );
}
