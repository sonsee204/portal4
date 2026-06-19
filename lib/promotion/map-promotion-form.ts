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

import type {
  CreatePromotionInput,
  PromotionApplyLevel,
  PromotionCategory,
  PromotionScope,
  PromotionTrigger,
  PromotionType,
  SportType,
  UpdatePromotionInput,
} from '@/graphql/generated';
import type { CreatePromotionFormValues } from './create-promotion-schema';
import { normalizePromotionCode } from './normalize-promotion-code';

function parseOptionalNumber(value: string): number | undefined {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  const num = Number(trimmed);
  return Number.isNaN(num) ? undefined : num;
}

function buildScopeFields(values: CreatePromotionFormValues) {
  const { scope, selectedCourtIds, selectedSportTypes, selectedProductCategoryIds } =
    values;

  return {
    courtIds:
      scope === 'SPECIFIC_COURTS' && selectedCourtIds.length > 0
        ? selectedCourtIds
        : undefined,
    sportTypes:
      scope === 'SPECIFIC_SPORT' && selectedSportTypes.length > 0
        ? (selectedSportTypes as SportType[])
        : undefined,
    productCategoryIds:
      scope === 'PRODUCTS' && selectedProductCategoryIds.length > 0
        ? selectedProductCategoryIds
        : undefined,
  };
}

function buildTimeRanges(values: CreatePromotionFormValues) {
  if (
    values.applyLevel !== 'PER_HOUR' ||
    !values.hasTimeRanges ||
    values.applicableTimeRanges.length === 0
  ) {
    return undefined;
  }
  return values.applicableTimeRanges;
}

export function mapFormToCreatePromotionInput(
  venueId: string,
  values: CreatePromotionFormValues,
): CreatePromotionInput {
  const scopeFields = buildScopeFields(values);

  return {
    venueId,
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    type: values.type as PromotionType,
    value: Number(values.value),
    maxDiscountAmount: parseOptionalNumber(values.maxDiscountAmount),
    category: values.category as PromotionCategory,
    trigger: values.trigger as PromotionTrigger,
    scope: values.scope as PromotionScope,
    applyLevel: values.applyLevel as PromotionApplyLevel,
    applicableTimeRanges: buildTimeRanges(values),
    ...scopeFields,
    code:
      values.trigger === 'CODE'
        ? normalizePromotionCode(values.code) || undefined
        : undefined,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate.toISOString(),
    minBookingAmount: parseOptionalNumber(values.minBookingAmount),
    totalUsageLimit: parseOptionalNumber(values.totalUsageLimit),
    perUserLimit: parseOptionalNumber(values.perUserLimit),
    isStackable: values.isStackable,
    showOnVenueCard: values.showOnVenueCard,
    showAsBanner: values.showAsBanner,
    badgeText: values.badgeText.trim() || undefined,
    badgeColor: values.badgeColor.trim() || undefined,
    submitForApproval: values.submitForApproval,
  };
}

export function mapFormToUpdatePromotionInput(
  promotionId: string,
  values: CreatePromotionFormValues,
): UpdatePromotionInput {
  const scopeFields = buildScopeFields(values);

  return {
    promotionId,
    name: values.name.trim(),
    description: values.description.trim() || undefined,
    category: values.category as PromotionCategory,
    type: values.type as PromotionType,
    value: Number(values.value),
    maxDiscountAmount: values.maxDiscountAmount
      ? Number(values.maxDiscountAmount)
      : null,
    minBookingAmount: values.minBookingAmount
      ? Number(values.minBookingAmount)
      : null,
    applyLevel: values.applyLevel as PromotionApplyLevel,
    applicableTimeRanges: buildTimeRanges(values),
    scope: values.scope as PromotionScope,
    ...scopeFields,
    trigger: values.trigger as PromotionTrigger,
    code:
      values.trigger === 'CODE'
        ? normalizePromotionCode(values.code) || undefined
        : undefined,
    startDate: values.startDate.toISOString(),
    endDate: values.endDate.toISOString(),
    totalUsageLimit: parseOptionalNumber(values.totalUsageLimit),
    perUserLimit: parseOptionalNumber(values.perUserLimit),
    showOnVenueCard: values.showOnVenueCard,
    showAsBanner: values.showAsBanner,
    badgeText: values.badgeText.trim() || undefined,
    badgeColor: values.badgeColor.trim() || undefined,
  };
}

export function mapPromotionToFormValues(
  promotion: {
    name: string;
    description?: string | null;
    type: CreatePromotionFormValues['type'];
    value: number;
    maxDiscountAmount?: number | null;
    category: CreatePromotionFormValues['category'];
    trigger: CreatePromotionFormValues['trigger'];
    scope: CreatePromotionFormValues['scope'];
    applyLevel: CreatePromotionFormValues['applyLevel'];
    applicableTimeRanges?: Array<{ startTime: string; endTime: string }> | null;
    code?: string | null;
    startDate: string;
    endDate: string;
    minBookingAmount?: number | null;
    totalUsageLimit?: number | null;
    perUserLimit?: number | null;
    isStackable?: boolean | null;
    showOnVenueCard?: boolean | null;
    showAsBanner?: boolean | null;
    badgeText?: string | null;
    badgeColor?: string | null;
    courtIds?: string[] | null;
    sportTypes?: string[] | null;
    productCategoryIds?: string[] | null;
  },
): CreatePromotionFormValues {
  const timeRanges = promotion.applicableTimeRanges ?? [];

  return {
    name: promotion.name,
    description: promotion.description ?? '',
    type: promotion.type,
    value: String(promotion.value),
    maxDiscountAmount:
      promotion.maxDiscountAmount != null
        ? String(promotion.maxDiscountAmount)
        : '',
    category: promotion.category,
    trigger: promotion.trigger,
    scope: promotion.scope,
    applyLevel: promotion.applyLevel,
    hasTimeRanges: timeRanges.length > 0,
    applicableTimeRanges:
      timeRanges.length > 0
        ? timeRanges
        : [{ startTime: '06:00', endTime: '08:00' }],
    code: promotion.code ?? '',
    startDate: new Date(promotion.startDate),
    endDate: new Date(promotion.endDate),
    minBookingAmount:
      promotion.minBookingAmount != null
        ? String(promotion.minBookingAmount)
        : '',
    totalUsageLimit:
      promotion.totalUsageLimit != null
        ? String(promotion.totalUsageLimit)
        : '',
    perUserLimit:
      promotion.perUserLimit != null ? String(promotion.perUserLimit) : '',
    isStackable: promotion.isStackable ?? false,
    showOnVenueCard: promotion.showOnVenueCard ?? true,
    showAsBanner: promotion.showAsBanner ?? false,
    badgeText: promotion.badgeText ?? '',
    badgeColor: promotion.badgeColor ?? '#8B5CF6',
    submitForApproval: false,
    selectedCourtIds: promotion.courtIds ?? [],
    selectedSportTypes: promotion.sportTypes ?? [],
    selectedProductCategoryIds: promotion.productCategoryIds ?? [],
  };
}
