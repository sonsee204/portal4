/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { PaymentMethod } from '@/graphql/generated';

/** Aligned with backend order-payment-proof.service / order-status.service */
export const ONLINE_PAYMENT_METHODS = new Set<string>([
  PaymentMethod.BankTransfer,
  PaymentMethod.Momo,
  PaymentMethod.Zalopay,
  PaymentMethod.Vnpay,
  PaymentMethod.Card,
]);

export const MAX_PAYMENT_PROOF_IMAGES = 5;

export const PAYMENT_PROOF_ACCEPT = 'image/jpeg,image/png,image/webp';

export const PAYMENT_PROOF_MAX_BYTES = 10 * 1024 * 1024;

export function requiresPaymentProof(paymentMethod?: string | null): boolean {
  if (!paymentMethod) return false;
  return ONLINE_PAYMENT_METHODS.has(paymentMethod);
}

export function canUploadMoreProof(currentCount: number): boolean {
  return currentCount < MAX_PAYMENT_PROOF_IMAGES;
}

export function remainingProofSlots(currentCount: number): number {
  return Math.max(0, MAX_PAYMENT_PROOF_IMAGES - currentCount);
}
