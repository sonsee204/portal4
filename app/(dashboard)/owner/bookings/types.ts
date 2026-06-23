/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 *
 * This source code is the intellectual property of Lê Trung Hiếu.
 * Unauthorized copying, modification, distribution, or use of this code
 * is strictly prohibited without prior written consent.
 */

import { formatCompactBookingSlots } from '@/lib/venue/booking-slots-display';

export type OwnerBookingsTab = 'all' | 'hold' | 'recurring';

export type BookingConfirmAction =
  | 'confirm'
  | 'reject'
  | 'cancel'
  | 'complete'
  | 'checkIn'
  | 'markNoShow'
  | 'approveHold'
  | 'confirmHold'
  | 'rejectHold';

export interface BookingActionDialogState {
  action: BookingConfirmAction;
  bookingId: string;
  customerName: string;
}

export function formatBookingSlots(
  slots?: Array<{
    courtId?: string | null;
    courtName?: string | null;
    startTime?: string;
    endTime?: string;
    price?: number | null;
  }>,
): string {
  if (!slots?.length) return '—';

  return formatCompactBookingSlots(
    slots
      .filter(
        (slot): slot is NonNullable<(typeof slots)[number]> & {
          startTime: string;
          endTime: string;
        } => Boolean(slot.startTime && slot.endTime),
      )
      .map((slot) => ({
        courtId: slot.courtId,
        courtName: slot.courtName,
        startTime: slot.startTime,
        endTime: slot.endTime,
        price: slot.price,
      })),
  );
}

export function isBookingSessionPast(
  date: string,
  slots?: Array<{ endTime?: string }>,
): boolean {
  const firstSlot = slots?.[0];
  if (!firstSlot?.endTime) return false;

  const lastEndTime = slots!.reduce((latest, slot) => {
    return (slot.endTime ?? '') > latest ? (slot.endTime ?? '') : latest;
  }, firstSlot.endTime);

  const [hours, minutes] = lastEndTime.split(':').map(Number);
  const bookingEnd = new Date(date);
  bookingEnd.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return bookingEnd < new Date();
}

export function getBookingActionAvailability(
  status: string,
  date: string,
  slots?: Array<{ endTime?: string }>,
) {
  const isPast = isBookingSessionPast(date, slots);

  return {
    canConfirm: status === 'PENDING' && !isPast,
    canReject: status === 'PENDING' && !isPast,
    canApproveHold: status === 'HOLD_PENDING',
    canConfirmHold: status === 'HOLD_ACTIVE',
    canRejectHold: status === 'HOLD_PENDING' || status === 'HOLD_ACTIVE',
    canCancel:
      status === 'PENDING' ||
      status === 'CONFIRMED' ||
      status === 'HOLD_ACTIVE',
    canCheckIn: status === 'CONFIRMED' && !isPast,
    canComplete: status === 'CONFIRMED',
    canMarkNoShow: status === 'CONFIRMED' && isPast,
  };
}
