/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useMemo, useState } from 'react';
import type { UserPhoneLookupResult } from '@/components/molecules/UserPhoneLookupField';
import { PaymentMethod } from '@/graphql/generated';
import { buildBookingPromotionInput } from '@/lib/booking/build-booking-promotion-input';
import type { BookingPromotionSlot } from '@/lib/booking/build-booking-promotion-input';
import type { RecurringAvailabilityResult } from '@/lib/booking/recurring-availability-check';
import { resolveRecurringConfirmPricing } from '@/lib/booking/resolve-recurring-confirm-pricing';
import {
  isStaffBookingFormSubmittable,
  sumSlotPrices,
} from '@/lib/booking/staff-booking-pricing';
import { useRecurringConfirmPromoActions } from './useRecurringConfirmPromoActions';

interface UseOwnerCalendarRecurringConfirmFormParams {
  step: number;
  venueId: string | null | undefined;
  dateStr: string;
  slotDurationMinutes: number;
  confirmSlots: BookingPromotionSlot[];
  anchorSlots: BookingPromotionSlot[];
  availabilityResult: RecurringAvailabilityResult | null;
  excludeDates: string[];
  creatingRecurring: boolean;
}

export function useOwnerCalendarRecurringConfirmForm({
  step,
  venueId,
  dateStr,
  slotDurationMinutes,
  confirmSlots,
  anchorSlots,
  availabilityResult,
  excludeDates,
  creatingRecurring,
}: UseOwnerCalendarRecurringConfirmFormParams) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedUser, setSelectedUser] =
    useState<UserPhoneLookupResult | null>(null);
  const [internalNote, setInternalNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    PaymentMethod.Cash,
  );
  const [isManualPrice, setIsManualPrice] = useState(false);
  const [manualAmount, setManualAmount] = useState('');
  const [manualPriceNote, setManualPriceNote] = useState('');
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [appliedPromotion, setAppliedPromotion] = useState<{
    _id: string;
    code?: string | null;
    name: string;
    category?: string | null;
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discountResult, setDiscountResult] = useState<{
    totalDiscount: number;
    finalAmount: number;
  } | null>(null);

  const packageSubtotal =
    availabilityResult?.totalPrice ?? sumSlotPrices(confirmSlots);

  const effectiveSessionCount =
    availabilityResult?.effectiveSessions ??
    availabilityResult?.totalSessions ??
    0;

  const promotionInput = useMemo(
    () =>
      buildBookingPromotionInput({
        venueId: venueId ?? '',
        bookingDate: dateStr,
        slots: confirmSlots,
        totalAmount: packageSubtotal,
        slotDurationMinutes,
        ...(selectedUser?._id ? { userId: selectedUser._id } : {}),
        ...(appliedPromotion?.code ? { promoCode: appliedPromotion.code } : {}),
        isRecurring: true,
      }),
    [
      venueId,
      dateStr,
      confirmSlots,
      packageSubtotal,
      slotDurationMinutes,
      selectedUser,
      appliedPromotion,
    ],
  );

  const {
    effectivePricing,
    checkoutSubtotal,
    effectiveAppliedPromotion,
    autoDiscountAmount,
    autoPromotionNames,
    appliedPromotionsPreview,
    recurringPromoEligible,
    minRecurringPromoSessions,
    pricing,
  } = useMemo(
    () =>
      resolveRecurringConfirmPricing({
        availabilityResult,
        excludeDates,
        anchorSlots,
        appliedPromotion,
        discountResult,
        step,
        isManualPrice,
        manualAmount,
        promoCodeInput,
      }),
    [
      availabilityResult,
      excludeDates,
      anchorSlots,
      appliedPromotion,
      discountResult,
      step,
      isManualPrice,
      manualAmount,
      promoCodeInput,
    ],
  );

  const { handleApplyPromoCode, handleRemovePromotion, promoLoading } =
    useRecurringConfirmPromoActions({
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
    });

  const normalizedPhone = customerPhone.trim().replace(/\s/g, '');

  const canSubmit = isStaffBookingFormSubmittable({
    customerName,
    customerPhone: normalizedPhone,
    slotsCount: anchorSlots.length,
    isManualPrice,
    manualAmountValid: pricing.manualAmountValid,
    loading: creatingRecurring,
  });

  const handleManualPriceToggle = useCallback(
    (enabled: boolean) => {
      setIsManualPrice(enabled);
      if (enabled) {
        handleRemovePromotion();
      } else {
        setManualAmount('');
        setManualPriceNote('');
      }
    },
    [handleRemovePromotion],
  );

  return {
    customerName,
    setCustomerName,
    customerPhone,
    setCustomerPhone,
    selectedUser,
    setSelectedUser,
    internalNote,
    setInternalNote,
    paymentMethod,
    setPaymentMethod,
    isManualPrice,
    manualAmount,
    setManualAmount,
    manualPriceNote,
    setManualPriceNote,
    promoCodeInput,
    setPromoCodeInput,
    appliedPromotion: effectiveAppliedPromotion,
    promoError,
    setPromoError,
    promoLoading,
    handleManualPriceToggle,
    handleApplyPromoCode,
    handleRemovePromotion,
    pricing,
    effectivePricing,
    checkoutSubtotal,
    subtotal: packageSubtotal,
    canSubmit,
    normalizedPhone,
    autoPromotionNames,
    autoDiscountAmount,
    appliedPromotionsPreview,
    recurringPromoEligible,
    minRecurringPromoSessions,
    effectiveSessionCount,
  };
}
