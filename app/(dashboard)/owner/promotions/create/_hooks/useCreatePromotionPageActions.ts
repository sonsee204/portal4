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

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { FieldErrors } from 'react-hook-form';
import type { CreatePromotionFormValues } from '@/lib/promotion/create-promotion-schema';
import {
  mapFormToCreatePromotionInput,
  mapFormToUpdatePromotionInput,
} from '@/lib/promotion/map-promotion-form';
import { showError, showSuccess } from '@/lib/toast';
import type { CreatePromotionPageData } from './useCreatePromotionPageData';

export function useCreatePromotionPageActions(data: CreatePromotionPageData) {
  const router = useRouter();
  const {
    venueId,
    venueLoading,
    promotionId,
    isEditing,
    getValues,
    rhfHandleSubmit,
    isDirty,
    mutations,
  } = data;

  const [abandonDialogOpen, setAbandonDialogOpen] = useState(false);

  useEffect(() => {
    if (venueLoading) return;
    if (!venueId) {
      showError('Chọn cơ sở trước khi tạo khuyến mãi');
      router.replace('/owner/promotions');
    }
  }, [venueId, venueLoading, router]);

  useEffect(() => {
    const hasDraft = isDirty;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (!hasDraft) return;
      event.preventDefault();
      event.returnValue = '';
    };
    window.addEventListener('beforeunload', onBeforeUnload);
    return () => window.removeEventListener('beforeunload', onBeforeUnload);
  }, [isDirty]);

  const submitPromotion = useCallback(async () => {
    if (!venueId) return;

    const values = getValues();

    if (isEditing && promotionId) {
      const result = await mutations.updatePromotion(
        mapFormToUpdatePromotionInput(promotionId, values),
      );
      if (!result.success) {
        showError(result.error);
        return;
      }
      showSuccess('Đã cập nhật khuyến mãi');
      router.replace(`/owner/promotions?promotionId=${promotionId}`);
      return;
    }

    const result = await mutations.createPromotion(
      mapFormToCreatePromotionInput(venueId, values),
    );
    if (!result.success) {
      showError(result.error);
      return;
    }

    showSuccess(
      values.submitForApproval
        ? 'Đã tạo khuyến mãi và gửi duyệt'
        : 'Đã tạo khuyến mãi',
    );
    router.replace(
      `/owner/promotions?promotionId=${result.promotion._id}`,
    );
  }, [getValues, isEditing, mutations, promotionId, router, venueId]);

  const onInvalid = useCallback(
    (errors: FieldErrors<CreatePromotionFormValues>) => {
      const message =
        errors.name?.message ||
        errors.value?.message ||
        errors.code?.message ||
        errors.startDate?.message ||
        errors.endDate?.message ||
        errors.selectedCourtIds?.message ||
        errors.selectedSportTypes?.message ||
        errors.selectedProductCategoryIds?.message ||
        'Vui lòng kiểm tra lại thông tin khuyến mãi';
      showError(String(message));
    },
    [],
  );

  const handleSubmit = useCallback(() => {
    void rhfHandleSubmit(submitPromotion, onInvalid)();
  }, [onInvalid, rhfHandleSubmit, submitPromotion]);

  const handleBack = useCallback(() => {
    if (isDirty) {
      setAbandonDialogOpen(true);
      return;
    }
    router.push('/owner/promotions');
  }, [isDirty, router]);

  const confirmAbandon = useCallback(() => {
    setAbandonDialogOpen(false);
    router.push('/owner/promotions');
  }, [router]);

  const cancelAbandon = useCallback(() => {
    setAbandonDialogOpen(false);
  }, []);

  return {
    handleSubmit,
    handleBack,
    abandonDialogOpen,
    confirmAbandon,
    cancelAbandon,
    isSubmitting: mutations.creating || mutations.updating,
  };
}

export type CreatePromotionPageActions = ReturnType<
  typeof useCreatePromotionPageActions
>;
