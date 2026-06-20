/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { buildBookingPromotionInput } from './build-booking-promotion-input';
import { mapStaffBookingInputFromFormState } from './map-staff-booking-input';
import {
  parseManualBookingAmount,
  resolveBookingDisplayTotal,
  sumSlotPrices,
} from './staff-booking-pricing';
import { PaymentMethod } from '@/graphql/generated';

const slots = [
  {
    courtId: 'c1',
    courtName: 'Sân 1',
    startTime: '08:00',
    endTime: '09:00',
    price: 100_000,
    isPeakHour: false,
  },
];

describe('buildBookingPromotionInput', () => {
  it('builds ApplyPromotionInput from slots', () => {
    const input = buildBookingPromotionInput({
      venueId: 'v1',
      bookingDate: '2026-06-01',
      slots,
      totalAmount: 100_000,
      slotDurationMinutes: 60,
      userId: 'u1',
      isRecurring: true,
    });
    expect(input.venueId).toBe('v1');
    expect(input.courtIds).toEqual(['c1']);
    expect(input.isRecurring).toBe(true);
    expect(input.slotCount).toBe(1);
  });
});

describe('staff-booking-pricing', () => {
  it('sums slot prices', () => {
    expect(sumSlotPrices(slots)).toBe(100_000);
  });

  it('parses manual amount', () => {
    expect(parseManualBookingAmount('150000').ok).toBe(true);
    expect(parseManualBookingAmount('').ok).toBe(false);
  });

  it('uses discount when not manual', () => {
    const result = resolveBookingDisplayTotal({
      subtotal: 100_000,
      isManualPrice: false,
      manualAmount: '',
      discount: { totalDiscount: 10_000, finalAmount: 90_000 },
    });
    expect(result.finalAmount).toBe(90_000);
    expect(result.discountAmount).toBe(10_000);
  });

  it('uses manual amount when enabled', () => {
    const result = resolveBookingDisplayTotal({
      subtotal: 100_000,
      isManualPrice: true,
      manualAmount: '80000',
      discount: null,
    });
    expect(result.finalAmount).toBe(80_000);
  });
});

describe('mapStaffBookingInputFromFormState', () => {
  it('maps promo code when not manual', () => {
    const input = mapStaffBookingInputFromFormState({
      venueId: 'v1',
      date: '2026-06-01',
      slots,
      customerName: 'A',
      customerPhone: '0901234567',
      internalNote: '',
      paymentMethod: PaymentMethod.Cash,
      isManualPrice: false,
      manualAmount: '',
      manualPriceNote: '',
      appliedPromoCode: 'SALE10',
    });
    expect(input.discountCode).toBe('SALE10');
    expect(input.isManualPrice).toBeUndefined();
  });

  it('maps manual price without promo', () => {
    const input = mapStaffBookingInputFromFormState({
      venueId: 'v1',
      date: '2026-06-01',
      slots,
      customerName: 'A',
      customerPhone: '0901234567',
      internalNote: 'note',
      paymentMethod: PaymentMethod.Cash,
      isManualPrice: true,
      manualAmount: '50000',
      manualPriceNote: 'deal',
      appliedPromoCode: 'SALE10',
    });
    expect(input.isManualPrice).toBe(true);
    expect(input.manualFinalAmount).toBe(50_000);
    expect(input.discountCode).toBeUndefined();
  });
});
