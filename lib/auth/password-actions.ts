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

'use server';

import { GRAPHQL_URL } from './constants';
import type { ActionResult } from './session-actions';
import { AUTH, ERRORS } from '@/lib/strings';

interface SuccessGqlResponse {
  data?: {
    [key: string]: {
      success: boolean;
      message: string;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function requestPasswordResetAction(
  phone: string,
): Promise<ActionResult> {
  if (!phone) {
    return { success: false, error: AUTH.FORGOT_PASSWORD.PHONE_REQUIRED };
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'portal',
        'Apollo-Require-Preflight': 'true',
      },
      body: JSON.stringify({
        query: `
          mutation RequestPasswordReset($emailOrPhone: String!) {
            requestPasswordReset(emailOrPhone: $emailOrPhone) {
              success
              message
            }
          }
        `,
        variables: { emailOrPhone: phone },
      }),
    });

    const result = (await response.json()) as SuccessGqlResponse;

    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
}

export interface ResetPasswordPhoneProof {
  phoneVerificationToken?: string;
  firebaseIdToken?: string;
}

export async function resetPasswordAction(
  proof: ResetPasswordPhoneProof,
  newPassword: string,
): Promise<ActionResult> {
  if (
    (!proof.phoneVerificationToken && !proof.firebaseIdToken) ||
    !newPassword
  ) {
    return { success: false, error: AUTH.LOGIN.MISSING_CREDENTIALS };
  }

  try {
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'portal',
        'Apollo-Require-Preflight': 'true',
      },
      body: JSON.stringify({
        query: `
          mutation ResetPassword($input: ResetPasswordInput!) {
            resetPassword(input: $input) {
              success
              message
            }
          }
        `,
        variables: {
          input: {
            phoneVerificationToken: proof.phoneVerificationToken,
            firebaseIdToken: proof.firebaseIdToken,
            newPassword,
          },
        },
      }),
    });

    const result = (await response.json()) as SuccessGqlResponse;

    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
}
