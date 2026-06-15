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

export type { SidebarNavSection };

export const adminSidebarNav = buildSidebarNav('admin');
export const ownerSidebarNav = buildSidebarNav('owner');
export const organizerSidebarNav = buildSidebarNav('organizer');

export const sharedProfileNavItem = {
  href: '/shared/profile',
  label: 'Hồ sơ cá nhân',
  icon: 'person-outline',
  permission: 'profile.edit' as const,
};

/** Append profile link to sidebar nav (adds Hệ thống section if missing). */
export function withProfileSection(
  sections: SidebarNavSection[],
): SidebarNavSection[] {
  const hasSystem = sections.some((s) => s.section === 'Hệ thống');
  if (hasSystem) {
    return sections.map((section) =>
      section.section === 'Hệ thống'
        ? { ...section, items: [...section.items, sharedProfileNavItem] }
        : section,
    );
  }
  return [
    ...sections,
    { section: 'Hệ thống', items: [sharedProfileNavItem] },
  ];
}
