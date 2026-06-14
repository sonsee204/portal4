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
 * OTP test user grant API (Portal SUPER_ADMIN).
 */

import { getApolloClient } from '@/lib/apollo/client';
import {
  GET_OTP_TEST_USER_GRANTS,
} from '@/graphql/otp-test-user-grant/queries';
import {
  CREATE_OTP_TEST_USER_GRANT,
  REVOKE_OTP_TEST_USER_GRANT,
} from '@/graphql/otp-test-user-grant/mutations';
import type { GetOtpTestUserGrantsQuery } from '@/graphql/generated';
import { connectionNodes } from '@/hooks/shared/useCursorConnection';

export type OtpTestUserGrantPurpose = 'SIGN_IN_PHONE';

export interface OtpTestUserGrant {
  _id: string;
  userId: string;
  userDisplayName: string;
  userRole: string;
  phone: string;
  testCode: string;
  reason: string;
  enabled: boolean;
  allowedPurposes: OtpTestUserGrantPurpose[];
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface OtpTestUserGrantList {
  items: OtpTestUserGrant[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CreateOtpTestUserGrantInput {
  userId: string;
  reason: string;
  expiresAt?: string;
  allowedPurposes?: OtpTestUserGrantPurpose[];
}

export async function fetchOtpTestUserGrants(options?: {
  page?: number;
  limit?: number;
  search?: string;
  enabled?: boolean;
  userId?: string;
}): Promise<OtpTestUserGrantList> {
  const limit = options?.limit ?? 50;
  const client = getApolloClient();
  const result = await client.query<GetOtpTestUserGrantsQuery>({
    query: GET_OTP_TEST_USER_GRANTS,
    variables: {
      pagination: {
        first: limit,
        after: null,
      },
      filter: {
        search: options?.search,
        enabled: options?.enabled,
        userId: options?.userId,
      },
    },
    fetchPolicy: 'network-only',
  });
  const conn = result.data?.otpTestUserGrantsConnection;
  return {
    items: (connectionNodes(conn?.edges) ?? []) as OtpTestUserGrant[],
    total: conn?.totalCount ?? 0,
    page: options?.page ?? 1,
    limit,
    hasMore: conn?.pageInfo?.hasNextPage ?? false,
  };
}

export async function createOtpTestUserGrant(
  input: CreateOtpTestUserGrantInput,
): Promise<OtpTestUserGrant> {
  const client = getApolloClient();
  const result = await client.mutate<{ createOtpTestUserGrant: OtpTestUserGrant }>({
    mutation: CREATE_OTP_TEST_USER_GRANT,
    variables: { input },
  });
  if (!result.data?.createOtpTestUserGrant) {
    throw new Error('createOtpTestUserGrant failed');
  }
  return result.data.createOtpTestUserGrant;
}

export async function revokeOtpTestUserGrant(
  id: string,
): Promise<OtpTestUserGrant> {
  const client = getApolloClient();
  const result = await client.mutate<{ revokeOtpTestUserGrant: OtpTestUserGrant }>({
    mutation: REVOKE_OTP_TEST_USER_GRANT,
    variables: { id },
  });
  if (!result.data?.revokeOtpTestUserGrant) {
    throw new Error('revokeOtpTestUserGrant failed');
  }
  return result.data.revokeOtpTestUserGrant;
}
