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

/**
 * Portal feature identifiers
 */
export type PortalFeature =
  | 'dashboard'
  | 'user_management'
  | 'admin_creation'
  | 'facility_owner_creation'
  | 'player_provision'
  | 'player_password_reset'
  | 'system_settings'
  | 'all_venues'
  | 'own_venues'
  | 'analytics'
  | 'own_analytics'
  | 'audit'
  | 'moderation'
  | 'calendar'
  | 'tournaments'
  | 'cms'
  | 'ecosystem'
  | 'finance'
  | 'own_finance'
  | 'support'
  | 'own_bookings'
  | 'growth';

/**
 * Feature access map per role
 */
const PORTAL_FEATURES: Record<UserRole, PortalFeature[]> = {
  SUPER_ADMIN: [
    'dashboard',
    'user_management',
    'admin_creation',
    'facility_owner_creation',
    'player_provision',
    'player_password_reset',
    'system_settings',
    'all_venues',
    'own_venues',
    'analytics',
    'own_analytics',
    'audit',
    'moderation',
    'calendar',
    'tournaments',
    'cms',
    'ecosystem',
    'finance',
    'own_finance',
    'support',
    'own_bookings',
    'growth',
  ],
  ADMIN: [
    'dashboard',
    'user_management',
    'facility_owner_creation',
    'all_venues',
    'analytics',
    'moderation',
    'calendar',
    'tournaments',
    'cms',
    'support',
    'growth',
  ],
  FACILITY_OWNER: [
    'dashboard',
    'own_venues',
    'own_analytics',
    'own_finance',
    'own_bookings',
    'calendar',
  ],
  PLAYER: [], // Players cannot access portal
};

/**
 * Check if a role can access a specific feature
 */
export function canAccess(
  role: UserRole | null | undefined,
  feature: PortalFeature,
): boolean {
  if (!role) return false;
  return PORTAL_FEATURES[role]?.includes(feature) ?? false;
}

/**
 * Check if a role can access any of the specified features
 */
export function canAccessAny(
  role: UserRole | null | undefined,
  features: PortalFeature[],
): boolean {
  if (!role) return false;
  return features.some((f) => canAccess(role, f));
}

/**
 * Check if a role can access all of the specified features
 */
export function canAccessAll(
  role: UserRole | null | undefined,
  features: PortalFeature[],
): boolean {
  if (!role) return false;
  return features.every((f) => canAccess(role, f));
}

/**
 * Get all features available to a role
 */
export function getRoleFeatures(
  role: UserRole | null | undefined,
): PortalFeature[] {
  if (!role) return [];
  return PORTAL_FEATURES[role] ?? [];
}

/**
 * Check if a role is admin-level (ADMIN or SUPER_ADMIN)
 */
export function isAdminRole(role: UserRole | null | undefined): boolean {
  return role === 'ADMIN' || role === 'SUPER_ADMIN';
}

/**
 * Check if a role is super admin
 */
export function isSuperAdminRole(role: UserRole | null | undefined): boolean {
  return role === 'SUPER_ADMIN';
}

/**
 * Role display names
 */
export const ROLE_DISPLAY_NAMES: Record<UserRole, string> = {
  SUPER_ADMIN: 'Siêu quản trị',
  ADMIN: 'Quản trị viên',
  FACILITY_OWNER: 'Chủ sân',
  PLAYER: 'Người chơi',
};

/**
 * Role badge colors
 */
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
