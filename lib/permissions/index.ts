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

export type {
  PortalCapability,
  PortalPermission,
  PortalWorkspace,
} from './portal-permissions';
export {
  CAPABILITY_PERMISSIONS,
  ROLE_HOME_PATH,
  ROLE_PERMISSIONS,
  WORKSPACE_ROLES,
} from './portal-permissions';

export type { RouteManifestEntry, RouteNavMeta } from './route-manifest';
export {
  ROUTE_MANIFEST,
  getBreadcrumbLabel,
  getNavRoutesForWorkspace,
  matchRouteManifest,
} from './route-manifest';

export {
  can,
  canAll,
  canAny,
  canAccessRoute,
  canAccessWorkspace,
  canWithCapabilities,
  getAccessibleWorkspaces,
  getEffectivePermissions,
  getHomePath,
  getHomePathForRole,
  getPermissionsForRole,
  getRouteManifestEntry,
  hasOrganizerCapability,
  isAdminRole,
  isSuperAdminRole,
} from './access';

/** @deprecated Use PortalPermission + can() instead. */
export type PortalFeature =
  | 'dashboard'
  | 'user_management'
  | 'admin_creation'
  | 'facility_owner_creation'
  | 'player_provision'
  | 'player_password_reset'
  | 'system_settings'
  | 'audit'
  | 'moderation'
  | 'calendar'
  | 'tournaments'
  | 'finance'
  | 'support'
  | 'growth'
  | 'own_venues'
  | 'own_analytics'
  | 'own_finance'
  | 'own_bookings';

const LEGACY_FEATURE_MAP: Record<PortalFeature, import('./portal-permissions').PortalPermission> = {
  dashboard: 'platform.dashboard',
  user_management: 'users.manage',
  admin_creation: 'users.create_admin',
  facility_owner_creation: 'users.create_owner',
  player_provision: 'users.provision_player',
  player_password_reset: 'users.reset_player_password',
  system_settings: 'system.settings',
  audit: 'audit.view',
  moderation: 'moderation.manage',
  calendar: 'calendar.platform',
  tournaments: 'tournaments.platform',
  finance: 'finance.platform',
  support: 'support.manage',
  growth: 'growth.manage',
  own_venues: 'owner.dashboard',
  own_analytics: 'analytics.venue',
  own_finance: 'finance.venue',
  own_bookings: 'bookings.venue',
};

import { can as checkPermission } from './access';

/** @deprecated Use can(role, permission) instead. */
export function canAccess(
  role: UserRole | null | undefined,
  feature: PortalFeature,
): boolean {
  if (
    role === 'FACILITY_OWNER' &&
    (feature === 'dashboard' || feature === 'calendar')
  ) {
    const ownerPerm =
      feature === 'dashboard' ? 'owner.dashboard' : 'calendar.venue';
    return checkPermission(role, ownerPerm);
  }

  const permission = LEGACY_FEATURE_MAP[feature];
  if (!permission) return false;
  return checkPermission(role, permission);
}

/** @deprecated Use canAny(role, permissions) instead. */
export function canAccessAny(
  role: UserRole | null | undefined,
  features: PortalFeature[],
): boolean {
  return features.some((f) => canAccess(role, f));
}

/** @deprecated Use canAll(role, permissions) instead. */
export function canAccessAll(
  role: UserRole | null | undefined,
  features: PortalFeature[],
): boolean {
  return features.every((f) => canAccess(role, f));
}

export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: 'Siêu quản trị',
  ADMIN: 'Quản trị viên',
  FACILITY_OWNER: 'Chủ sân',
  PLAYER: 'Người chơi',
};

export const ROLE_COLORS: Record<
  UserRole,
  { bg: string; text: string; border: string }
> = {
  SUPER_ADMIN: {
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/30',
  },
  ADMIN: {
    bg: 'bg-blue-500/10',
    text: 'text-blue-400',
    border: 'border-blue-500/30',
  },
  FACILITY_OWNER: {
    bg: 'bg-emerald-500/10',
    text: 'text-emerald-400',
    border: 'border-emerald-500/30',
  },
  PLAYER: {
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/30',
  },
};

export const WORKSPACE_LABELS: Record<
  import('./portal-permissions').PortalWorkspace,
  string
> = {
  admin: 'Platform Admin',
  owner: 'Chủ sân',
  organizer: 'Tournament Organizer',
  shared: 'Portal',
};
