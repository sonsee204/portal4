/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import type { RecurringAvailabilityResult } from './recurring-availability-check';
import {
  computeEffectiveRecurringPricing,
  type EffectiveRecurringPricing,
} from './recurring-exclude-pricing';
import {
  resolveActiveBookingDiscount,
  resolveBookingDisplayTotal,
  sumSlotPrices,
} from './staff-booking-pricing';
import type { BookingPromotionSlot } from './build-booking-promotion-input';

export interface RecurringAppliedPromotionState {
  _id: string;
  code?: string | null;
  name: string;
  category?: string | null;
}

export interface ResolveRecurringConfirmPricingParams {
  availabilityResult: RecurringAvailabilityResult | null;
  excludeDates: string[];
  anchorSlots: BookingPromotionSlot[];
  appliedPromotion: RecurringAppliedPromotionState | null;
  discountResult: { totalDiscount: number; finalAmount: number } | null;
  step: number;
  isManualPrice: boolean;
  manualAmount: string;
  promoCodeInput: string;
}

export interface RecurringConfirmPricingResult {
  effectivePricing: EffectiveRecurringPricing | null;
  packageSubtotal: number;
  checkoutSubtotal: number;
  effectiveAppliedPromotion: RecurringAppliedPromotionState | null;
  autoDiscountAmount: number;
  autoPromotionNames: string[];
  appliedPromotionsPreview: RecurringAvailabilityResult['appliedPromotions'];
  recurringPromoEligible: boolean;
  minRecurringPromoSessions: number;
  pricing: ReturnType<typeof resolveBookingDisplayTotal>;
}

function resolveEffectivePricing(
  availabilityResult: RecurringAvailabilityResult,
  excludeDates: string[],
): EffectiveRecurringPricing {
  if (
    availabilityResult.effectiveSessions != null &&
    (availabilityResult.excludedSessionCount ?? 0) > 0
  ) {
    return {
      effectiveDates: availabilityResult.availableDates.filter(
        (date) => !excludeDates.includes(date),
      ),
      effectiveSessions: availabilityResult.effectiveSessions,
      totalPrice: availabilityResult.totalPrice,
      packageDiscountAmount: availabilityResult.discountAmount,
      packageFinalAmount: availabilityResult.finalAmount,
      hasExcludedDates: true,
    };
  }

  return computeEffectiveRecurringPricing(availabilityResult, excludeDates);
}

export function resolveRecurringConfirmPricing(
  params: ResolveRecurringConfirmPricingParams,
): RecurringConfirmPricingResult {
  const {
    availabilityResult,
    excludeDates,
    anchorSlots,
    appliedPromotion,
    discountResult,
    step,
    isManualPrice,
    manualAmount,
    promoCodeInput,
  } = params;

  const recurringPromoEligible =
    availabilityResult?.recurringPromoEligible ??
    (availabilityResult?.effectiveSessions ??
      availabilityResult?.totalSessions ??
      0) >= 4;

  const minRecurringPromoSessions =
    availabilityResult?.minRecurringPromoSessions ?? 4;

  const effectivePricing = availabilityResult
    ? resolveEffectivePricing(availabilityResult, excludeDates)
    : null;

  const packageSubtotal =
    effectivePricing?.totalPrice ??
    availabilityResult?.totalPrice ??
    sumSlotPrices(anchorSlots);

  const checkoutSubtotal =
    effectivePricing?.packageFinalAmount ??
    availabilityResult?.finalAmount ??
    packageSubtotal;

  const effectiveAppliedPromotion =
    !recurringPromoEligible && appliedPromotion?.category === 'RECURRING'
      ? null
      : appliedPromotion;

  const autoDiscountAmount = availabilityResult?.autoPromoDiscount ?? 0;
  const autoPromotionNames =
    availabilityResult?.appliedPromotions?.map((promo) => promo.name) ?? [];

  const voucherDiscountAmount = effectiveAppliedPromotion
    ? (discountResult?.totalDiscount ?? 0)
    : 0;

  const activeDiscount = resolveActiveBookingDiscount({
    discountResult: effectiveAppliedPromotion
      ? {
        totalDiscount: voucherDiscountAmount,
        finalAmount: Math.max(0, checkoutSubtotal - voucherDiscountAmount),
      }
      : autoDiscountAmount > 0
        ? {
          totalDiscount: autoDiscountAmount,
          finalAmount: Math.max(
            0,
            checkoutSubtotal - autoDiscountAmount,
          ),
        }
        : null,
    enabled: step === 1 && !isManualPrice,
    isManualPrice,
    appliedPromotion: effectiveAppliedPromotion,
    promoCodeInput,
    preCalculatedDiscount: null,
  });

  const pricing = resolveBookingDisplayTotal({
    subtotal: checkoutSubtotal,
    isManualPrice,
    manualAmount,
    discount: activeDiscount,
  });

  return {
    effectivePricing,
    packageSubtotal,
    checkoutSubtotal,
    effectiveAppliedPromotion,
    autoDiscountAmount,
    autoPromotionNames,
    appliedPromotionsPreview: availabilityResult?.appliedPromotions ?? [],
    recurringPromoEligible,
    minRecurringPromoSessions,
    pricing,
  };
}
