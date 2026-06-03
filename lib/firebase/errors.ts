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

/**
 * Map Firebase Auth + backend ZBS errors to Vietnamese messages.
 * Mirrors the web client's helper so forms can pick whichever path
 * is appropriate without duplicating the lookup table.
 */

const FIREBASE_ERROR_MESSAGES: Record<string, string> = {
  // Rate limiting.
  'auth/too-many-requests':
    'Quá nhiều lần thử. Vui lòng thử lại sau vài phút.',
  TOO_MANY_ATTEMPTS_TRY_LATER:
    'Quá nhiều lần thử. Vui lòng thử lại sau vài phút.',

  // Phone auth.
  'auth/invalid-phone-number': 'Số điện thoại không hợp lệ.',
  'auth/missing-phone-number': 'Vui lòng nhập số điện thoại.',
  'auth/invalid-verification-code': 'Mã xác thực không đúng. Vui lòng thử lại.',
  'auth/code-expired': 'Mã xác thực đã hết hạn. Vui lòng gửi lại mã.',
  'auth/invalid-verification-id': 'Phiên xác thực không hợp lệ. Vui lòng thử lại.',

  // reCAPTCHA / App Check / Domain.
  'auth/captcha-check-failed':
    'Xác minh bảo mật thất bại. Vui lòng tải lại trang và thử lại.',
  CAPTCHA_CHECK_FAILED:
    'Domain chưa được cấu hình. Vui lòng thêm domain vào cài đặt reCAPTCHA.',
  'Hostname match not found':
    'Domain chưa được cấu hình. Vui lòng thêm domain vào cài đặt reCAPTCHA.',
  'auth/invalid-app-credential':
    'Xác minh bảo mật thất bại. Vui lòng tải lại trang và thử lại.',
  INVALID_APP_CREDENTIAL:
    'Xác minh bảo mật thất bại. Vui lòng tải lại trang và thử lại.',

  // Backend / Service.
  'Error code: 39':
    'Dịch vụ đang tạm bận. Vui lòng thử lại sau vài phút.',
  backendError:
    'Dịch vụ đang tạm bận. Vui lòng thử lại sau vài phút.',

  // Session / Network.
  'auth/session-expired': 'Phiên đăng nhập hết hạn. Vui lòng thử lại.',
  'auth/network-request-failed':
    'Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.',

  // Backend phone-OTP / Zalo Business Solutions codes.
  OTP_THROTTLE_TOO_MANY_REQUESTS:
    'Bạn đã gửi OTP quá nhiều lần. Vui lòng thử lại sau ít phút.',
  OTP_THROTTLE_HOURLY_LIMIT:
    'Đã vượt quá hạn mức gửi OTP trong giờ. Vui lòng thử lại sau.',
  OTP_THROTTLE_DAILY_LIMIT:
    'Đã vượt quá hạn mức gửi OTP trong ngày. Vui lòng thử lại vào ngày mai.',
  OTP_THROTTLE_PHONE_LOCKED:
    'Số điện thoại tạm thời bị khóa. Vui lòng thử lại sau.',
  OTP_THROTTLE_IP_LIMIT:
    'Thiết bị/IP này đã gửi OTP quá nhiều. Vui lòng thử lại sau.',
  OTP_PURPOSE_MISMATCH:
    'Mục đích xác thực không khớp. Vui lòng gửi lại OTP.',
  OTP_AMBIGUOUS_PROOF:
    'Bằng chứng xác thực không hợp lệ. Vui lòng thử lại.',
  OTP_NO_PHONE_PROOF:
    'Không tìm thấy bằng chứng xác thực số điện thoại. Vui lòng gửi lại OTP.',
  OTP_CHANNEL_UNAVAILABLE:
    'Hiện chưa thể gửi OTP qua bất kỳ kênh nào. Vui lòng thử lại sau.',
  OTP_ZNS_NOT_ZALO_USER:
    'Số điện thoại này chưa cài Zalo. Vui lòng dùng số khác hoặc nhận OTP qua SMS.',
};

const DEFAULT_MESSAGE = 'Đã xảy ra lỗi. Vui lòng thử lại.';

export function getFirebaseErrorMessage(err: unknown): string {
  if (!err || typeof err !== 'object') return DEFAULT_MESSAGE;

  const error = err as {
    code?: string;
    message?: string;
    response?: {
      data?: {
        error?: {
          message?: string;
          errors?: Array<{ reason?: string; message?: string }>;
        };
      };
    };
  };

  if (error.code && FIREBASE_ERROR_MESSAGES[error.code]) {
    return FIREBASE_ERROR_MESSAGES[error.code];
  }

  const apiError = error.response?.data?.error;
  const message =
    error.message ??
    apiError?.message ??
    apiError?.errors?.[0]?.message ??
    '';
  const reason = apiError?.errors?.[0]?.reason ?? '';

  const textToCheck = `${message} ${reason}`.toLowerCase();
  for (const [key, msg] of Object.entries(FIREBASE_ERROR_MESSAGES)) {
    if (
      (typeof message === 'string' && message.includes(key)) ||
      textToCheck.includes(key.toLowerCase())
    ) {
      return msg;
    }
  }

  return DEFAULT_MESSAGE;
}
