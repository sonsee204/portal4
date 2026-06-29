'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { setSession, getAccessToken } from './session';
import { refreshSessionFromCookie } from './refresh-server';
import { GRAPHQL_URL, AUTH_COOKIES } from './constants';
import { isUnauthenticatedGraphQLError } from '@/lib/auth/session-core';
import { AUTH, ERRORS } from '@/lib/strings';
import type { AuthUser } from '@/types';

interface ActionResult {
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
    };
  };
  errors?: Array<{ message: string }>;
}

export async function loginAction(
  emailOrPhone: string,
  password: string
): Promise<ActionResult> {
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
            }
          }
        `,
        variables: {
          input: { emailOrPhone, password },
        },
      }),
    });

    const result = (await response.json()) as SignInResponse;

    if (result.errors?.length) {
      return { success: false, error: result.errors[0].message };
    }

    if (!result.data?.signIn) {
      return { success: false, error: AUTH.LOGIN.FAILED };
    }

    const { accessToken, refreshToken, user } = result.data.signIn;

    await setSession({ accessToken, refreshToken }, user.role);

    return {
      success: true,
      user: {
        _id: user._id,
        email: user.email,
        fullName: user.fullName,
        displayName: user.fullName,
        role: user.role as AuthUser['role'],
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: ERRORS.SERVER_NETWORK,
    };
  }
}

// ==================== GET CURRENT USER ====================

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
      firstError.message
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

// ==================== LOGOUT ====================

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIES.ACCESS_TOKEN);
  cookieStore.delete(AUTH_COOKIES.REFRESH_TOKEN);
  cookieStore.delete(AUTH_COOKIES.USER_ROLE);
  redirect('/login');
}
