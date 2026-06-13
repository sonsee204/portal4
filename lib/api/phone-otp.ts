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
 * Phone OTP client helper (portal).
 *
 * Mirrors the web client's helper so the portal can use the same
 * backend-orchestrated OTP flow:
 *
 *   const r1 = await requestPhoneOtp({ phone, purpose: 'PASSWORD_RESET_PHONE' });
 *   // → r1.channel === 'ZNS' or 'FIREBASE_FALLBACK'.
 *   const r2 = await verifyPhoneOtp({ verificationId, code, purpose });
 *
 * Errors surface as `PhoneOtpApiError` with a stable `code` and a
 * human-friendly Vietnamese message.
 */

import { getApolloClient } from '@/lib/apollo/client';
import { gql } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import type { GraphQLFormattedError } from 'graphql';

export type OtpPurpose =
  | 'SIGN_UP_PHONE'
  | 'SIGN_IN_PHONE'
  | 'PASSWORD_RESET_PHONE'
  | 'PHONE_CHANGE'
  | 'EMAIL_VERIFICATION'
  | 'EMAIL_CHANGE'
  | 'PASSWORD_RESET_EMAIL';

export type OtpChannel =
  | 'PENDING'
  | 'ZNS'
  | 'FIREBASE_FALLBACK'
  | 'EMAIL';

export interface RequestPhoneOtpResult {
  channel: OtpChannel;
  verificationId: string | null;
  expiresAt: Date | null;
  resendAvailableAt: Date;
  maskedPhone: string;
  channelLabel: string | null;
}

export interface VerifyPhoneOtpResult {
  phoneVerificationToken: string;
  phone: string;
  expiresAt: Date;
}

const REQUEST_PHONE_OTP = gql`
  mutation RequestPhoneOtp($input: RequestPhoneOtpInput!) {
    requestPhoneOtp(input: $input) {
      channel
      verificationId
      expiresAt
      resendAvailableAt
      maskedPhone
      channelLabel
    }
  }
`;

const VERIFY_PHONE_OTP = gql`
  mutation VerifyPhoneOtp($input: VerifyPhoneOtpInput!) {
    verifyPhoneOtp(input: $input) {
      phoneVerificationToken
      phone
      expiresAt
    }
  }
`;

export class PhoneOtpApiError extends Error {
  readonly code: string;
  readonly retryAfterSec?: number;

  constructor(message: string, code: string, retryAfterSec?: number) {
    super(message);
    this.code = code;
    this.retryAfterSec = retryAfterSec;
    this.name = 'PhoneOtpApiError';
  }
}

const ZBS_ERROR_MAP: Record<string, string> = {
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
  TOKEN_INVALID:
    'Phiên xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.',
  INVALID_PHONE: 'Số điện thoại không hợp lệ.',
};

const DEFAULT_OTP_ERROR_MESSAGE =
  'Không thể xử lý mã OTP. Vui lòng thử lại sau.';

function extractError(errors?: readonly GraphQLFormattedError[]): never {
  const first = errors?.[0];
  const extensions = (first?.extensions ?? {}) as Record<string, unknown>;
  const code = (extensions.code as string | undefined) ?? 'UNKNOWN';
  const retryAfter =
    typeof extensions.retryAfterSec === 'number'
      ? (extensions.retryAfterSec as number)
      : undefined;

  const message =
    ZBS_ERROR_MAP[code] ?? first?.message ?? DEFAULT_OTP_ERROR_MESSAGE;
  throw new PhoneOtpApiError(message, code, retryAfter);
}

/**
 * Apollo Client v4 surfaces GraphQL response errors via `result.error`
 * (a `CombinedGraphQLErrors` instance). Network / unexpected errors
 * come through as a plain `Error`. Normalise both shapes.
 */
function maybeThrowApolloError(error: unknown): void {
  if (!error) return;
  if (CombinedGraphQLErrors.is(error)) {
    extractError(error.errors);
  }
  if (error instanceof Error) {
    throw new PhoneOtpApiError(
      error.message || DEFAULT_OTP_ERROR_MESSAGE,
      'NETWORK_ERROR',
    );
  }
  throw new PhoneOtpApiError(DEFAULT_OTP_ERROR_MESSAGE, 'UNKNOWN');
}

export async function requestPhoneOtp(input: {
  phone: string;
  purpose: OtpPurpose;
  forceChannel?: OtpChannel;
  deviceId?: string;
}): Promise<RequestPhoneOtpResult> {
  const client = getApolloClient();
  const result = await client.mutate<{
    requestPhoneOtp: {
      channel: OtpChannel;
      verificationId: string | null;
      expiresAt: string | null;
      resendAvailableAt: string;
      maskedPhone: string;
      channelLabel: string | null;
    };
  }>({
    mutation: REQUEST_PHONE_OTP,
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });
  maybeThrowApolloError(result.error);
  const data = result.data?.requestPhoneOtp;
  if (!data) {
    throw new PhoneOtpApiError(DEFAULT_OTP_ERROR_MESSAGE, 'UNKNOWN');
  }
  return {
    channel: data.channel,
    verificationId: data.verificationId,
    expiresAt: data.expiresAt ? new Date(data.expiresAt) : null,
    resendAvailableAt: new Date(data.resendAvailableAt),
    maskedPhone: data.maskedPhone,
    channelLabel: data.channelLabel,
  };
}

export async function verifyPhoneOtp(input: {
  verificationId: string;
  code: string;
  purpose: OtpPurpose;
}): Promise<VerifyPhoneOtpResult> {
  const client = getApolloClient();
  const result = await client.mutate<{
    verifyPhoneOtp: {
      phoneVerificationToken: string;
      phone: string;
      expiresAt: string;
    };
  }>({
    mutation: VERIFY_PHONE_OTP,
    variables: { input },
    fetchPolicy: 'no-cache',
    errorPolicy: 'all',
  });
  maybeThrowApolloError(result.error);
  const data = result.data?.verifyPhoneOtp;
  if (!data?.phoneVerificationToken) {
    throw new PhoneOtpApiError(DEFAULT_OTP_ERROR_MESSAGE, 'UNKNOWN');
  }
  return {
    phoneVerificationToken: data.phoneVerificationToken,
    phone: data.phone,
    expiresAt: new Date(data.expiresAt),
  };
}
