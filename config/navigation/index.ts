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

import {
  buildSidebarNav,
  type SidebarNavSection,
} from '@/lib/permissions/navigation';
import { can, type PortalCapability, type PortalPermission } from '@/lib/permissions';
import type { UserRole } from '@/types';

export type { SidebarNavSection };

export const adminSidebarNav = buildSidebarNav('admin');
export const ownerSidebarNav = buildSidebarNav('owner');
export const organizerSidebarNav = buildSidebarNav('organizer');

export interface UserAccountMenuItem {
  href: string;
  label: string;
  icon: string;
  permission?: PortalPermission;
  platformOwnerOnly?: boolean;
}

export const sharedProfileNavItem: UserAccountMenuItem = {
  href: '/shared/profile',
  label: 'Hồ sơ cá nhân',
  icon: 'person-outline',
  permission: 'profile.edit',
};

export const sharedSessionsNavItem: UserAccountMenuItem = {
  href: '/shared/sessions',
  label: 'Thiết bị & Phiên',
  icon: 'phone-portrait-outline',
  permission: 'profile.edit',
};

/** Account/system links shown in header avatar menu (not sidebar). */
export const USER_ACCOUNT_MENU_ITEMS: UserAccountMenuItem[] = [
  {
    href: '/admin/settings',
    label: 'Cài đặt',
    icon: 'settings-outline',
    permission: 'system.settings',
  },
  {
    href: '/admin/access-control',
    label: 'Phân quyền hệ thống',
    icon: 'key-outline',
    permission: 'users.manage',
    platformOwnerOnly: true,
  },
  sharedProfileNavItem,
  sharedSessionsNavItem,
];

export function getUserAccountMenuItems(
  role: UserRole | null | undefined,
  capabilities: PortalCapability[] = [],
  isPlatformOwner = false,
  hasVenueAccess = false,
): UserAccountMenuItem[] {
  if (!role) return [];

  return USER_ACCOUNT_MENU_ITEMS.filter((item) => {
    if (item.platformOwnerOnly && !isPlatformOwner) return false;
    if (
      item.permission &&
      !can(role, item.permission, capabilities, hasVenueAccess)
    ) {
      return false;
    }
    return true;
  });
}
