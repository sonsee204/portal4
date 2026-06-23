/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile useRecurringBookingConfirmationData (effectivePricing, autoPromoDiscount)
 * Cross-ref: booking-staff-recurring-pricing.service.ts (excludeSet + recurringCategoryDiscount)
 */

import { parseDisplayDate } from '@/lib/date/format-display';
import type { RecurringAvailabilityResult } from './recurring-availability-check';

export interface EffectiveRecurringPricing {
  effectiveDates: string[];
  effectiveSessions: number;
  totalPrice: number;
  packageDiscountAmount: number;
  packageFinalAmount: number;
  hasExcludedDates: boolean;
}

export interface RecurringAppliedPromotionLike {
  name: string;
  category?: string | null;
  discountAmount: number;
}

export interface RecurringPreCalculatedDiscountLike {
  totalDiscount: number;
  finalAmount: number;
  appliedPromotions?: RecurringAppliedPromotionLike[];
}

function dayOfWeekFromIsoDate(date: string): number {
  return parseDisplayDate(date)?.getDay() ?? 0;
}

export function computeEffectiveRecurringPricing(
  availabilityResult: RecurringAvailabilityResult,
  excludeDates: string[],
): EffectiveRecurringPricing {
  const excludeSet = new Set(excludeDates);
  const effectiveDates = availabilityResult.availableDates.filter(
    (date) => !excludeSet.has(date),
  );
  const hasExcludedDates = excludeDates.length > 0;

  if (!hasExcludedDates) {
    return {
      effectiveDates: availabilityResult.availableDates,
      effectiveSessions: availabilityResult.totalSessions,
      totalPrice: availabilityResult.totalPrice,
      packageDiscountAmount: availabilityResult.discountAmount,
      packageFinalAmount: availabilityResult.finalAmount,
      hasExcludedDates: false,
    };
  }

  let totalPrice = 0;
  for (const date of effectiveDates) {
    const dayOfWeek = dayOfWeekFromIsoDate(date);
    const dayBreakdown = availabilityResult.dayPriceBreakdown?.find(
      (item) => item.dayOfWeek === dayOfWeek,
    );
    totalPrice += dayBreakdown?.pricePerSession ?? availabilityResult.pricePerSession;
  }

  const packageDiscountAmount = Math.round(
    (totalPrice * availabilityResult.discountPercent) / 100,
  );

  return {
    effectiveDates,
    effectiveSessions: effectiveDates.length,
    totalPrice,
    packageDiscountAmount,
    packageFinalAmount: totalPrice - packageDiscountAmount,
    hasExcludedDates: true,
  };
}

/**
 * Filters auto-promos for staff exclude preview (legacy helper — prefer API preview).
 * RECURRING category promos are dropped only when effective sessions fall below minimum.
 */
export function computeRecurringAutoPromoDiscount(params: {
  preCalculatedDiscount: RecurringPreCalculatedDiscountLike | null;
  recurringPromoEligible: boolean;
  hasExcludedDates: boolean;
  originalTotalPrice: number;
  effectiveTotalPrice: number;
}): {
  autoDiscountAmount: number;
  autoPromotionNames: string[];
} {
  const {
    preCalculatedDiscount,
    recurringPromoEligible,
    hasExcludedDates,
    originalTotalPrice,
    effectiveTotalPrice,
  } = params;

  if (!preCalculatedDiscount?.appliedPromotions?.length) {
    return { autoDiscountAmount: 0, autoPromotionNames: [] };
  }

  const eligiblePromotions = preCalculatedDiscount.appliedPromotions.filter(
    (promo) => !(promo.category === 'RECURRING' && !recurringPromoEligible),
  );

  if (eligiblePromotions.length === 0) {
    return { autoDiscountAmount: 0, autoPromotionNames: [] };
  }

  let autoDiscountAmount = eligiblePromotions.reduce(
    (sum, promo) => sum + promo.discountAmount,
    0,
  );

  if (
    hasExcludedDates &&
    originalTotalPrice > 0 &&
    effectiveTotalPrice !== originalTotalPrice
  ) {
    autoDiscountAmount = Math.round(
      (autoDiscountAmount * effectiveTotalPrice) / originalTotalPrice,
    );
  }

  autoDiscountAmount = Math.min(
    autoDiscountAmount,
    Math.max(0, effectiveTotalPrice),
  );

  return {
    autoDiscountAmount,
    autoPromotionNames: eligiblePromotions.map((promo) => promo.name),
  };
}

export function scalePromoDiscountForExcludedDates(params: {
  promoDiscount: number;
  hasExcludedDates: boolean;
  originalTotalPrice: number;
  effectiveTotalPrice: number;
}): number {
  const {
    promoDiscount,
    hasExcludedDates,
    originalTotalPrice,
    effectiveTotalPrice,
  } = params;

  if (!hasExcludedDates || originalTotalPrice <= 0) {
    return promoDiscount;
  }

  return Math.round((promoDiscount * effectiveTotalPrice) / originalTotalPrice);
}
