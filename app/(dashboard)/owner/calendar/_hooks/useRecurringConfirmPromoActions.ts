/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback } from 'react';
import type { UserPhoneLookupResult } from '@/components/molecules/UserPhoneLookupField';
import type { ApplyPromotionInput } from '@/graphql/generated';
import {
  useCalculateBookingDiscount,
  useValidatePromoCode,
} from '@/hooks/owner';
import type { BookingPromotionSlot } from '@/lib/booking/build-booking-promotion-input';
import type { RecurringAppliedPromotionState } from '@/lib/booking/resolve-recurring-confirm-pricing';
import { normalizePromotionCode } from '@/lib/promotion/normalize-promotion-code';

interface UseRecurringConfirmPromoActionsParams {
  venueId: string | null | undefined;
  dateStr: string;
  slotDurationMinutes: number;
  confirmSlots: BookingPromotionSlot[];
  packageSubtotal: number;
  effectiveSessionCount: number;
  recurringPromoEligible: boolean;
  isManualPrice: boolean;
  promoCodeInput: string;
  promotionInput: ApplyPromotionInput;
  selectedUser: UserPhoneLookupResult | null;
  setAppliedPromotion: (value: RecurringAppliedPromotionState | null) => void;
  setPromoCodeInput: (value: string) => void;
  setPromoError: (value: string | null) => void;
  setDiscountResult: (
    value: { totalDiscount: number; finalAmount: number } | null,
  ) => void;
}

export function useRecurringConfirmPromoActions({
  venueId,
  dateStr,
  slotDurationMinutes,
  confirmSlots,
  packageSubtotal,
  effectiveSessionCount,
  recurringPromoEligible,
  isManualPrice,
  promoCodeInput,
  promotionInput,
  selectedUser,
  setAppliedPromotion,
  setPromoCodeInput,
  setPromoError,
  setDiscountResult,
}: UseRecurringConfirmPromoActionsParams) {
  const { validateCode, loading: promoValidating } = useValidatePromoCode();
  const { calculateDiscount, loading: discountCalculating } =
    useCalculateBookingDiscount();

  const handleApplyPromoCode = useCallback(async () => {
    const code = normalizePromotionCode(promoCodeInput);
    if (!code || isManualPrice || !venueId) return;

    setPromoError(null);
    const courtIds = [...new Set(confirmSlots.map((slot) => slot.courtId))];
    const result = await validateCode({
      code,
      venueId,
      bookingDate: dateStr,
      courtIds,
      totalAmount: packageSubtotal,
      slotDurationMinutes,
      isRecurring: true,
      effectiveSessionCount,
      ...(selectedUser?._id ? { userId: selectedUser._id } : {}),
      slots: confirmSlots.map((slot) => ({
        courtId: slot.courtId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
      })),
    });

    if (!result?.isValid || !result.promotion) {
      setPromoError(result?.errorMessage ?? 'Mã không hợp lệ');
      return;
    }

    if (!recurringPromoEligible && result.promotion.category === 'RECURRING') {
      setPromoError('Khuyến mãi lịch cố định áp dụng từ 4 buổi trở lên.');
      return;
    }

    setAppliedPromotion({
      _id: result.promotion._id,
      code: result.promotion.code ?? code,
      name: result.promotion.name,
      category: result.promotion.category ?? null,
    });
    setPromoCodeInput(result.promotion.code ?? code);

    const calculated = await calculateDiscount({
      ...promotionInput,
      promoCode: result.promotion.code ?? code,
    });

    if (calculated) {
      setDiscountResult({
        totalDiscount: calculated.totalDiscount,
        finalAmount: calculated.finalAmount,
      });
    }
  }, [
    promoCodeInput,
    isManualPrice,
    venueId,
    confirmSlots,
    validateCode,
    dateStr,
    packageSubtotal,
    slotDurationMinutes,
    effectiveSessionCount,
    recurringPromoEligible,
    selectedUser,
    calculateDiscount,
    promotionInput,
    setAppliedPromotion,
    setPromoCodeInput,
    setPromoError,
    setDiscountResult,
  ]);

  const handleRemovePromotion = useCallback(() => {
    setAppliedPromotion(null);
    setPromoCodeInput('');
    setPromoError(null);
    setDiscountResult(null);
  }, [setAppliedPromotion, setPromoCodeInput, setPromoError, setDiscountResult]);

  return {
    handleApplyPromoCode,
    handleRemovePromotion,
    promoLoading: promoValidating || discountCalculating,
  };
}
