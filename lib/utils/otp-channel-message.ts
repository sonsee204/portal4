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

import type { OtpChannel } from '@/lib/api/phone-otp';

function buildZaloDeliveryHint(channelLabel?: string | null): string {
  const via = channelLabel?.trim() || 'Zalo';
  return `Mã OTP đã gửi qua ${via}. Vui lòng mở ứng dụng ${via} và kiểm tra tin nhắn từ OA.`;
}

function resolveChannelName(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  if (channel === 'FIREBASE_FALLBACK') {
    return 'SMS';
  }
  const label = channelLabel?.trim();
  if (label) return label;
  return 'Zalo';
}

export function getOtpDeliveryHint(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  if (channel === 'FIREBASE_FALLBACK') {
    return 'Không gửi được qua Zalo. Mã OTP đã gửi qua SMS. Vui lòng kiểm tra hộp thư tin nhắn trên điện thoại.';
  }
  return buildZaloDeliveryHint(channelLabel);
}

export function getOtpSentToastMessage(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  const via = resolveChannelName(channel, channelLabel);
  return `Mã xác thực đã được gửi qua ${via}!`;
}
