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

import { canAccessRoute, getHomePath } from '@/lib/permissions/access';
import type { PortalCapability } from '@/lib/permissions/portal-permissions';
import type { AuthUser, UserRole } from '@/types';

const BLOCKED_REDIRECT_PATHS = [
  '/login',
  '/forbidden',
  '/forgot-password',
  '/maintenance',
] as const;

function isBlockedRedirect(path: string): boolean {
  const normalized =
    path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
  return BLOCKED_REDIRECT_PATHS.some(
    (blocked) =>
      normalized === blocked || normalized.startsWith(`${blocked}/`),
  );
}

export function resolvePostLoginPath(
  redirectTo: string | null | undefined,
  user: Pick<AuthUser, 'role' | 'portalCapabilities' | 'isOwner' | 'hasVenueAccess'>,
): string {
  const role = user.role as UserRole;
  const capabilities = (user.portalCapabilities ?? []) as PortalCapability[];
  const home = getHomePath(role, capabilities, user.hasVenueAccess ?? false);

  const candidate = redirectTo?.trim();
  if (!candidate || candidate === '/') {
    return home;
  }

  const path = candidate.startsWith('/') ? candidate : `/${candidate}`;

  if (isBlockedRedirect(path)) {
    return home;
  }

  if (
    canAccessRoute(
      role,
      path,
      capabilities,
      user.isOwner ?? false,
      user.hasVenueAccess ?? false,
    )
  ) {
    return path;
  }

  return home;
}
