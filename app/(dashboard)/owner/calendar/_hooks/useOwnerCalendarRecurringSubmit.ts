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
import type { useCreateStaffRecurringBooking } from '@/hooks/owner';
import type { BookingPromotionSlot } from '@/lib/booking/build-booking-promotion-input';
import { mapStaffRecurringBookingInputFromFormState } from '@/lib/booking/map-staff-recurring-booking-input';
import {
  buildRecurringAvailabilityCheckInput,
  type RecurringAvailabilityResult,
} from '@/lib/booking/recurring-availability-check';
import type { useOwnerCalendarRecurringConfirmForm } from './useOwnerCalendarRecurringConfirmForm';
import type { OwnerCalendarPageData } from './useOwnerCalendarPageData';

interface UseOwnerCalendarRecurringSubmitParams {
  data: OwnerCalendarPageData;
  availabilityResult: RecurringAvailabilityResult | null;
  selectedDays: number[];
  primaryDayOfWeek: number;
  slotsByDay: Map<number, BookingPromotionSlot[]>;
  anchorSlots: BookingPromotionSlot[];
  durationMonths: number;
  excludeDates: string[];
  confirmForm: ReturnType<typeof useOwnerCalendarRecurringConfirmForm>;
  createStaffRecurringBooking: ReturnType<
    typeof useCreateStaffRecurringBooking
  >['createStaffRecurringBooking'];
}

export function useOwnerCalendarRecurringSubmit({
  data,
  availabilityResult,
  selectedDays,
  primaryDayOfWeek,
  slotsByDay,
  anchorSlots,
  durationMonths,
  excludeDates,
  confirmForm,
  createStaffRecurringBooking,
}: UseOwnerCalendarRecurringSubmitParams) {
  return useCallback(async () => {
    if (!data.selectedVenueId || !availabilityResult) return;

    const { slots, daySchedules } = buildRecurringAvailabilityCheckInput({
      selectedDays,
      primaryDayOfWeek,
      slotsByDay,
      anchorSlots,
    });

    const input = mapStaffRecurringBookingInputFromFormState({
      venueId: data.selectedVenueId,
      startDate: data.dateStr,
      durationMonths,
      ...(slots ? { slots } : {}),
      ...(daySchedules ? { daySchedules } : {}),
      ...(confirmForm.selectedUser?._id
        ? { customerId: confirmForm.selectedUser._id }
        : {}),
      customerName: confirmForm.customerName.trim(),
      customerPhone: confirmForm.normalizedPhone,
      internalNote: confirmForm.internalNote,
      paymentMethod: confirmForm.paymentMethod,
      excludeDates,
      isManualPrice: confirmForm.isManualPrice,
      manualAmount: confirmForm.manualAmount,
      manualPriceNote: confirmForm.manualPriceNote,
      appliedPromoCode: confirmForm.appliedPromotion?.code ?? null,
    });

    const result = await createStaffRecurringBooking(input);
    if (result) {
      data.setShowRecurringWizard(false);
      data.setSelectedSlots([]);
      await data.refetchAvailability();
      if (result.booking?._id) {
        data.setSelectedBookingId(result.booking._id);
      }
    }
  }, [
    data,
    availabilityResult,
    selectedDays,
    primaryDayOfWeek,
    slotsByDay,
    anchorSlots,
    durationMonths,
    excludeDates,
    confirmForm,
    createStaffRecurringBooking,
  ]);
}
