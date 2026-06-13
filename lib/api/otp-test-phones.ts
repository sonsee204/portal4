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
 * OTP test phone registry API (Portal SUPER_ADMIN).
 */

import { getApolloClient } from '@/lib/apollo/client';
import {
  CREATE_OTP_TEST_PHONE,
  GET_OTP_TEST_PHONES,
  SET_OTP_TEST_PHONE_ENABLED,
  UPDATE_OTP_TEST_PHONE,
} from '@/graphql/queries/otp-test-phones';

export type OtpTestPhonePurpose =
  | 'SIGN_UP_PHONE'
  | 'SIGN_IN_PHONE'
  | 'PASSWORD_RESET_PHONE'
  | 'PHONE_CHANGE';

export interface OtpTestPhone {
  _id: string;
  phone: string;
  testCode: string;
  label: string;
  enabled: boolean;
  allowedPurposes: OtpTestPhonePurpose[];
  expiresAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface OtpTestPhoneList {
  items: OtpTestPhone[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateOtpTestPhoneInput {
  phone: string;
  testCode: string;
  label: string;
  allowedPurposes?: OtpTestPhonePurpose[];
  expiresAt?: string;
}

export interface UpdateOtpTestPhoneInput {
  testCode?: string;
  label?: string;
  allowedPurposes?: OtpTestPhonePurpose[];
  expiresAt?: string | null;
}

export async function fetchOtpTestPhones(options?: {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
}): Promise<OtpTestPhoneList> {
  const client = getApolloClient();
  const result = await client.query<{ otpTestPhones: OtpTestPhoneList }>({
    query: GET_OTP_TEST_PHONES,
    variables: {
      pagination: {
        page: options?.page ?? 1,
        limit: options?.limit ?? 50,
      },
      filter: {
        search: options?.search,
        enabled: options?.enabled,
      },
    },
    fetchPolicy: 'network-only',
  });
  return (
    result.data?.otpTestPhones ?? {
      items: [],
      total: 0,
      page: 1,
      limit: 50,
      hasMore: false,
    }
  );
}

export async function createOtpTestPhone(
  input: CreateOtpTestPhoneInput,
): Promise<OtpTestPhone> {
  const client = getApolloClient();
  const result = await client.mutate<{ createOtpTestPhone: OtpTestPhone }>({
    mutation: CREATE_OTP_TEST_PHONE,
    variables: { input },
  });
  if (!result.data?.createOtpTestPhone) {
    throw new Error('createOtpTestPhone failed');
  }
  return result.data.createOtpTestPhone;
}

export async function updateOtpTestPhone(
  id: string,
  input: UpdateOtpTestPhoneInput,
): Promise<OtpTestPhone> {
  const client = getApolloClient();
  const result = await client.mutate<{ updateOtpTestPhone: OtpTestPhone }>({
    mutation: UPDATE_OTP_TEST_PHONE,
    variables: { id, input },
  });
  if (!result.data?.updateOtpTestPhone) {
    throw new Error('updateOtpTestPhone failed');
  }
  return result.data.updateOtpTestPhone;
}

export async function setOtpTestPhoneEnabled(
  id: string,
  enabled: boolean,
): Promise<OtpTestPhone> {
  const client = getApolloClient();
  const result = await client.mutate<{ setOtpTestPhoneEnabled: OtpTestPhone }>({
    mutation: SET_OTP_TEST_PHONE_ENABLED,
    variables: { id, enabled },
  });
  if (!result.data?.setOtpTestPhoneEnabled) {
    throw new Error('setOtpTestPhoneEnabled failed');
  }
  return result.data.setOtpTestPhoneEnabled;
}

/** Firebase Console test number format: +84 xxx + code */
export function formatFirebaseTestNumber(phone: string, testCode: string): string {
  return `${phone} → ${testCode}`;
}
