/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { describe, expect, it } from 'vitest';
import { PaymentMethod } from '@/graphql/generated';
import { canCompleteOrderWithPaymentProof } from '@/lib/owner/order-complete';
import {
  canUploadMoreProof,
  MAX_PAYMENT_PROOF_IMAGES,
  remainingProofSlots,
  requiresPaymentProof,
} from '@/lib/owner/payment-proof';

describe('payment-proof', () => {
  it('requires proof for all backend online payment methods', () => {
    expect(requiresPaymentProof(PaymentMethod.BankTransfer)).toBe(true);
    expect(requiresPaymentProof(PaymentMethod.Momo)).toBe(true);
    expect(requiresPaymentProof(PaymentMethod.Zalopay)).toBe(true);
    expect(requiresPaymentProof(PaymentMethod.Vnpay)).toBe(true);
    expect(requiresPaymentProof(PaymentMethod.Card)).toBe(true);
  });

  it('does not require proof for cash', () => {
    expect(requiresPaymentProof(PaymentMethod.Cash)).toBe(false);
    expect(requiresPaymentProof(null)).toBe(false);
    expect(requiresPaymentProof(undefined)).toBe(false);
  });

  it('tracks upload slots up to max images', () => {
    expect(canUploadMoreProof(0)).toBe(true);
    expect(canUploadMoreProof(MAX_PAYMENT_PROOF_IMAGES - 1)).toBe(true);
    expect(canUploadMoreProof(MAX_PAYMENT_PROOF_IMAGES)).toBe(false);
    expect(remainingProofSlots(3)).toBe(2);
    expect(remainingProofSlots(MAX_PAYMENT_PROOF_IMAGES)).toBe(0);
  });
});

describe('canCompleteOrderWithPaymentProof', () => {
  it('allows cash orders without proof images', () => {
    expect(
      canCompleteOrderWithPaymentProof(PaymentMethod.Cash, []),
    ).toEqual({ allowed: true });
  });

  it('blocks ZaloPay orders without proof images', () => {
    const result = canCompleteOrderWithPaymentProof(PaymentMethod.Zalopay, []);
    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('bên dưới');
  });

  it('allows online orders with at least one proof image', () => {
    expect(
      canCompleteOrderWithPaymentProof(PaymentMethod.BankTransfer, [
        'https://cdn.example/proof.jpg',
      ]),
    ).toEqual({ allowed: true });
  });
});
