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
  formatCompactBookingSlots,
  formatGroupedBookingSlotsSummary,
  getUniqueCourtNames,
  groupBookingSlotsForDisplay,
} from './booking-slots-display';

describe('groupBookingSlotsForDisplay', () => {
  it('merges consecutive slots on the same court', () => {
    const groups = groupBookingSlotsForDisplay([
      {
        courtName: 'Sân 1',
        startTime: '19:30',
        endTime: '20:00',
        price: 75000,
      },
      {
        courtName: 'Sân 1',
        startTime: '20:00',
        endTime: '20:30',
        price: 75000,
      },
      {
        courtName: 'Sân 1',
        startTime: '20:30',
        endTime: '21:00',
        price: 75000,
      },
      {
        courtName: 'Sân 1',
        startTime: '21:00',
        endTime: '21:30',
        price: 75000,
      },
    ]);

    expect(groups).toHaveLength(1);
    expect(groups[0]).toMatchObject({
      courtName: 'Sân 1',
      startTime: '19:30',
      endTime: '21:30',
      slotCount: 4,
      totalPrice: 300000,
    });
  });

  it('keeps separate groups for different courts', () => {
    const groups = groupBookingSlotsForDisplay([
      {
        courtName: 'Sân 1',
        startTime: '19:00',
        endTime: '20:00',
        price: 100000,
      },
      {
        courtName: 'Sân 2',
        startTime: '19:00',
        endTime: '20:00',
        price: 120000,
      },
    ]);

    expect(groups).toHaveLength(2);
    expect(getUniqueCourtNames(groups)).toEqual(['Sân 1', 'Sân 2']);
  });
});

describe('formatCompactBookingSlots', () => {
  it('merges consecutive slots into one compact range', () => {
    expect(
      formatCompactBookingSlots([
        {
          courtName: 'Sân 1',
          startTime: '21:00',
          endTime: '21:30',
        },
        {
          courtName: 'Sân 1',
          startTime: '21:30',
          endTime: '22:00',
        },
        {
          courtName: 'Sân 1',
          startTime: '22:00',
          endTime: '22:30',
        },
      ]),
    ).toBe('21:00 – 22:30 ×3');
  });

  it('includes court names when multiple courts are booked', () => {
    expect(
      formatCompactBookingSlots([
        {
          courtName: 'Sân 1',
          startTime: '19:00',
          endTime: '20:00',
        },
        {
          courtName: 'Sân 2',
          startTime: '19:00',
          endTime: '20:00',
        },
      ]),
    ).toBe('Sân 1 19:00 – 20:00 • Sân 2 19:00 – 20:00');
  });
});

describe('formatGroupedBookingSlotsSummary', () => {
  it('formats merged ranges without repeating court names per slot', () => {
    const groups = groupBookingSlotsForDisplay([
      {
        courtName: 'Sân 1',
        startTime: '19:30',
        endTime: '20:00',
        price: 75000,
      },
      {
        courtName: 'Sân 1',
        startTime: '20:00',
        endTime: '20:30',
        price: 75000,
      },
    ]);

    expect(formatGroupedBookingSlotsSummary(groups)).toBe(
      'Sân 1: 19:30 – 20:30 (2 slot)',
    );
  });
});
