/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile submitRecurringBooking.ts (staff branch)
 */

import type {
  CreateStaffRecurringBookingInput,
  DayScheduleInput,
  PaymentMethod,
} from '@/graphql/generated';
import type { BookingPromotionSlot } from './build-booking-promotion-input';
import { parseManualBookingAmount } from './staff-booking-pricing';

export interface StaffRecurringBookingFormValues {
  venueId: string;
  startDate: string;
  durationMonths: number;
  slots?: BookingPromotionSlot[];
  daysOfWeek?: number[];
  daySchedules?: DayScheduleInput[];
  customerId?: string;
  customerName: string;
  customerPhone: string;
  internalNote?: string;
  paymentMethod: PaymentMethod;
  excludeDates?: string[];
  discountCode?: string;
  isManualPrice?: boolean;
  manualFinalAmount?: number;
  manualPriceNote?: string;
}

function mapSlots(slots: BookingPromotionSlot[]) {
  return slots.map((slot) => ({
    courtId: slot.courtId,
    courtName: slot.courtName,
    startTime: slot.startTime,
    endTime: slot.endTime,
    price: slot.price,
    isPeakHour: slot.isPeakHour ?? false,
  }));
}

export function mapStaffRecurringBookingInput(
  values: StaffRecurringBookingFormValues,
): CreateStaffRecurringBookingInput {
  const isManualPrice = values.isManualPrice === true;

  return {
    venueId: values.venueId,
    startDate: values.startDate,
    durationMonths: values.durationMonths,
    ...(values.slots?.length ? { slots: mapSlots(values.slots) } : {}),
    ...(values.daysOfWeek?.length ? { daysOfWeek: values.daysOfWeek } : {}),
    ...(values.daySchedules?.length
      ? { daySchedules: values.daySchedules }
      : {}),
    ...(values.customerId ? { customerId: values.customerId } : {}),
    customerInfo: {
      name: values.customerName.trim(),
      phone: values.customerPhone.trim(),
    },
    ...(values.internalNote?.trim()
      ? { internalNote: values.internalNote.trim() }
      : {}),
    paymentMethod: values.paymentMethod,
    ...(values.excludeDates?.length
      ? { excludeDates: values.excludeDates }
      : {}),
    ...(!isManualPrice && values.discountCode
      ? { discountCode: values.discountCode }
      : {}),
    ...(isManualPrice ? { isManualPrice: true } : {}),
    ...(isManualPrice && values.manualFinalAmount !== undefined
      ? { manualFinalAmount: values.manualFinalAmount }
      : {}),
    ...(isManualPrice && values.manualPriceNote?.trim()
      ? { manualPriceNote: values.manualPriceNote.trim() }
      : {}),
  };
}

export function mapStaffRecurringBookingInputFromFormState(params: {
  venueId: string;
  startDate: string;
  durationMonths: number;
  slots?: BookingPromotionSlot[];
  daysOfWeek?: number[];
  daySchedules?: DayScheduleInput[];
  customerId?: string;
  customerName: string;
  customerPhone: string;
  internalNote: string;
  paymentMethod: PaymentMethod;
  excludeDates: string[];
  isManualPrice: boolean;
  manualAmount: string;
  manualPriceNote: string;
  appliedPromoCode?: string | null;
}): CreateStaffRecurringBookingInput {
  const manualParsed = params.isManualPrice
    ? parseManualBookingAmount(params.manualAmount)
    : null;

  return mapStaffRecurringBookingInput({
    venueId: params.venueId,
    startDate: params.startDate,
    durationMonths: params.durationMonths,
    ...(params.slots?.length ? { slots: params.slots } : {}),
    ...(params.daysOfWeek?.length ? { daysOfWeek: params.daysOfWeek } : {}),
    ...(params.daySchedules?.length
      ? { daySchedules: params.daySchedules }
      : {}),
    ...(params.customerId ? { customerId: params.customerId } : {}),
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    ...(params.internalNote.trim()
      ? { internalNote: params.internalNote.trim() }
      : {}),
    paymentMethod: params.paymentMethod,
    ...(params.excludeDates.length ? { excludeDates: params.excludeDates } : {}),
    ...(params.isManualPrice ? { isManualPrice: true } : {}),
    ...(manualParsed?.ok
      ? { manualFinalAmount: manualParsed.amount }
      : {}),
    ...(params.isManualPrice && params.manualPriceNote.trim()
      ? { manualPriceNote: params.manualPriceNote.trim() }
      : {}),
    ...(!params.isManualPrice && params.appliedPromoCode
      ? { discountCode: params.appliedPromoCode }
      : {}),
  });
}
