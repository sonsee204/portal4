import { NextResponse } from 'next/server';
import { getAccessToken, clearSession } from '@/lib/auth/session';
import { GRAPHQL_URL } from '@/lib/auth/constants';

/**
 * API route to logout the user.
 * Called from the client-side useLogout hook so that client state
 * (Apollo cache, Zustand store) can be cleared before redirecting.
 */
export async function POST() {
  const accessToken = await getAccessToken();

  // Call backend signOut if we have a token
  if (accessToken) {
    try {
      await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
          'x-client-source': 'portal',
          'Apollo-Require-Preflight': 'true',
        },
        body: JSON.stringify({
          query: `
            mutation SignOut {
              signOut
            }
          `,
        }),
      });
    } catch {
      // Ignore errors -- we are logging out regardless
    }
  }

  await clearSession();

  return NextResponse.json({ success: true });
}
