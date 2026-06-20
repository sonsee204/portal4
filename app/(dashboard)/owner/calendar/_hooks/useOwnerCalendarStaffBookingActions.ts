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
import type { StaffBookingFormSubmitPayload } from '@/components/organisms/VenueCalendar/StaffBookingFormModal';
import { mapStaffBookingInput } from '@/lib/booking/map-staff-booking-input';
import { useCreateStaffBooking } from '@/hooks/owner';
import type { OwnerCalendarPageData } from './useOwnerCalendarPageData';

export function useOwnerCalendarStaffBookingActions(
  data: OwnerCalendarPageData,
) {
  const { createStaffBooking, loading: creatingStaffBooking } =
    useCreateStaffBooking(data.selectedVenueId);

  const handleStaffBookingConfirm = useCallback(
    async (payload: StaffBookingFormSubmitPayload) => {
      if (!data.selectedVenueId || data.selectedSlots.length === 0) return;

      const input = mapStaffBookingInput({
        venueId: data.selectedVenueId,
        date: data.dateStr,
        slots: data.selectedSlots,
        ...(payload.customerId ? { customerId: payload.customerId } : {}),
        customerName: payload.customerName,
        customerPhone: payload.customerPhone,
        ...(payload.internalNote ? { internalNote: payload.internalNote } : {}),
        paymentMethod: payload.paymentMethod,
        ...(payload.discountCode ? { discountCode: payload.discountCode } : {}),
        ...(payload.isManualPrice ? { isManualPrice: true } : {}),
        ...(payload.manualFinalAmount !== undefined
          ? { manualFinalAmount: payload.manualFinalAmount }
          : {}),
        ...(payload.manualPriceNote
          ? { manualPriceNote: payload.manualPriceNote }
          : {}),
      });

      await createStaffBooking(input);

      data.setShowStaffBookingForm(false);
      data.setSelectedSlots([]);
      await data.refetchAvailability();
    },
    [data, createStaffBooking],
  );

  return {
    handleStaffBookingConfirm,
    creatingStaffBooking,
  };
}
