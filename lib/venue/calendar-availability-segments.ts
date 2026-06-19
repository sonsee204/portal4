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
  type CalendarBookingSegment,
} from './calendar-booking-segments';
import type {
  StaffAvailabilityCourt,
  StaffAvailabilitySlot,
} from './calendar-staff-booking';

export type AvailabilityBookingGroup = {
  kind: 'bookingGroup';
  bookingId: string;
  bookingStatus?: string;
  customerName?: string;
  customerPhone?: string;
  isRecurring?: boolean;
  slots: StaffAvailabilitySlot[];
  startIndex: number;
};

export type AvailabilityOpenSlot = {
  kind: 'slot';
  slot: StaffAvailabilitySlot;
  index: number;
};

export type AvailabilityRowSegment = AvailabilityBookingGroup | AvailabilityOpenSlot;

function areConsecutiveSlots(
  previous: StaffAvailabilitySlot,
  next: StaffAvailabilitySlot,
): boolean {
  return previous.endTime === next.startTime;
}

/** Occupied slot identity — confirmed bookings use bookingId; holds use holdBookingId. */
export function getOccupiedBookingId(
  slot: StaffAvailabilitySlot,
): string | null {
  if (slot.bookingId) {
    return slot.bookingId;
  }
  if (slot.isHold && slot.holdBookingId) {
    return slot.holdBookingId;
  }
  return null;
}

function resolveOccupiedBookingStatus(slot: StaffAvailabilitySlot): string {
  if (slot.bookingStatus?.trim()) {
    return slot.bookingStatus.trim();
  }
  if (slot.isHold) {
    return 'HOLD_ACTIVE';
  }
  return 'CONFIRMED';
}

function slotsShareSameOccupancy(
  left: StaffAvailabilitySlot,
  right: StaffAvailabilitySlot,
): boolean {
  const leftId = getOccupiedBookingId(left);
  const rightId = getOccupiedBookingId(right);
  return leftId != null && leftId === rightId;
}

/**
 * Groups consecutive availability slots per court row — aligned with mobile
 * `buildCourtRowSegments` (staff court booking grid).
 */
export function buildCourtRowSegments(
  slots: StaffAvailabilitySlot[],
): AvailabilityRowSegment[] {
  const segments: AvailabilityRowSegment[] = [];
  let index = 0;

  while (index < slots.length) {
    const slot = slots[index];
    if (!slot) {
      index += 1;
      continue;
    }

    const occupiedId = getOccupiedBookingId(slot);
    if (occupiedId) {
      const groupSlots: StaffAvailabilitySlot[] = [slot];
      let nextIndex = index + 1;

      while (nextIndex < slots.length) {
        const nextSlot = slots[nextIndex];
        const previousSlot = slots[nextIndex - 1];
        if (!nextSlot || !previousSlot) {
          break;
        }
        if (
          !slotsShareSameOccupancy(slot, nextSlot) ||
          !areConsecutiveSlots(previousSlot, nextSlot)
        ) {
          break;
        }
        groupSlots.push(nextSlot);
        nextIndex += 1;
      }

      segments.push({
        kind: 'bookingGroup',
        bookingId: occupiedId,
        bookingStatus: resolveOccupiedBookingStatus(slot),
        ...(slot.customerName != null ? { customerName: slot.customerName } : {}),
        ...(slot.customerPhone != null
          ? { customerPhone: slot.customerPhone }
          : {}),
        ...(slot.isRecurring ? { isRecurring: true } : {}),
        slots: groupSlots,
        startIndex: index,
      });
      index = nextIndex;
      continue;
    }

    segments.push({ kind: 'slot', slot, index });
    index += 1;
  }

  return segments;
}

/** Builds calendar overlay segments from `myVenueAvailability` courts (single source of truth). */
export function buildCalendarSegmentsFromAvailability(
  courts: StaffAvailabilityCourt[],
): CalendarBookingSegment[] {
  const segments: CalendarBookingSegment[] = [];

  for (const court of courts) {
    for (const rowSegment of buildCourtRowSegments(court.slots)) {
      if (rowSegment.kind !== 'bookingGroup') {
        continue;
      }

      const groupSlots = rowSegment.slots;
      const firstSlot = groupSlots[0];
      const lastSlot = groupSlots[groupSlots.length - 1];
      if (!firstSlot || !lastSlot) {
        continue;
      }

      const startTime = firstSlot.startTime;
      const endTime = lastSlot.endTime;

      segments.push({
        id: `${rowSegment.bookingId}-${court.courtName}-${startTime}`,
        bookingId: rowSegment.bookingId,
        court: court.courtName,
        startTime,
        endTime,
        startMinutes: parseTimeToMinutes(startTime),
        endMinutes: parseTimeToMinutes(endTime),
        slotCount: groupSlots.length,
        status: rowSegment.bookingStatus ?? 'CONFIRMED',
        ...(rowSegment.customerName != null
          ? { customerName: rowSegment.customerName }
          : {}),
        ...(rowSegment.customerPhone != null
          ? { customerPhone: rowSegment.customerPhone }
          : {}),
        isRecurring: rowSegment.isRecurring === true,
      });
    }
  }

  return segments;
}
