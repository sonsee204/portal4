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

/** Portal capability grants (mirrors backend PortalCapability enum). */
export type PortalCapability = 'TOURNAMENT_ORGANIZER';

/** Fine-grained portal permissions — aligned with backend guards. */
export type PortalPermission =
  | 'platform.dashboard'
  | 'organizer.dashboard'
  | 'owner.dashboard'
  | 'users.manage'
  | 'users.create_admin'
  | 'users.create_owner'
  | 'users.provision_player'
  | 'users.reset_player_password'
  | 'venues.review_requests'
  | 'venues.review_claims'
  | 'finance.platform'
  | 'finance.venue'
  | 'bookings.platform'
  | 'bookings.venue'
  | 'calendar.platform'
  | 'calendar.venue'
  | 'analytics.venue'
  | 'orders.venue'
  | 'products.venue'
  | 'staff.venue'
  | 'venues.manage'
  | 'tournaments.platform'
  | 'tournaments.organize'
  | 'growth.manage'
  | 'support.manage'
  | 'audit.view'
  | 'moderation.manage'
  | 'system.settings'
  | 'profile.edit';

export type PortalWorkspace = 'admin' | 'owner' | 'organizer' | 'shared';

const SUPER_ADMIN_PERMISSIONS: PortalPermission[] = [
  'platform.dashboard',
  'organizer.dashboard',
  'users.manage',
  'users.create_admin',
  'users.create_owner',
  'users.provision_player',
  'users.reset_player_password',
  'venues.review_requests',
  'venues.review_claims',
  'tournaments.organize',
  'growth.manage',
  'support.manage',
  'audit.view',
  'moderation.manage',
  'system.settings',
  'profile.edit',
];

const ADMIN_PERMISSIONS: PortalPermission[] = [
  'platform.dashboard',
  'venues.review_requests',
  'venues.review_claims',
  'growth.manage',
  'support.manage',
  'audit.view',
  'profile.edit',
];

export const FACILITY_OWNER_PERMISSIONS: PortalPermission[] = [
  'owner.dashboard',
  'venues.manage',
  'finance.venue',
  'bookings.venue',
  'calendar.venue',
  'analytics.venue',
  'orders.venue',
  'products.venue',
  'staff.venue',
  'profile.edit',
];

export const CAPABILITY_PERMISSIONS: Record<
  PortalCapability,
  PortalPermission[]
> = {
  TOURNAMENT_ORGANIZER: ['organizer.dashboard', 'tournaments.organize', 'profile.edit'],
};

export const ROLE_PERMISSIONS: Record<UserRole, PortalPermission[]> = {
  SUPER_ADMIN: SUPER_ADMIN_PERMISSIONS,
  ADMIN: ADMIN_PERMISSIONS,
  FACILITY_OWNER: FACILITY_OWNER_PERMISSIONS,
  PLAYER: [],
};

/** Roles allowed per workspace (coarse middleware check). */
export const WORKSPACE_ROLES: Record<PortalWorkspace, UserRole[]> = {
  admin: ['SUPER_ADMIN', 'ADMIN'],
  owner: ['FACILITY_OWNER'],
  organizer: [],
  shared: ['SUPER_ADMIN', 'ADMIN', 'FACILITY_OWNER', 'PLAYER'],
};

/** Default home path after login per role (no capabilities). */
export const ROLE_HOME_PATH: Record<UserRole, string> = {
  SUPER_ADMIN: '/admin',
  ADMIN: '/admin',
  FACILITY_OWNER: '/owner',
  PLAYER: '/login',
};
