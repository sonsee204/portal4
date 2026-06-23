/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * Cross-ref: nalee-sports-mobile StaffBookingFormModal promotionInput
 */

import type { ApplyPromotionInput } from '@/graphql/generated';

export interface BookingPromotionSlot {
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  price: number;
  isPeakHour?: boolean;
}

export interface BuildBookingPromotionInputParams {
  venueId: string;
  bookingDate: string;
  slots: BookingPromotionSlot[];
  totalAmount: number;
  slotDurationMinutes: number;
  userId?: string;
  promoCode?: string | null;
  isRecurring?: boolean;
}

export function buildBookingPromotionInput(
  params: BuildBookingPromotionInputParams,
): ApplyPromotionInput {
  const courtIds = [...new Set(params.slots.map((slot) => slot.courtId))];
  const timeSlots = params.slots.map((slot) => slot.startTime);

  return {
    venueId: params.venueId,
    courtIds,
    bookingDate: params.bookingDate,
    timeSlots,
    totalAmount: params.totalAmount,
    slotCount: params.slots.length,
    slotDurationMinutes: params.slotDurationMinutes,
    ...(params.userId ? { userId: params.userId } : {}),
    ...(params.promoCode ? { promoCode: params.promoCode } : {}),
    ...(params.isRecurring ? { isRecurring: true } : {}),
    slots: params.slots.map((slot) => ({
      courtId: slot.courtId,
      startTime: slot.startTime,
      endTime: slot.endTime,
      price: slot.price,
    })),
  };
}
