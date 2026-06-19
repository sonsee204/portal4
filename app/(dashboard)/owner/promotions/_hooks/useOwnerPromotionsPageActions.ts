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

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePromotionMutations } from '@/hooks/owner';
import {
  getPromotionActionDialogCopy,
  getPromotionActionSuccessMessage,
  type PromotionWorkflowAction,
} from '@/lib/promotion/promotion-row-actions';
import { showError, showSuccess } from '@/lib/toast';
import type { PromotionStatusFilter } from './owner-promotions-page.constants';
import type { OwnerPromotionsPageData } from './useOwnerPromotionsPageData';

export interface PromotionActionDialogState {
  action: PromotionWorkflowAction;
  promotionId: string;
}

export function useOwnerPromotionsPageActions(data: OwnerPromotionsPageData) {
  const router = useRouter();
  const { setStatusFilter, loadMore, refetchAll, isOwner } = data;

  const mutations = usePromotionMutations();
  const [detailPromotionId, setDetailPromotionId] = useState<string | null>(null);
  const [actionDialog, setActionDialog] =
    useState<PromotionActionDialogState | null>(null);

  const handleStatusFilterChange = useCallback(
    (value: string) => {
      setStatusFilter(value as PromotionStatusFilter);
    },
    [setStatusFilter],
  );

  const handleLoadMore = useCallback(() => {
    void loadMore();
  }, [loadMore]);

  const openPromotionDetail = useCallback((promotionId: string) => {
    setDetailPromotionId(promotionId);
  }, []);

  const closePromotionDetail = useCallback(() => {
    setDetailPromotionId(null);
  }, []);

  const openActionDialog = useCallback(
    (action: PromotionWorkflowAction, promotionId: string) => {
      setActionDialog({ action, promotionId });
    },
    [],
  );

  const closeActionDialog = useCallback(() => {
    if (mutations.isMutating) return;
    setActionDialog(null);
  }, [mutations.isMutating]);

  const runWorkflowAction = useCallback(
    async (action: PromotionWorkflowAction, promotionId: string) => {
      switch (action) {
        case 'activate': {
          const result = await mutations.activatePromotion(promotionId);
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        case 'pause': {
          const result = await mutations.pausePromotion(promotionId);
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        case 'cancel': {
          const result = await mutations.cancelPromotion(promotionId);
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        case 'delete': {
          const result = await mutations.deletePromotion(promotionId);
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        case 'approve': {
          const result = await mutations.reviewPromotion({
            promotionId,
            approved: true,
          });
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        case 'reject': {
          const result = await mutations.reviewPromotion({
            promotionId,
            approved: false,
          });
          if (!result.success) {
            showError(result.error);
            return false;
          }
          break;
        }
        default:
          return false;
      }

      showSuccess(getPromotionActionSuccessMessage(action));
      refetchAll();
      return true;
    },
    [mutations, refetchAll],
  );

  const handleActionConfirm = useCallback(async () => {
    if (!actionDialog) return;

    const { action, promotionId } = actionDialog;
    const ok = await runWorkflowAction(action, promotionId);
    if (ok) {
      setActionDialog(null);
      if (action === 'delete' && detailPromotionId === promotionId) {
        setDetailPromotionId(null);
      }
    }
  }, [actionDialog, detailPromotionId, runWorkflowAction]);

  const handleEditPromotion = useCallback(
    (promotionId: string) => {
      router.push(`/owner/promotions/${promotionId}/edit`);
    },
    [router],
  );

  const handleCreatePromotion = useCallback(() => {
    router.push('/owner/promotions/create');
  }, [router]);

  const actionDialogCopy = actionDialog
    ? getPromotionActionDialogCopy(actionDialog.action)
    : null;

  return {
    ...mutations,
    isVenueOwner: isOwner,
    detailPromotionId,
    openPromotionDetail,
    closePromotionDetail,
    actionDialog,
    actionDialogCopy,
    openActionDialog,
    closeActionDialog,
    handleActionConfirm,
    handleStatusFilterChange,
    handleLoadMore,
    handleEditPromotion,
    handleCreatePromotion,
    runWorkflowAction,
  };
}

export type OwnerPromotionsPageActions = ReturnType<
  typeof useOwnerPromotionsPageActions
>;
