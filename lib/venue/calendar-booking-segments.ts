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

import { BookingStatus } from '@/graphql/generated';

/** Only confirmed (active or completed) bookings appear on the owner calendar. */
export const VENUE_CALENDAR_VISIBLE_STATUSES: BookingStatus[] = [
  BookingStatus.Confirmed,
  BookingStatus.Completed,
];

export type CalendarBookingSlot = {
  courtName: string;
  startTime: string;
  endTime: string;
};

export type CalendarBookingInput = {
  _id: string;
  status: string;
  isRecurring?: boolean | null;
  parentBookingId?: string | null;
  customer?: {
    displayName?: string | null;
    phone?: string | null;
  } | null;
  slots?: CalendarBookingSlot[] | null;
};

export type CalendarBookingSegment = {
  id: string;
  bookingId: string;
  court: string;
  startTime: string;
  endTime: string;
  startMinutes: number;
  endMinutes: number;
  slotCount: number;
  status: string;
  customerName?: string;
  customerPhone?: string;
  isRecurring: boolean;
  isUnpaid?: boolean;
  hasPromotion?: boolean;
};

export type BookingSlotColorScheme = {
  bgClass: string;
  textClass: string;
  borderClass: string;
  barClass: string;
  headerBgClass: string;
  headerTextClass: string;
  variant: 'expired' | 'recurring' | 'single' | 'pending' | 'unpaid';
};

const CLOCK_TIME = /^(\d{1,2}):(\d{2})(?::(\d{2}))?$/;

/** Minimum rendered width so short slots stay clickable on the hour grid. */
const MIN_SEGMENT_WIDTH_PX = 12;

export function parseTimeToMinutes(time: string): number {
  const trimmed = time.trim();
  const clockMatch = CLOCK_TIME.exec(trimmed);
  if (clockMatch) {
    const hours = Number.parseInt(clockMatch[1] ?? '0', 10);
    const minutes = Number.parseInt(clockMatch[2] ?? '0', 10);
    return hours * 60 + minutes;
  }

  const fromInstant = new Date(trimmed);
  if (!Number.isNaN(fromInstant.getTime())) {
    return fromInstant.getHours() * 60 + fromInstant.getMinutes();
  }

  return 0;
}

export function normalizeBookingStatus(status: string | undefined): string {
  return status?.trim().toLowerCase() ?? '';
}

export function isConfirmedBookingStatus(status: string | undefined): boolean {
  const normalized = normalizeBookingStatus(status);
  return normalized === 'confirmed' || normalized === 'completed';
}

export function isPendingBookingStatus(status: string | undefined): boolean {
  const normalized = normalizeBookingStatus(status);
  return (
    normalized === 'pending' ||
    normalized === 'hold' ||
    normalized === 'hold_pending' ||
    normalized === 'hold_active'
  );
}

export type CalendarSegmentKind =
  | 'recurring'
  | 'single'
  | 'pending'
  | 'no_show'
  | 'rejected'
  | 'inactive';

export function resolveCalendarSegmentKind(
  segment: Pick<CalendarBookingSegment, 'status' | 'isRecurring'>,
): CalendarSegmentKind {
  if (segment.isRecurring && isConfirmedBookingStatus(segment.status)) {
    return 'recurring';
  }
  if (isPendingBookingStatus(segment.status)) {
    return 'pending';
  }
  if (isConfirmedBookingStatus(segment.status)) {
    return 'single';
  }
  if (normalizeBookingStatus(segment.status) === 'no_show') {
    return 'no_show';
  }
  if (normalizeBookingStatus(segment.status) === 'rejected') {
    return 'rejected';
  }
  return 'inactive';
}

export function isCalendarSegmentClickable(status: string | undefined): boolean {
  const normalized = normalizeBookingStatus(status);
  return (
    isConfirmedBookingStatus(status) ||
    normalized === 'hold_active' ||
    normalized === 'expired'
  );
}

export function getBookingSlotColorScheme(input: {
  bookingStatus: string | undefined;
  isRecurring?: boolean;
  isUnpaid?: boolean;
}): BookingSlotColorScheme {
  const { bookingStatus, isRecurring, isUnpaid } = input;
  const normalized = normalizeBookingStatus(bookingStatus);

  if (normalized === 'expired' || normalized === 'cancelled') {
    return {
      bgClass: 'bg-gray-400/15',
      textClass: 'text-gray-500',
      borderClass: 'border-gray-400',
      barClass: 'bg-gray-400',
      headerBgClass: 'bg-gray-400/20',
      headerTextClass: 'text-gray-500',
      variant: 'expired',
    };
  }

  if (isPendingBookingStatus(bookingStatus)) {
    return {
      bgClass: 'bg-amber-500/20',
      textClass: 'text-amber-700',
      borderClass: 'border-amber-500',
      barClass: 'bg-amber-500',
      headerBgClass: 'bg-amber-500/25',
      headerTextClass: 'text-amber-700',
      variant: 'pending',
    };
  }

  if (normalized === 'no_show' || normalized === 'rejected') {
    return {
      bgClass: 'bg-gray-400/15',
      textClass: 'text-gray-500',
      borderClass: 'border-gray-400',
      barClass: 'bg-gray-400',
      headerBgClass: 'bg-gray-400/20',
      headerTextClass: 'text-gray-500',
      variant: 'expired',
    };
  }

  const isConfirmed = isConfirmedBookingStatus(bookingStatus);

  if (isUnpaid && isConfirmed) {
    return {
      bgClass: 'bg-red-500/15',
      textClass: 'text-red-700',
      borderClass: 'border-red-500',
      barClass: 'bg-red-500',
      headerBgClass: 'bg-red-500',
      headerTextClass: 'text-white',
      variant: 'unpaid',
    };
  }

  if (isRecurring && isConfirmed) {
    return {
      bgClass: 'bg-green-500/15',
      textClass: 'text-green-700',
      borderClass: 'border-green-600',
      barClass: 'bg-green-600',
      headerBgClass: 'bg-green-600',
      headerTextClass: 'text-white',
      variant: 'recurring',
    };
  }

  return {
    bgClass: 'bg-primary/15',
    textClass: 'text-primary',
    borderClass: 'border-primary',
    barClass: 'bg-primary',
    headerBgClass: 'bg-primary/20',
    headerTextClass: 'text-primary',
    variant: isConfirmed ? 'single' : 'expired',
  };
}

function areConsecutiveSlots(
  previous: CalendarBookingSlot,
  next: CalendarBookingSlot,
): boolean {
  return (
    previous.courtName === next.courtName && previous.endTime === next.startTime
  );
}

export function buildCalendarBookingSegments(
  bookings: CalendarBookingInput[],
): CalendarBookingSegment[] {
  const segments: CalendarBookingSegment[] = [];

  for (const booking of bookings) {
    const isRecurring =
      booking.isRecurring === true || Boolean(booking.parentBookingId);
    const customerName = booking.customer?.displayName?.trim() || undefined;
    const customerPhone = booking.customer?.phone?.trim() || undefined;
    const slotsByCourt = new Map<string, CalendarBookingSlot[]>();

    for (const slot of booking.slots ?? []) {
      if (!slot.courtName) continue;
      const courtSlots = slotsByCourt.get(slot.courtName) ?? [];
      courtSlots.push(slot);
      slotsByCourt.set(slot.courtName, courtSlots);
    }

    for (const [court, courtSlots] of slotsByCourt) {
      const sorted = [...courtSlots].sort((a, b) =>
        a.startTime.localeCompare(b.startTime),
      );

      let index = 0;
      while (index < sorted.length) {
        const group: CalendarBookingSlot[] = [sorted[index]!];
        let nextIndex = index + 1;

        while (nextIndex < sorted.length) {
          const previous = sorted[nextIndex - 1];
          const next = sorted[nextIndex];
          if (!previous || !next || !areConsecutiveSlots(previous, next)) {
            break;
          }
          group.push(next);
          nextIndex += 1;
        }

        const startTime = group[0]!.startTime;
        const endTime = group[group.length - 1]!.endTime;

        segments.push({
          id: `${booking._id}-${court}-${startTime}`,
          bookingId: booking._id,
          court,
          startTime,
          endTime,
          startMinutes: parseTimeToMinutes(startTime),
          endMinutes: parseTimeToMinutes(endTime),
          slotCount: group.length,
          status: booking.status,
          customerName,
          customerPhone,
          isRecurring,
        });

        index = nextIndex;
      }
    }
  }

  return segments;
}

export function segmentPositionInHourGrid(
  segment: CalendarBookingSegment,
  gridStartHour: number,
  hourCellWidth: number,
): { left: number; width: number } {
  const gridStartMinutes = gridStartHour * 60;
  const left =
    ((segment.startMinutes - gridStartMinutes) / 60) * hourCellWidth + 2;
  const width =
    ((segment.endMinutes - segment.startMinutes) / 60) * hourCellWidth - 4;

  return {
    left: Math.max(left, 2),
    width: Math.max(width, MIN_SEGMENT_WIDTH_PX),
  };
}
