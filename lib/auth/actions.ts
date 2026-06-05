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

/**
 * Auth action result type
 */
interface ActionResult {
  success: boolean;
  error?: string;
  user?: AuthUser;
}

/**
 * GraphQL response shape for signIn mutation
 */
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

/**
 * Login server action (overloaded)
 * Called from the login form with either direct params or FormData
 */
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

  // Check if called with direct params (string, string) or FormData
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

    // Store tokens in HttpOnly cookies
    await setSession({ accessToken, refreshToken }, user.role);

    // Return user data to client so LoginForm can populate auth store
    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        displayName: user.fullName, // Map fullName to displayName initially
        role: user.role as AuthUser['role'],
      },
    };
  } catch {
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
}

/**
 * Refresh token server action
 * Returns new access token or null if refresh failed
 */
export async function refreshAction(): Promise<boolean> {
  const result = await refreshSessionFromCookie();
  return result.ok;
}

// ==================== PASSWORD RESET ====================

/**
 * GraphQL response shape for requestPasswordReset / resetPassword
 */
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
 * Step 1 — validate user exists so the frontend can send Firebase OTP.
 */
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

/**
 * Step 3 — reset password using the Firebase ID token obtained after OTP verification.
 */
export async function resetPasswordAction(
  idToken: string,
  newPassword: string,
): Promise<ActionResult> {
  if (!idToken || !newPassword) {
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
        variables: { input: { idToken, newPassword } },
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

// ==================== USER PROFILE ====================

/**
 * Get current user server action (for client components to fetch user data)
 */
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
