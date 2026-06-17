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

import {
  parseTimeToMinutes,
  segmentPositionInHourGrid,
  type CalendarBookingSegment,
} from './calendar-booking-segments';

export type StaffAvailabilitySlot = {
  startTime: string;
  endTime: string;
  price: number;
  isPeakHour: boolean;
  isAvailable: boolean;
  isPast: boolean;
  isHold?: boolean | null;
  holdBookingId?: string | null;
  bookingId?: string | null;
  bookingStatus?: string | null;
};

export type StaffAvailabilityCourt = {
  courtId: string;
  courtName: string;
  slots: StaffAvailabilitySlot[];
};

export type StaffSelectedSlot = {
  courtId: string;
  courtName: string;
  startTime: string;
  endTime: string;
  price: number;
  isPeakHour: boolean;
};

export function buildStaffSlotKey(courtId: string, startTime: string): string {
  return `${courtId}:${startTime}`;
}

export function isStaffSlotSelectable(slot: StaffAvailabilitySlot): boolean {
  return slot.isAvailable && !slot.bookingId && !slot.isHold;
}

export function slotPositionInHourGrid(
  startTime: string,
  endTime: string,
  gridStartHour: number,
  hourCellWidth: number,
): { left: number; width: number } {
  const pseudoSegment = {
    startMinutes: parseTimeToMinutes(startTime),
    endMinutes: parseTimeToMinutes(endTime),
  } as CalendarBookingSegment;

  return segmentPositionInHourGrid(
    pseudoSegment,
    gridStartHour,
    hourCellWidth,
  );
}

export function sumStaffSelectedSlots(slots: StaffSelectedSlot[]): number {
  return slots.reduce((total, slot) => total + slot.price, 0);
}
