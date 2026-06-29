/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { requiresPaymentProof } from '@/lib/owner/payment-proof';

export { requiresPaymentProof } from '@/lib/owner/payment-proof';

export function canCompleteOrderWithPaymentProof(
  paymentMethod: string | null | undefined,
  paymentProofImages: string[] | null | undefined,
): { allowed: boolean; reason?: string } {
  if (!requiresPaymentProof(paymentMethod)) {
    return { allowed: true };
  }

  if (paymentProofImages && paymentProofImages.length > 0) {
    return { allowed: true };
  }

  return {
    allowed: false,
    reason:
      'Đơn thanh toán online cần có ít nhất một ảnh minh chứng thanh toán trước khi hoàn thành. Vui lòng tải ít nhất một ảnh minh chứng bên dưới.',
  };
}
