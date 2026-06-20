/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile useCourtBookingStaffBooking.ts
 */

import type {
  CreateStaffBookingInput,
  PaymentMethod,
} from '@/graphql/generated';
import type { BookingPromotionSlot } from './build-booking-promotion-input';
import { parseManualBookingAmount } from './staff-booking-pricing';

export interface StaffBookingFormValues {
  venueId: string;
  date: string;
  slots: BookingPromotionSlot[];
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

export function mapStaffBookingInput(
  values: StaffBookingFormValues,
): CreateStaffBookingInput {
  const isManualPrice = values.isManualPrice === true;

  return {
    venueId: values.venueId,
    date: values.date,
    slots: values.slots.map((slot) => ({
      courtId: slot.courtId,
      courtName: slot.courtName,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
      isPeakHour: slot.isPeakHour ?? false,
    })),
    ...(values.customerId ? { customerId: values.customerId } : {}),
    customerInfo: {
      name: values.customerName.trim(),
      phone: values.customerPhone.trim(),
    },
    ...(values.internalNote?.trim()
      ? { internalNote: values.internalNote.trim() }
      : {}),
    paymentMethod: values.paymentMethod,
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

export function mapStaffBookingInputFromFormState(params: {
  venueId: string;
  date: string;
  slots: BookingPromotionSlot[];
  customerId?: string;
  customerName: string;
  customerPhone: string;
  internalNote: string;
  paymentMethod: PaymentMethod;
  isManualPrice: boolean;
  manualAmount: string;
  manualPriceNote: string;
  appliedPromoCode?: string | null;
}): CreateStaffBookingInput {
  const manualParsed = params.isManualPrice
    ? parseManualBookingAmount(params.manualAmount)
    : null;

  return mapStaffBookingInput({
    venueId: params.venueId,
    date: params.date,
    slots: params.slots,
    ...(params.customerId ? { customerId: params.customerId } : {}),
    customerName: params.customerName,
    customerPhone: params.customerPhone,
    ...(params.internalNote.trim()
      ? { internalNote: params.internalNote.trim() }
      : {}),
    paymentMethod: params.paymentMethod,
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
