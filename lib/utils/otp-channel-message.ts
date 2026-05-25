import type { OtpChannel } from '@/lib/api/phone-otp';

function resolveChannelName(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  const label = channelLabel?.trim();
  if (label) return label;
  if (channel === 'ZNS') return 'Zalo';
  if (channel === 'FIREBASE_FALLBACK') return 'SMS';
  return 'Zalo hoặc SMS';
}

export function getOtpDeliveryHint(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  if (channel === 'ZNS') {
    const via = channelLabel?.trim() || 'Zalo';
    return `Mã OTP đã gửi qua ${via}. Vui lòng mở ứng dụng ${via} và kiểm tra tin nhắn từ OA.`;
  }
  if (channel === 'FIREBASE_FALLBACK') {
    return 'Mã OTP đã gửi qua tin nhắn SMS. Vui lòng kiểm tra hộp thư tin nhắn trên điện thoại.';
  }
  return 'Vui lòng kiểm tra Zalo hoặc tin nhắn SMS trên điện thoại.';
}

export function getOtpSentToastMessage(
  channel: OtpChannel | null | undefined,
  channelLabel?: string | null,
): string {
  const via = resolveChannelName(channel, channelLabel);
  if (channel === 'ZNS' || channel === 'FIREBASE_FALLBACK') {
    return `Mã xác thực đã được gửi qua ${via}!`;
  }
  return 'Mã xác thực đã được gửi!';
}
