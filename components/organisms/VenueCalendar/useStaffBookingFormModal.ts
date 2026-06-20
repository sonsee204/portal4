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
import {
  useAvailablePromotionsForBooking,
  useCalculateBookingDiscount,
  useValidatePromoCode,
} from '@/hooks/owner';
import { buildBookingPromotionInput } from '@/lib/booking/build-booking-promotion-input';
import { mapStaffBookingInputFromFormState } from '@/lib/booking/map-staff-booking-input';
import {
  isStaffBookingFormSubmittable,
  resolveActiveBookingDiscount,
  resolveBookingDisplayTotal,
  sumSlotPrices,
} from '@/lib/booking/staff-booking-pricing';
import { normalizePromotionCode } from '@/lib/promotion/normalize-promotion-code';
import { PHONE_REGEX } from '@/lib/validation/constants';
import type { StaffSelectedSlot } from '@/lib/venue/calendar-staff-booking';
import { toIsoDateString } from '@/lib/date/calendar';

export interface StaffBookingFormSubmitPayload {
  customerId?: string;
  customerName: string;
  customerPhone: string;
  internalNote?: string;
  paymentMethod: PaymentMethod;
  discountCode?: string;
  isManualPrice?: boolean;
  manualFinalAmount?: number;
  manualPriceNote?: string;
}

interface UseStaffBookingFormModalParams {
  open: boolean;
  venueId: string;
  bookingDate: Date;
  selectedSlots: StaffSelectedSlot[];
  slotDurationMinutes: number;
  onConfirm: (payload: StaffBookingFormSubmitPayload) => void | Promise<void>;
}

export function useStaffBookingFormModal({
  open,
  venueId,
  bookingDate,
  selectedSlots,
  slotDurationMinutes,
}: UseStaffBookingFormModalParams) {
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
  } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [discountResult, setDiscountResult] = useState<{
    totalDiscount: number;
    finalAmount: number;
  } | null>(null);

  const { validateCode, loading: promoValidating } = useValidatePromoCode();
  const { calculateDiscount, loading: discountCalculating } =
    useCalculateBookingDiscount();

  const dateStr = toIsoDateString(bookingDate);
  const subtotal = useMemo(
    () => sumSlotPrices(selectedSlots),
    [selectedSlots],
  );

  const promotionInput = useMemo(
    () =>
      buildBookingPromotionInput({
        venueId,
        bookingDate: dateStr,
        slots: selectedSlots,
        totalAmount: subtotal,
        slotDurationMinutes,
        ...(selectedUser?._id ? { userId: selectedUser._id } : {}),
        ...(appliedPromotion?.code ? { promoCode: appliedPromotion.code } : {}),
      }),
    [
      venueId,
      dateStr,
      selectedSlots,
      subtotal,
      slotDurationMinutes,
      selectedUser,
      appliedPromotion,
    ],
  );

  const { available: availablePromotions } = useAvailablePromotionsForBooking(
    open ? promotionInput : null,
    { skip: !open || isManualPrice },
  );

  const preCalculatedDiscount =
    availablePromotions?.preCalculatedDiscount ?? null;

  const activeDiscount = resolveActiveBookingDiscount({
    discountResult,
    enabled: open,
    isManualPrice,
    appliedPromotion,
    promoCodeInput,
    preCalculatedDiscount,
  });

  const pricing = resolveBookingDisplayTotal({
    subtotal,
    isManualPrice,
    manualAmount,
    discount: activeDiscount,
  });

  const normalizedPhone = customerPhone.trim().replace(/\s/g, '');

  const canSubmit = isStaffBookingFormSubmittable({
    customerName,
    customerPhone: normalizedPhone,
    slotsCount: selectedSlots.length,
    isManualPrice,
    manualAmountValid: pricing.manualAmountValid,
  });

  const handleManualPriceToggle = useCallback((enabled: boolean) => {
    setIsManualPrice(enabled);
    if (enabled) {
      setAppliedPromotion(null);
      setPromoCodeInput('');
      setPromoError(null);
      setDiscountResult(null);
    } else {
      setManualAmount('');
      setManualPriceNote('');
    }
  }, []);

  const handleApplyPromoCode = useCallback(async () => {
    const code = normalizePromotionCode(promoCodeInput);
    if (!code || isManualPrice) return;

    setPromoError(null);
    const courtIds = [...new Set(selectedSlots.map((slot) => slot.courtId))];
    const result = await validateCode({
      code,
      venueId,
      bookingDate: dateStr,
      courtIds,
      totalAmount: subtotal,
      slotDurationMinutes,
      isRecurring: false,
      ...(selectedUser?._id ? { userId: selectedUser._id } : {}),
      slots: selectedSlots.map((slot) => ({
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

    setAppliedPromotion(result.promotion);
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
    } else if (result.estimatedDiscount != null) {
      setDiscountResult({
        totalDiscount: result.estimatedDiscount,
        finalAmount: Math.max(0, subtotal - result.estimatedDiscount),
      });
    }
  }, [
    promoCodeInput,
    isManualPrice,
    selectedSlots,
    validateCode,
    venueId,
    dateStr,
    subtotal,
    slotDurationMinutes,
    selectedUser,
    calculateDiscount,
    promotionInput,
  ]);

  const handleRemovePromotion = useCallback(() => {
    setAppliedPromotion(null);
    setPromoCodeInput('');
    setPromoError(null);
    setDiscountResult(null);
  }, []);

  const buildSubmitPayload = useCallback((): StaffBookingFormSubmitPayload => {
    const input = mapStaffBookingInputFromFormState({
      venueId,
      date: dateStr,
      slots: selectedSlots,
      ...(selectedUser?._id ? { customerId: selectedUser._id } : {}),
      customerName: customerName.trim(),
      customerPhone: normalizedPhone,
      internalNote,
      paymentMethod,
      isManualPrice,
      manualAmount,
      manualPriceNote,
      appliedPromoCode: appliedPromotion?.code ?? null,
    });

    return {
      ...(input.customerId ? { customerId: input.customerId } : {}),
      customerName: input.customerInfo!.name,
      customerPhone: input.customerInfo!.phone,
      ...(input.internalNote ? { internalNote: input.internalNote } : {}),
      paymentMethod: input.paymentMethod ?? PaymentMethod.Cash,
      ...(input.discountCode ? { discountCode: input.discountCode } : {}),
      ...(input.isManualPrice ? { isManualPrice: true } : {}),
      ...(typeof input.manualFinalAmount === 'number'
        ? { manualFinalAmount: input.manualFinalAmount }
        : {}),
      ...(input.manualPriceNote
        ? { manualPriceNote: input.manualPriceNote }
        : {}),
    };
  }, [
    venueId,
    dateStr,
    selectedSlots,
    selectedUser,
    customerName,
    normalizedPhone,
    internalNote,
    paymentMethod,
    isManualPrice,
    manualAmount,
    manualPriceNote,
    appliedPromotion,
  ]);

  const autoPromotionNames =
    preCalculatedDiscount?.appliedPromotions?.map((item) => item.name) ?? [];

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
    appliedPromotion,
    promoError,
    setPromoError,
    promoLoading: promoValidating || discountCalculating,
    pricing,
    subtotal,
    canSubmit,
    phoneValid: PHONE_REGEX.test(normalizedPhone),
    handleManualPriceToggle,
    handleApplyPromoCode,
    handleRemovePromotion,
    buildSubmitPayload,
    autoPromotionNames,
    autoDiscountAmount:
      !appliedPromotion && !isManualPrice
        ? (preCalculatedDiscount?.totalDiscount ?? 0)
        : 0,
  };
}
