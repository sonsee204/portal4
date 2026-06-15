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

import {
  setSession,
  getAccessToken,
} from './session';
import { refreshSessionFromCookie } from './refresh-server';
import { GRAPHQL_URL } from './constants';
import { isUnauthenticatedGraphQLError } from '@/lib/auth/session-core';
import { AUTH, ERRORS } from '@/lib/strings';
import type { AuthUser } from '@/types';

export interface ActionResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

interface SignInResponse {
  data?: {
    signIn: {
      accessToken: string;
      refreshToken: string;
      user: {
        _id: string;
        email: string;
        fullName: string;
        role: string;
      };
      message: string;
    };
  };
  errors?: Array<{ message: string }>;
}

export async function loginAction(
  emailOrPhone: string,
  password: string,
): Promise<ActionResult>;
export async function loginAction(
  _prevState: ActionResult | null,
  formData: FormData,
): Promise<ActionResult>;
export async function loginAction(
  emailOrPhoneOrState: string | ActionResult | null,
  passwordOrFormData: string | FormData,
): Promise<ActionResult> {
  let emailOrPhone: string;
  let password: string;

  if (typeof emailOrPhoneOrState === 'string' && typeof passwordOrFormData === 'string') {
    emailOrPhone = emailOrPhoneOrState;
    password = passwordOrFormData;
  } else if (passwordOrFormData instanceof FormData) {
    emailOrPhone = passwordOrFormData.get('emailOrPhone') as string;
    password = passwordOrFormData.get('password') as string;
  } else {
    return { success: false, error: AUTH.LOGIN.INPUT_REQUIRED };
  }

  if (!emailOrPhone || !password) {
    return { success: false, error: AUTH.LOGIN.INPUT_REQUIRED };
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
          mutation SignIn($input: SignInInput!) {
            signIn(input: $input) {
              accessToken
              refreshToken
              user {
                _id
                email
                fullName
                role
              }
              message
            }
          }
        `,
        variables: {
          input: { emailOrPhone, password },
        },
      }),
    });

    const result = (await response.json()) as SignInResponse;

    if (result.errors && result.errors.length > 0) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result.data?.signIn) {
      return { success: false, error: AUTH.LOGIN.FAILED };
    }

    const { accessToken, refreshToken, user } = result.data.signIn;

    const me = await fetchMe(accessToken);
    const capabilities = me?.portalCapabilities ?? [];

    await setSession(
      { accessToken, refreshToken },
      user.role,
      capabilities,
    );

    return {
      success: true,
      user:
        me ??
        ({
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          displayName: user.fullName,
          role: user.role as AuthUser['role'],
          portalCapabilities: capabilities,
        } satisfies AuthUser),
    };
  } catch {
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
}

export async function refreshAction(): Promise<boolean> {
  const result = await refreshSessionFromCookie();
  return result.ok;
}

const ME_QUERY = `
  query Me {
    me {
      _id
      email
      phone
      fullName
      displayName
      userName
      role
      photoURL
      bio
      club
      gender
      dateOfBirth
      location {
        city
        country
        displayText
        coordinates {
          latitude
          longitude
        }
      }
      portalCapabilities
    }
  }
`;

const PORTAL_GQL_HEADERS = {
  'Content-Type': 'application/json',
  'x-client-source': 'portal',
  'Apollo-Require-Preflight': 'true',
} as const;

async function fetchMe(accessToken: string): Promise<AuthUser | null> {
  const response = await fetch(GRAPHQL_URL, {
    method: 'POST',
    headers: {
      ...PORTAL_GQL_HEADERS,
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({ query: ME_QUERY }),
  });

  const result = (await response.json()) as {
    data?: { me: AuthUser };
    errors?: Array<{ message: string; extensions?: { code?: string } }>;
  };

  if (result.data?.me) {
    return result.data.me;
  }

  const firstError = result.errors?.[0];
  if (
    firstError &&
    isUnauthenticatedGraphQLError(
      firstError.extensions?.code,
      firstError.message,
    )
  ) {
    return null;
  }

  return null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  let accessToken = await getAccessToken();

  if (!accessToken) {
    const refreshed = await refreshSessionFromCookie();
    if (!refreshed.ok) {
      return null;
    }
    accessToken = refreshed.accessToken;
  }

  try {
    const user = await fetchMe(accessToken);
    if (user) {
      return user;
    }

    const refreshed = await refreshSessionFromCookie();
    if (!refreshed.ok) {
      return null;
    }

    return await fetchMe(refreshed.accessToken);
  } catch {
    return null;
  }
}
