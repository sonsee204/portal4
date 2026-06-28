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

import type { UserRole } from '@/types';
import {
  CAPABILITY_PERMISSIONS,
  PLATFORM_OWNER_ORGANIZER_PERMISSIONS,
  ROLE_HOME_PATH,
  ROLE_PERMISSIONS,
  VENUE_STAFF_PORTAL_PERMISSIONS,
  WORKSPACE_ROLES,
  type PortalCapability,
  type PortalPermission,
  type PortalWorkspace,
} from './portal-permissions';
import { matchRouteManifest, type RouteManifestEntry } from './route-manifest';

const STAFF_PORTAL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'FACILITY_OWNER',
];

function isOwnerWorkspaceRoute(pathname: string): boolean {
  return pathname === '/owner' || pathname.startsWith('/owner/');
}

export function getEffectivePermissions(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): PortalPermission[] {
  if (!role) return [];
  const base = ROLE_PERMISSIONS[role] ?? [];
  const fromCapabilities = capabilities.flatMap(
    (cap) => CAPABILITY_PERMISSIONS[cap] ?? [],
  );
  const venuePermissions =
    hasVenueAccess && role !== 'FACILITY_OWNER'
      ? VENUE_STAFF_PORTAL_PERMISSIONS
      : [];
  const platformOwnerPermissions = isPlatformOwner
    ? PLATFORM_OWNER_ORGANIZER_PERMISSIONS
    : [];
  return [
    ...new Set([
      ...base,
      ...fromCapabilities,
      ...venuePermissions,
      ...platformOwnerPermissions,
    ]),
  ];
}

export function can(
  role: UserRole | null | undefined,
  permission: PortalPermission,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): boolean {
  return getEffectivePermissions(
    role,
    capabilities,
    hasVenueAccess,
    isPlatformOwner,
  ).includes(permission);
}

export function canWithCapabilities(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[],
  permission: PortalPermission,
  hasVenueAccess = false,
  isPlatformOwner = false,
): boolean {
  return can(role, permission, capabilities, hasVenueAccess, isPlatformOwner);
}

export function canAny(
  role: UserRole | null | undefined,
  permissions: PortalPermission[],
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): boolean {
  if (!role) return false;
  return permissions.some((p) =>
    can(role, p, capabilities, hasVenueAccess, isPlatformOwner),
  );
}

export function canAll(
  role: UserRole | null | undefined,
  permissions: PortalPermission[],
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): boolean {
  if (!role) return false;
  return permissions.every((p) =>
    can(role, p, capabilities, hasVenueAccess, isPlatformOwner),
  );
}

export function getPermissionsForRole(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): PortalPermission[] {
  return getEffectivePermissions(
    role,
    capabilities,
    hasVenueAccess,
    isPlatformOwner,
  );
}

export function hasOrganizerCapability(
  capabilities: PortalCapability[] = [],
): boolean {
  return capabilities.includes('TOURNAMENT_ORGANIZER');
}

export function canAccessPortal(
  role: UserRole,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): boolean {
  if (STAFF_PORTAL_ROLES.includes(role)) return true;
  if (role === 'PLAYER' && hasOrganizerCapability(capabilities)) return true;
  if (hasVenueAccess) return true;
  return false;
}

export function canAccessWorkspace(
  role: UserRole | null | undefined,
  workspace: PortalWorkspace,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): boolean {
  if (!role) return false;

  if (workspace === 'organizer') {
    return (
      isPlatformOwner ||
      isAdminRole(role) ||
      hasOrganizerCapability(capabilities)
    );
  }

  if (workspace === 'owner') {
    return WORKSPACE_ROLES.owner.includes(role) || hasVenueAccess;
  }

  const allowedRoles = WORKSPACE_ROLES[workspace];
  if (allowedRoles.length > 0) {
    return allowedRoles.includes(role);
  }

  return false;
}

export function getAccessibleWorkspaces(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
  isPlatformOwner = false,
): PortalWorkspace[] {
  if (!role) return [];
  const workspaces: PortalWorkspace[] = [];

  if (
    canAccessWorkspace(role, 'admin', capabilities, hasVenueAccess, isPlatformOwner)
  ) {
    workspaces.push('admin');
  }
  if (
    canAccessWorkspace(role, 'owner', capabilities, hasVenueAccess, isPlatformOwner)
  ) {
    workspaces.push('owner');
  }
  if (
    canAccessWorkspace(
      role,
      'organizer',
      capabilities,
      hasVenueAccess,
      isPlatformOwner,
    )
  ) {
    workspaces.push('organizer');
  }

  return workspaces;
}

export function getHomePath(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): string {
  if (!role) return '/login';

  if (role === 'PLAYER' && hasOrganizerCapability(capabilities)) {
    return '/organizer';
  }

  if (role === 'PLAYER' && hasVenueAccess) {
    return '/owner';
  }

  if (role === 'FACILITY_OWNER' && hasOrganizerCapability(capabilities)) {
    return ROLE_HOME_PATH.FACILITY_OWNER;
  }

  return ROLE_HOME_PATH[role] ?? '/login';
}

/** @deprecated Use getHomePath(role, capabilities, hasVenueAccess) */
export function getHomePathForRole(role: UserRole | null | undefined): string {
  return getHomePath(role);
}

/**
 * Coarse portal route admission. Fine-grained owner routes use VenueRouteGuard.
 * @param isPlatformOwner - User.isOwner (platform super-admin phone match), NOT venue owner.
 */
export function canAccessRoute(
  role: UserRole | null | undefined,
  pathname: string,
  capabilities: PortalCapability[] = [],
  isPlatformOwner = false,
  hasVenueAccess = false,
): boolean {
  const entry = matchRouteManifest(pathname);
  if (!entry) return true;
  if (!role) return false;
  if (entry.platformOwnerOnly && !isPlatformOwner) return false;
  if (entry.ownerOnly && !entry.venueOwnerOnly) {
    if (pathname.startsWith('/owner/')) {
      // venueOwnerOnly on /owner/* is enforced by VenueRouteGuard (selected venue).
    } else if (!isPlatformOwner && !isSuperAdminRole(role)) {
      return false;
    }
  }
  if (
    !canAccessWorkspace(
      role,
      entry.workspace,
      capabilities,
      hasVenueAccess,
      isPlatformOwner,
    )
  ) {
    return false;
  }
  if (
    isOwnerWorkspaceRoute(pathname) &&
    (hasVenueAccess || role === 'FACILITY_OWNER')
  ) {
    return true;
  }
  return can(
    role,
    entry.permission,
    capabilities,
    hasVenueAccess,
    isPlatformOwner,
  );
}

export function getRouteManifestEntry(
  pathname: string,
): RouteManifestEntry | undefined {
  return matchRouteManifest(pathname);
}

export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

export function isSuperAdminRole(role: UserRole | null | undefined): boolean {
  return role === 'SUPER_ADMIN';
}
