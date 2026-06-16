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
  buildCalendarBookingSegments,
  getBookingSlotColorScheme,
  isCalendarSegmentClickable,
  isPendingBookingStatus,
  parseTimeToMinutes,
  resolveCalendarSegmentKind,
  segmentPositionInHourGrid,
  VENUE_CALENDAR_VISIBLE_STATUSES,
} from './calendar-booking-segments';

describe('VENUE_CALENDAR_VISIBLE_STATUSES', () => {
  it('includes only confirmed and completed bookings', () => {
    expect(VENUE_CALENDAR_VISIBLE_STATUSES).toEqual(['CONFIRMED', 'COMPLETED']);
    expect(VENUE_CALENDAR_VISIBLE_STATUSES).not.toContain('REJECTED');
    expect(VENUE_CALENDAR_VISIBLE_STATUSES).not.toContain('CANCELLED');
    expect(VENUE_CALENDAR_VISIBLE_STATUSES).not.toContain('EXPIRED');
    expect(VENUE_CALENDAR_VISIBLE_STATUSES).not.toContain('PENDING');
  });
});

describe('isPendingBookingStatus', () => {
  it('recognizes hold statuses from GraphQL enum', () => {
    expect(isPendingBookingStatus('HOLD_ACTIVE')).toBe(true);
    expect(isPendingBookingStatus('HOLD_PENDING')).toBe(true);
  });
});

describe('resolveCalendarSegmentKind', () => {
  it('classifies single confirmed bookings', () => {
    expect(
      resolveCalendarSegmentKind({ status: 'CONFIRMED', isRecurring: false }),
    ).toBe('single');
  });

  it('classifies recurring confirmed bookings', () => {
    expect(
      resolveCalendarSegmentKind({ status: 'CONFIRMED', isRecurring: true }),
    ).toBe('recurring');
  });
});

describe('isCalendarSegmentClickable', () => {
  it('allows interaction only for confirmed calendar bookings', () => {
    expect(isCalendarSegmentClickable('CONFIRMED')).toBe(true);
    expect(isCalendarSegmentClickable('COMPLETED')).toBe(true);
    expect(isCalendarSegmentClickable('HOLD_ACTIVE')).toBe(false);
    expect(isCalendarSegmentClickable('REJECTED')).toBe(false);
    expect(isCalendarSegmentClickable('EXPIRED')).toBe(false);
  });
});

describe('buildCalendarBookingSegments', () => {
  it('merges consecutive slots for the same booking on one court', () => {
    const segments = buildCalendarBookingSegments([
      {
        _id: 'b1',
        status: 'CONFIRMED',
        customer: { displayName: 'Huynh Vu', phone: '0901234567' },
        slots: [
          {
            courtName: 'Sân 1',
            startTime: '17:00',
            endTime: '18:00',
          },
          {
            courtName: 'Sân 1',
            startTime: '18:00',
            endTime: '19:00',
          },
        ],
      },
    ]);

    expect(segments).toHaveLength(1);
    expect(segments[0]?.slotCount).toBe(2);
    expect(segments[0]?.startTime).toBe('17:00');
    expect(segments[0]?.endTime).toBe('19:00');
    expect(segments[0]?.customerPhone).toBe('0901234567');
  });

  it('marks recurring bookings from parentBookingId', () => {
    const segments = buildCalendarBookingSegments([
      {
        _id: 'child-1',
        status: 'CONFIRMED',
        parentBookingId: 'master-1',
        slots: [
          {
            courtName: 'Sân 2',
            startTime: '21:00',
            endTime: '22:00',
          },
        ],
      },
    ]);

    expect(segments[0]?.isRecurring).toBe(true);
    expect(getBookingSlotColorScheme('child-1', 'CONFIRMED', true).variant).toBe(
      'recurring',
    );
  });
});

describe('parseTimeToMinutes', () => {
  it('parses HH:mm', () => {
    expect(parseTimeToMinutes('17:30')).toBe(17 * 60 + 30);
  });

  it('parses HH:mm:ss', () => {
    expect(parseTimeToMinutes('18:30:00')).toBe(18 * 60 + 30);
  });

  it('parses ISO datetime to local clock minutes', () => {
    const minutes = parseTimeToMinutes('2026-06-16T18:30:00');
    expect(minutes).toBe(18 * 60 + 30);
  });
});

describe('segmentPositionInHourGrid', () => {
  const hourCellWidth = 144;

  it('renders 30-minute slots at half an hour column width', () => {
    const segment = {
      startMinutes: parseTimeToMinutes('18:30'),
      endMinutes: parseTimeToMinutes('19:00'),
    };

    const { left, width } = segmentPositionInHourGrid(
      segment as never,
      18,
      hourCellWidth,
    );

    expect(left).toBe(74);
    expect(width).toBe(68);
  });

  it('does not overlap consecutive 30-minute slots on the same court', () => {
    const first = segmentPositionInHourGrid(
      {
        startMinutes: parseTimeToMinutes('18:30'),
        endMinutes: parseTimeToMinutes('19:00'),
      } as never,
      18,
      hourCellWidth,
    );
    const second = segmentPositionInHourGrid(
      {
        startMinutes: parseTimeToMinutes('19:30'),
        endMinutes: parseTimeToMinutes('20:00'),
      } as never,
      18,
      hourCellWidth,
    );

    expect(first.left + first.width).toBeLessThanOrEqual(second.left);
  });
});
