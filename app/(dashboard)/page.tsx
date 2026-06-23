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

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { AUTH_COOKIES } from '@/lib/auth/constants';
import { getHomePath } from '@/lib/permissions/access';
import type { PortalCapability } from '@/lib/permissions/portal-permissions';
import type { UserRole } from '@/types';

function parsePortalCapabilitiesCookie(value?: string): PortalCapability[] {
  if (!value?.trim()) return [];
  return value
    .split(',')
    .map((c) => c.trim())
    .filter((c): c is PortalCapability => c === 'TOURNAMENT_ORGANIZER');
}

/** Role redirect hub — middleware also redirects `/` when authenticated. */
export default async function DashboardHubPage() {
  const cookieStore = await cookies();
  const role = cookieStore.get(AUTH_COOKIES.USER_ROLE)?.value as
    | UserRole
    | undefined;
  const capabilities = parsePortalCapabilitiesCookie(
    cookieStore.get(AUTH_COOKIES.PORTAL_CAPABILITIES)?.value
  );
  const hasVenueAccess =
    cookieStore.get(AUTH_COOKIES.HAS_VENUE_ACCESS)?.value === '1';

  if (role) {
    redirect(getHomePath(role, capabilities, hasVenueAccess));
  }

  redirect('/login');
}
