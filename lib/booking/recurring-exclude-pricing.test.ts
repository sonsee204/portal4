/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import {
  computeEffectiveRecurringPricing,
  computeRecurringAutoPromoDiscount,
} from './recurring-exclude-pricing';
import type { RecurringAvailabilityResult } from './recurring-availability-check';

const availability: RecurringAvailabilityResult = {
  allAvailable: true,
  allDates: ['2026-06-20', '2026-06-27'],
  unavailableDates: [],
  availableDates: ['2026-06-20', '2026-06-27'],
  totalSessions: 2,
  sessionsPerWeek: 1,
  daysOfWeek: [6],
  pricePerSession: 100_000,
  totalPrice: 200_000,
  discountPercent: 10,
  discountAmount: 20_000,
  finalAmount: 180_000,
  recurringEnabled: true,
  dayPriceBreakdown: [{ dayOfWeek: 6, pricePerSession: 100_000, sessionCount: 2, totalPrice: 200_000 }],
};

describe('computeEffectiveRecurringPricing', () => {
  it('returns original pricing when no exclude dates', () => {
    const result = computeEffectiveRecurringPricing(availability, []);
    expect(result.effectiveSessions).toBe(2);
    expect(result.totalPrice).toBe(200_000);
    expect(result.packageFinalAmount).toBe(180_000);
  });

  it('recalculates package total when a session is excluded', () => {
    const result = computeEffectiveRecurringPricing(availability, ['2026-06-27']);
    expect(result.effectiveSessions).toBe(1);
    expect(result.totalPrice).toBe(100_000);
    expect(result.packageDiscountAmount).toBe(10_000);
    expect(result.packageFinalAmount).toBe(90_000);
  });
});

describe('computeRecurringAutoPromoDiscount', () => {
  const preCalculatedDiscount = {
    totalDiscount: 50_000,
    finalAmount: 130_000,
    appliedPromotions: [
      { name: 'KM lịch cố định', category: 'RECURRING', discountAmount: 30_000 },
      { name: 'KM giờ vàng', category: 'GENERAL', discountAmount: 20_000 },
    ],
  };

  it('keeps RECURRING promos when effective sessions remain eligible (8→7)', () => {
    const result = computeRecurringAutoPromoDiscount({
      preCalculatedDiscount,
      recurringPromoEligible: true,
      hasExcludedDates: true,
      originalTotalPrice: 800_000,
      effectiveTotalPrice: 700_000,
    });

    expect(result.autoPromotionNames).toEqual(['KM lịch cố định', 'KM giờ vàng']);
    expect(result.autoDiscountAmount).toBe(43_750);
  });

  it('drops RECURRING category promos when sessions fall below minimum (4→3)', () => {
    const result = computeRecurringAutoPromoDiscount({
      preCalculatedDiscount,
      recurringPromoEligible: false,
      hasExcludedDates: true,
      originalTotalPrice: 400_000,
      effectiveTotalPrice: 300_000,
    });

    expect(result.autoPromotionNames).toEqual(['KM giờ vàng']);
    expect(result.autoDiscountAmount).toBe(15_000);
  });
});
