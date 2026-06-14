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
  useGenerateBracket,
  useResetBracket,
} from '@/hooks/tournament';
import { SEED_KNOCKOUT_BRACKET } from '@/graphql/mutations/tournament';
import { showError } from '@/lib/toast';
import type {
  SeedKnockoutBracketMutation,
  SeedKnockoutBracketMutationVariables,
} from '@/graphql/generated';
import type { DrawPageData } from './useDrawData';

export function useDrawActions(data: DrawPageData) {
  const {
    activeCategoryId,
    refetch,
    refetchCategories,
    setResetDialogOpen,
  } = data;

  const onSuccess = useCallback(() => {
    void refetch();
    void refetchCategories();
  }, [refetch, refetchCategories]);

  const { generateBracket, loading: generating } = useGenerateBracket({
    onSuccess,
  });
  const { resetBracket, loading: resetting } = useResetBracket({ onSuccess });

  const [seedKnockout, { loading: seeding }] = useMutation<
    SeedKnockoutBracketMutation,
    SeedKnockoutBracketMutationVariables
  >(SEED_KNOCKOUT_BRACKET, {
    onCompleted: () => {
      void refetch();
    },
    onError: (err) => showError(err.message),
  });

  const isLoading = generating || resetting;

  const handleReset = useCallback(() => {
    setResetDialogOpen(true);
  }, [setResetDialogOpen]);

  const handleConfirmReset = useCallback(() => {
    setResetDialogOpen(false);
    void resetBracket(activeCategoryId);
  }, [activeCategoryId, resetBracket, setResetDialogOpen]);

  const handleGenerateBracket = useCallback(() => {
    void generateBracket(activeCategoryId);
  }, [activeCategoryId, generateBracket]);

  const handleSeedKnockout = useCallback(() => {
    void seedKnockout({ variables: { categoryId: activeCategoryId } });
  }, [activeCategoryId, seedKnockout]);

  return {
    isLoading,
    generating,
    resetting,
    seeding,
    handleReset,
    handleConfirmReset,
    handleGenerateBracket,
    handleSeedKnockout,
  };
}

export type DrawPageActions = ReturnType<typeof useDrawActions>;
