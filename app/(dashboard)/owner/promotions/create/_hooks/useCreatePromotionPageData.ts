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

import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  usePromotion,
  usePromotionMutations,
  useVenueCategories,
  useVenueCourts,
} from '@/hooks/owner';
import { VenueAction, type PromotionCategory } from '@/graphql/generated';
import {
  CREATE_PROMOTION_DEFAULT_VALUES,
  createPromotionSchema,
  type CreatePromotionFormValues,
} from '@/lib/promotion/create-promotion-schema';
import { mapPromotionToFormValues } from '@/lib/promotion/map-promotion-form';
import { getAvailableScopes } from '@/lib/promotion/promotion-constants';
import { normalizePromotionCode } from '@/lib/promotion/normalize-promotion-code';
import { startOfDay } from '@/lib/date/calendar';

export function useCreatePromotionPageData(promotionId?: string) {
  const { selectedVenueId, selectedVenue, loading: venueLoading, canVenue } =
    useVenueContext();

  const isEditing = Boolean(promotionId);

  const form = useForm<CreatePromotionFormValues>({
    resolver: zodResolver(createPromotionSchema),
    mode: 'onChange',
    defaultValues: CREATE_PROMOTION_DEFAULT_VALUES,
  });

  const { watch, setValue, getValues, handleSubmit: rhfHandleSubmit, formState } =
    form;

  // RHF watch drives reactive wizard state.
  // eslint-disable-next-line react-hooks/incompatible-library -- react-hook-form watch
  const formValues = watch();

  const { promotion: existingPromotion, loading: loadingPromotion } =
    usePromotion(isEditing ? (promotionId ?? null) : null);

  const { courts, loading: courtsLoading } = useVenueCourts(selectedVenueId, undefined, {
    limit: 200,
  });

  const { categories, loading: categoriesLoading } = useVenueCategories(
    selectedVenueId,
  );

  const mutations = usePromotionMutations();

  useEffect(() => {
    if (!isEditing || !existingPromotion) return;
    const mapped = mapPromotionToFormValues(existingPromotion);
    Object.entries(mapped).forEach(([key, value]) => {
      setValue(
        key as keyof CreatePromotionFormValues,
        value as CreatePromotionFormValues[keyof CreatePromotionFormValues],
        { shouldValidate: false },
      );
    });
  }, [existingPromotion, isEditing, setValue]);

  useEffect(() => {
    if (formValues.category === 'VOUCHER') {
      setValue('trigger', 'CODE', { shouldValidate: true });
    } else if (
      formValues.category === 'LOYALTY' ||
      formValues.category === 'RECURRING'
    ) {
      setValue('trigger', 'AUTO', { shouldValidate: true });
      setValue('code', '', { shouldValidate: true });
    }
  }, [formValues.category, setValue]);

  useEffect(() => {
    if (
      formValues.category === 'RECURRING' &&
      (formValues.scope === 'PRODUCTS' || formValues.scope === 'ALL')
    ) {
      setValue('scope', 'ALL_COURTS', { shouldValidate: true });
    }
  }, [formValues.category, formValues.scope, setValue]);

  const supportsPerHour =
    formValues.scope !== 'PRODUCTS' && formValues.scope !== 'ALL';

  useEffect(() => {
    if (!supportsPerHour && formValues.applyLevel === 'PER_HOUR') {
      setValue('applyLevel', 'TOTAL', { shouldValidate: true });
    }
  }, [formValues.applyLevel, setValue, supportsPerHour]);

  const availableScopes = useMemo(
    () => getAvailableScopes(formValues.category as PromotionCategory),
    [formValues.category],
  );

  const minStartDate = useMemo(() => {
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    return startOfDay(oneYearAgo);
  }, []);

  const isPastStartDate = useMemo(() => {
    const todayStart = startOfDay(new Date());
    return formValues.startDate < todayStart;
  }, [formValues.startDate]);

  const setField = (
    field: keyof CreatePromotionFormValues,
    value: CreatePromotionFormValues[keyof CreatePromotionFormValues],
  ) => {
    setValue(field, value as never, { shouldValidate: true, shouldDirty: true });
  };

  const setCode = (raw: string) => {
    setField('code', normalizePromotionCode(raw));
  };

  return {
    venueId: selectedVenueId,
    venueName: selectedVenue?.name ?? null,
    venueLoading,
    canManagePromotions: canVenue(VenueAction.ManagePromotions),
    promotionId,
    isEditing,
    loadingPromotion: isEditing && loadingPromotion,
    form,
    formValues,
    getValues,
    setValue,
    setField,
    setCode,
    rhfHandleSubmit,
    formErrors: formState.errors,
    isValid: formState.isValid,
    isDirty: formState.isDirty,
    courts,
    courtsLoading,
    categories,
    categoriesLoading,
    availableScopes,
    supportsPerHour,
    minStartDate,
    isPastStartDate,
    mutations,
    isSubmitting: mutations.creating || mutations.updating,
  };
}

export type CreatePromotionPageData = ReturnType<
  typeof useCreatePromotionPageData
>;
