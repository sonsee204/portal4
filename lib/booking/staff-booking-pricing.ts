/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

export interface BookingDiscountSnapshot {
  totalDiscount: number;
  finalAmount: number;
}

export function sumSlotPrices(
  slots: Array<{ price: number }>,
): number {
  return slots.reduce((sum, slot) => sum + slot.price, 0);
}

export function parseManualBookingAmount(raw: string): {
  ok: boolean;
  amount?: number;
  error?: string;
} {
  const trimmed = raw.trim().replace(/[^\d]/g, '');
  if (!trimmed) {
    return { ok: false, error: 'Vui lòng nhập thành tiền' };
  }
  const amount = Number.parseInt(trimmed, 10);
  if (!Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: 'Số tiền không hợp lệ' };
  }
  return { ok: true, amount };
}

export function resolveBookingDisplayTotal(params: {
  subtotal: number;
  isManualPrice: boolean;
  manualAmount: string;
  discount?: BookingDiscountSnapshot | null;
}): {
  subtotal: number;
  discountAmount: number;
  finalAmount: number;
  manualAmountValid: boolean;
  manualParseError?: string;
} {
  if (params.isManualPrice) {
    const parsed = parseManualBookingAmount(params.manualAmount);
    return {
      subtotal: params.subtotal,
      discountAmount: 0,
      finalAmount: parsed.ok ? parsed.amount! : params.subtotal,
      manualAmountValid: parsed.ok,
      ...(parsed.error ? { manualParseError: parsed.error } : {}),
    };
  }

  const discountAmount = params.discount?.totalDiscount ?? 0;
  const finalAmount =
    params.discount?.finalAmount ?? Math.max(0, params.subtotal - discountAmount);

  return {
    subtotal: params.subtotal,
    discountAmount,
    finalAmount,
    manualAmountValid: true,
  };
}

export function resolveActiveBookingDiscount(params: {
  discountResult: BookingDiscountSnapshot | null;
  enabled: boolean;
  isManualPrice: boolean;
  appliedPromotion: unknown;
  promoCodeInput: string;
  preCalculatedDiscount?: BookingDiscountSnapshot | null;
}): BookingDiscountSnapshot | null {
  if (params.discountResult) return params.discountResult;
  if (
    !params.enabled ||
    params.isManualPrice ||
    params.appliedPromotion ||
    params.promoCodeInput ||
    !params.preCalculatedDiscount ||
    params.preCalculatedDiscount.totalDiscount <= 0
  ) {
    return null;
  }
  return {
    totalDiscount: params.preCalculatedDiscount.totalDiscount,
    finalAmount: params.preCalculatedDiscount.finalAmount,
  };
}

export function isStaffBookingFormSubmittable(params: {
  customerName: string;
  customerPhone: string;
  slotsCount: number;
  isManualPrice: boolean;
  manualAmountValid: boolean;
  loading?: boolean;
}): boolean {
  if (params.loading) return false;
  if (params.slotsCount === 0) return false;
  if (!params.customerName.trim()) return false;
  if (params.customerPhone.trim().replace(/\s/g, '').length < 10) return false;
  if (params.isManualPrice && !params.manualAmountValid) return false;
  return true;
}
