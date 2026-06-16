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
  FACILITY_OWNER_PERMISSIONS,
  ROLE_HOME_PATH,
  ROLE_PERMISSIONS,
  WORKSPACE_ROLES,
  type PortalCapability,
  type PortalPermission,
  type PortalWorkspace,
} from './portal-permissions';
import { matchRouteManifest, type RouteManifestEntry } from './route-manifest';

export function getEffectivePermissions(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): PortalPermission[] {
  if (!role) return [];
  const base = ROLE_PERMISSIONS[role] ?? [];
  const fromCapabilities = capabilities.flatMap(
    (cap) => CAPABILITY_PERMISSIONS[cap] ?? [],
  );
  const venuePermissions =
    hasVenueAccess && role !== 'FACILITY_OWNER'
      ? FACILITY_OWNER_PERMISSIONS
      : [];
  return [...new Set([...base, ...fromCapabilities, ...venuePermissions])];
}

export function can(
  role: UserRole | null | undefined,
  permission: PortalPermission,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): boolean {
  return getEffectivePermissions(role, capabilities, hasVenueAccess).includes(
    permission,
  );
}

export function canWithCapabilities(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[],
  permission: PortalPermission,
  hasVenueAccess = false,
): boolean {
  return can(role, permission, capabilities, hasVenueAccess);
}

export function canAny(
  role: UserRole | null | undefined,
  permissions: PortalPermission[],
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): boolean {
  if (!role) return false;
  return permissions.some((p) => can(role, p, capabilities, hasVenueAccess));
}

export function canAll(
  role: UserRole | null | undefined,
  permissions: PortalPermission[],
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): boolean {
  if (!role) return false;
  return permissions.every((p) => can(role, p, capabilities, hasVenueAccess));
}

export function getPermissionsForRole(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): PortalPermission[] {
  return getEffectivePermissions(role, capabilities, hasVenueAccess);
}

export function hasOrganizerCapability(
  capabilities: PortalCapability[] = [],
): boolean {
  return capabilities.includes('TOURNAMENT_ORGANIZER');
}

export function canAccessWorkspace(
  role: UserRole | null | undefined,
  workspace: PortalWorkspace,
  capabilities: PortalCapability[] = [],
  hasVenueAccess = false,
): boolean {
  if (!role) return false;

  if (workspace === 'organizer') {
    return (
      isAdminRole(role) || hasOrganizerCapability(capabilities)
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
): PortalWorkspace[] {
  if (!role) return [];
  const workspaces: PortalWorkspace[] = [];

  if (canAccessWorkspace(role, 'admin', capabilities, hasVenueAccess)) {
    workspaces.push('admin');
  }
  if (canAccessWorkspace(role, 'owner', capabilities, hasVenueAccess)) {
    workspaces.push('owner');
  }
  if (canAccessWorkspace(role, 'organizer', capabilities, hasVenueAccess)) {
    workspaces.push('organizer');
  }

  return workspaces;
}

export function getHomePath(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
): string {
  if (!role) return '/login';

  if (role === 'PLAYER' && hasOrganizerCapability(capabilities)) {
    return '/organizer';
  }

  if (role === 'FACILITY_OWNER' && hasOrganizerCapability(capabilities)) {
    return ROLE_HOME_PATH.FACILITY_OWNER;
  }

  return ROLE_HOME_PATH[role] ?? '/login';
}

/** @deprecated Use getHomePath(role, capabilities) */
export function getHomePathForRole(role: UserRole | null | undefined): string {
  return getHomePath(role);
}

export function canAccessRoute(
  role: UserRole | null | undefined,
  pathname: string,
  capabilities: PortalCapability[] = [],
  isOwner = false,
  hasVenueAccess = false,
): boolean {
  const entry = matchRouteManifest(pathname);
  if (!entry) return true;
  if (!role) return false;
  if (entry.ownerOnly && !isOwner) return false;
  if (
    !canAccessWorkspace(role, entry.workspace, capabilities, hasVenueAccess)
  ) {
    return false;
  }
  return can(role, entry.permission, capabilities, hasVenueAccess);
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
