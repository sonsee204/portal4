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

import { describe, expect, it } from 'vitest';
import {
  buildCalendarSegmentsFromAvailability,
  buildCourtRowSegments,
  getOccupiedBookingId,
} from './calendar-availability-segments';
import type { StaffAvailabilitySlot } from './calendar-staff-booking';

function slot(
  overrides: Partial<StaffAvailabilitySlot> & Pick<StaffAvailabilitySlot, 'startTime' | 'endTime'>,
): StaffAvailabilitySlot {
  return {
    price: 100_000,
    isPeakHour: false,
    isAvailable: true,
    isPast: false,
    ...overrides,
  };
}

describe('getOccupiedBookingId', () => {
  it('prefers bookingId over hold', () => {
    expect(
      getOccupiedBookingId(
        slot({
          startTime: '18:00',
          endTime: '18:30',
          bookingId: 'b1',
          isHold: true,
          holdBookingId: 'h1',
        }),
      ),
    ).toBe('b1');
  });

  it('uses holdBookingId when slot is on hold', () => {
    expect(
      getOccupiedBookingId(
        slot({
          startTime: '18:00',
          endTime: '18:30',
          isAvailable: false,
          isHold: true,
          holdBookingId: 'hold-1',
        }),
      ),
    ).toBe('hold-1');
  });
});

describe('buildCourtRowSegments', () => {
  it('merges consecutive slots for the same booking', () => {
    const segments = buildCourtRowSegments([
      slot({
        startTime: '17:00',
        endTime: '17:30',
        isAvailable: false,
        bookingId: 'b1',
        bookingStatus: 'CONFIRMED',
        customerName: 'Huynh Vu',
      }),
      slot({
        startTime: '17:30',
        endTime: '18:00',
        isAvailable: false,
        bookingId: 'b1',
        bookingStatus: 'CONFIRMED',
        customerName: 'Huynh Vu',
      }),
      slot({
        startTime: '18:00',
        endTime: '18:30',
        isAvailable: true,
      }),
    ]);

    expect(segments).toHaveLength(2);
    expect(segments[0]).toMatchObject({
      kind: 'bookingGroup',
      bookingId: 'b1',
      customerName: 'Huynh Vu',
    });
    expect(
      segments[0]?.kind === 'bookingGroup' ? segments[0].slots.length : 0,
    ).toBe(2);
    expect(segments[1]).toMatchObject({ kind: 'slot' });
  });

  it('groups hold slots by holdBookingId', () => {
    const segments = buildCourtRowSegments([
      slot({
        startTime: '19:00',
        endTime: '19:30',
        isAvailable: false,
        isHold: true,
        holdBookingId: 'hold-9',
      }),
      slot({
        startTime: '19:30',
        endTime: '20:00',
        isAvailable: false,
        isHold: true,
        holdBookingId: 'hold-9',
      }),
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({
      kind: 'bookingGroup',
      bookingId: 'hold-9',
      bookingStatus: 'HOLD_ACTIVE',
    });
  });
});

describe('buildCalendarSegmentsFromAvailability', () => {
  it('maps availability booking groups to calendar segments per court', () => {
    const segments = buildCalendarSegmentsFromAvailability([
      {
        courtId: 'c1',
        courtName: 'Sân 1',
        slots: [
          slot({
            startTime: '19:00',
            endTime: '19:30',
            isAvailable: false,
            bookingId: 'b1',
            bookingStatus: 'confirmed',
            customerName: 'Khách A',
            isRecurring: true,
          }),
          slot({
            startTime: '19:30',
            endTime: '20:00',
            isAvailable: false,
            bookingId: 'b1',
            bookingStatus: 'confirmed',
            customerName: 'Khách A',
            isRecurring: true,
          }),
        ],
      },
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0]).toMatchObject({
      bookingId: 'b1',
      court: 'Sân 1',
      startTime: '19:00',
      endTime: '20:00',
      slotCount: 2,
      customerName: 'Khách A',
      isRecurring: true,
    });
  });
});
