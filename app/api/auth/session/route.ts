import { NextResponse } from 'next/server';
import { decodeJwtExp } from '@/lib/auth/session-core';
import { getAccessToken, getRefreshToken } from '@/lib/auth/session';

export async function GET() {
  const accessToken = await getAccessToken();
  const refreshToken = await getRefreshToken();

  if (!accessToken && !refreshToken) {
    return NextResponse.json({ isAuthenticated: false });
  }

  const accessExpiresAt = accessToken
    ? (decodeJwtExp(accessToken) ?? null)
    : null;

  return NextResponse.json({
    isAuthenticated: Boolean(accessToken || refreshToken),
    accessExpiresAt,
    hasRefreshToken: Boolean(refreshToken),
  });
}
