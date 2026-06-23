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
import { getAccessToken, clearSession } from './session';
import { refreshSessionFromCookie } from './refresh-server';
import { getServerActionSessionHeaders } from './session-forward-headers';
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

/**
 * Change the current user's password.
 *
 * The backend revokes every refresh-token session AND clears all FCM push
 * tokens for the user, so on success we also clear this device's portal
 * cookies — the caller must then redirect to the login screen.
 */
export async function changePasswordAction(
  currentPassword: string,
  newPassword: string,
): Promise<ActionResult> {
  if (!currentPassword || !newPassword) {
    return { success: false, error: AUTH.CHANGE_PASSWORD.CURRENT_REQUIRED };
  }

  let accessToken = await getAccessToken();
  if (!accessToken) {
    const refreshed = await refreshSessionFromCookie();
    if (!refreshed.ok) {
      return { success: false, error: AUTH.CHANGE_PASSWORD.SESSION_EXPIRED };
    }
    accessToken = refreshed.accessToken;
  }

  try {
    const sessionHeaders = await getServerActionSessionHeaders();
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-client-source': 'portal',
        'Apollo-Require-Preflight': 'true',
        ...sessionHeaders,
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        query: `
          mutation ChangePassword($input: ChangePasswordInput!) {
            changePassword(input: $input) {
              success
              message
            }
          }
        `,
        variables: {
          input: { currentPassword, newPassword },
        },
      }),
    });

    const result = (await response.json()) as SuccessGqlResponse;

    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result.data?.changePassword?.success) {
      return { success: false, error: AUTH.CHANGE_PASSWORD.FAILED };
    }

    // Backend revoked every session (incl. this one) + cleared push tokens.
    // Drop this device's cookies so the user is fully logged out locally.
    await clearSession();

    return { success: true };
  } catch {
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
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
