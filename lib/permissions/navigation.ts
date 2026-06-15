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

import type { PortalPermission, PortalWorkspace } from './portal-permissions';
import {
  getNavRoutesForWorkspace as getRoutes,
  type RouteManifestEntry,
} from './route-manifest';

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  permission?: PortalPermission;
}

export interface SidebarNavSection {
  section: string;
  items: NavItem[];
}

export function getNavRoutesForWorkspace(
  workspace: PortalWorkspace,
): RouteManifestEntry[] {
  return getRoutes(workspace);
}

export function buildSidebarNav(
  workspace: PortalWorkspace,
): SidebarNavSection[] {
  const routes = getRoutes(workspace);
  const sectionMap = new Map<string, RouteManifestEntry[]>();

  for (const route of routes) {
    const section = route.nav!.section;
    const list = sectionMap.get(section) ?? [];
    list.push(route);
    sectionMap.set(section, list);
  }

  return Array.from(sectionMap.entries()).map(([section, items]) => ({
    section,
    items: items.map((route) => ({
      href: route.path,
      label: route.nav!.label,
      icon: route.nav!.icon,
      permission: route.permission,
    })),
  }));
}

export { getBreadcrumbLabel } from './route-manifest';
