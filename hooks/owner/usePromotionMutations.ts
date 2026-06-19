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
  ACTIVATE_PROMOTION,
  CANCEL_PROMOTION,
  CREATE_PROMOTION,
  DELETE_PROMOTION,
  PAUSE_PROMOTION,
  REVIEW_PROMOTION,
  SUBMIT_PROMOTION_FOR_APPROVAL,
  UPDATE_PROMOTION,
} from '@/graphql/owner/promotions';
import type {
  ActivatePromotionMutation,
  ActivatePromotionMutationVariables,
  CancelPromotionMutation,
  CancelPromotionMutationVariables,
  CreatePromotionMutation,
  CreatePromotionMutationVariables,
  DeletePromotionMutation,
  DeletePromotionMutationVariables,
  PausePromotionMutation,
  PausePromotionMutationVariables,
  ReviewPromotionMutation,
  ReviewPromotionMutationVariables,
  SubmitPromotionForApprovalMutation,
  SubmitPromotionForApprovalMutationVariables,
  UpdatePromotionMutation,
  UpdatePromotionMutationVariables,
  CreatePromotionInput,
  ReviewPromotionInput,
  UpdatePromotionInput,
} from '@/graphql/generated';
import {
  createMutationOptions,
  formatMutationError,
  strictMutationErrorPolicy,
} from '@/hooks/shared/mutation-helpers';
import { showSuccess } from '@/lib/toast';

const PROMOTION_REFETCH = [
  'VenuePromotionsConnection',
  'GetPromotionStats',
  'GetPromotion',
];

export function usePromotionMutations() {
  const [createMutate, { loading: creating }] = useMutation<
    CreatePromotionMutation,
    CreatePromotionMutationVariables
  >(CREATE_PROMOTION, createMutationOptions('Create promotion'));
  const [updateMutate, { loading: updating }] = useMutation<
    UpdatePromotionMutation,
    UpdatePromotionMutationVariables
  >(UPDATE_PROMOTION, createMutationOptions('Update promotion'));
  const [submitMutate, { loading: submitting }] = useMutation<
    SubmitPromotionForApprovalMutation,
    SubmitPromotionForApprovalMutationVariables
  >(SUBMIT_PROMOTION_FOR_APPROVAL, createMutationOptions('Submit promotion'));
  const [reviewMutate, { loading: reviewing }] = useMutation<
    ReviewPromotionMutation,
    ReviewPromotionMutationVariables
  >(REVIEW_PROMOTION, createMutationOptions('Review promotion'));
  const [activateMutate, { loading: activating }] = useMutation<
    ActivatePromotionMutation,
    ActivatePromotionMutationVariables
  >(ACTIVATE_PROMOTION, createMutationOptions('Activate promotion'));
  const [pauseMutate, { loading: pausing }] = useMutation<
    PausePromotionMutation,
    PausePromotionMutationVariables
  >(PAUSE_PROMOTION, createMutationOptions('Pause promotion'));
  const [cancelMutate, { loading: cancelling }] = useMutation<
    CancelPromotionMutation,
    CancelPromotionMutationVariables
  >(CANCEL_PROMOTION, createMutationOptions('Cancel promotion'));
  const [deleteMutate, { loading: deleting }] = useMutation<
    DeletePromotionMutation,
    DeletePromotionMutationVariables
  >(DELETE_PROMOTION, createMutationOptions('Delete promotion'));

  const createPromotion = useCallback(
    async (input: CreatePromotionInput) => {
      try {
        const result = await createMutate({
          variables: { input },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        if (!result.data?.createPromotion) {
          return { success: false as const, error: 'Không nhận được dữ liệu từ server' };
        }
        return { success: true as const, promotion: result.data.createPromotion };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [createMutate],
  );

  const updatePromotion = useCallback(
    async (input: UpdatePromotionInput) => {
      try {
        const result = await updateMutate({
          variables: { input },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        if (!result.data?.updatePromotion) {
          return { success: false as const, error: 'Không nhận được dữ liệu từ server' };
        }
        return { success: true as const, promotion: result.data.updatePromotion };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [updateMutate],
  );

  const submitForApproval = useCallback(
    async (promotionId: string) => {
      try {
        await submitMutate({
          variables: { promotionId },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        showSuccess('Đã gửi khuyến mãi để duyệt');
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [submitMutate],
  );

  const reviewPromotion = useCallback(
    async (input: ReviewPromotionInput) => {
      try {
        await reviewMutate({
          variables: { input },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [reviewMutate],
  );

  const activatePromotion = useCallback(
    async (promotionId: string) => {
      try {
        await activateMutate({
          variables: { promotionId },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [activateMutate],
  );

  const pausePromotion = useCallback(
    async (promotionId: string) => {
      try {
        await pauseMutate({
          variables: { promotionId },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [pauseMutate],
  );

  const cancelPromotion = useCallback(
    async (promotionId: string) => {
      try {
        await cancelMutate({
          variables: { promotionId },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [cancelMutate],
  );

  const deletePromotion = useCallback(
    async (promotionId: string) => {
      try {
        await deleteMutate({
          variables: { promotionId },
          refetchQueries: PROMOTION_REFETCH,
          awaitRefetchQueries: true,
          ...strictMutationErrorPolicy,
        });
        return { success: true as const };
      } catch (error) {
        return { success: false as const, error: formatMutationError(error) };
      }
    },
    [deleteMutate],
  );

  return {
    createPromotion,
    updatePromotion,
    submitForApproval,
    reviewPromotion,
    activatePromotion,
    pausePromotion,
    cancelPromotion,
    deletePromotion,
    creating,
    updating,
    submitting,
    reviewing,
    activating,
    pausing,
    cancelling,
    deleting,
    isMutating:
      creating ||
      updating ||
      submitting ||
      reviewing ||
      activating ||
      pausing ||
      cancelling ||
      deleting,
  };
}
