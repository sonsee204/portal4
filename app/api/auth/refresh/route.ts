import { NextResponse } from 'next/server';
import { refreshSessionFromCookie } from '@/lib/auth/refresh-server';

export async function POST() {
  const result = await refreshSessionFromCookie();

  if (result.ok) {
    return NextResponse.json({ accessToken: result.accessToken });
  }

  if (result.reason === 'auth_failure' || result.reason === 'no_refresh') {
    return NextResponse.json({ error: 'Refresh failed' }, { status: 401 });
  }

  return NextResponse.json({ error: 'Refresh unavailable' }, { status: 503 });
}
