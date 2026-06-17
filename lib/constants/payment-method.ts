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

export const PAYMENT_METHOD_LABEL: Record<string, string> = {
  CASH: 'Tiền mặt',
  cash: 'Tiền mặt',
  BANK_TRANSFER: 'Chuyển khoản',
  bank_transfer: 'Chuyển khoản',
  MOMO: 'MoMo',
  momo: 'MoMo',
  VNPAY: 'VNPay',
  vnpay: 'VNPay',
  ZALOPAY: 'ZaloPay',
  zalopay: 'ZaloPay',
  CARD: 'Thẻ',
  card: 'Thẻ',
};

export function formatPaymentMethodLabel(value?: string | null): string {
  if (!value) return '—';
  return (
    PAYMENT_METHOD_LABEL[value] ??
    PAYMENT_METHOD_LABEL[value.toUpperCase()] ??
    value
  );
}
