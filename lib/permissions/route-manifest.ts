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

export type RouteStatus = 'live';

export interface RouteNavMeta {
  label: string;
  icon: string;
  section: string;
  /** Breadcrumb label override (defaults to label). */
  breadcrumb?: string;
}

export interface RouteManifestEntry {
  path: string;
  workspace: PortalWorkspace;
  permission: PortalPermission;
  status: RouteStatus;
  /** When set, shown in sidebar for this workspace. */
  nav?: RouteNavMeta;
  /** Dynamic segment patterns for child routes (no nav). */
  pattern?: string;
}

/** All live portal routes — single source for nav + AccessGuard. */
export const ROUTE_MANIFEST: RouteManifestEntry[] = [
  // --- Admin workspace ---
  {
    path: '/admin',
    workspace: 'admin',
    permission: 'platform.dashboard',
    status: 'live',
    nav: { label: 'Tổng quan', icon: 'grid-outline', section: 'Menu chính' },
  },
  {
    path: '/admin/users',
    workspace: 'admin',
    permission: 'users.manage',
    status: 'live',
    nav: {
      label: 'Quản lý người dùng',
      icon: 'people-outline',
      section: 'Menu chính',
    },
  },
  {
    path: '/admin/users/:id',
    workspace: 'admin',
    permission: 'users.manage',
    status: 'live',
    pattern: '/admin/users/:id',
  },
  {
    path: '/admin/venue-requests',
    workspace: 'admin',
    permission: 'venues.review_requests',
    status: 'live',
    nav: {
      label: 'Yêu cầu đăng ký sân',
      icon: 'business-outline',
      section: 'Vận hành',
    },
  },
  {
    path: '/admin/claim-requests',
    workspace: 'admin',
    permission: 'venues.review_claims',
    status: 'live',
    nav: {
      label: 'Yêu cầu nhận sân',
      icon: 'hand-left-outline',
      section: 'Vận hành',
    },
  },
  {
    path: '/admin/tournaments',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    nav: { label: 'Giải đấu', icon: 'trophy-outline', section: 'Menu chính' },
  },
  {
    path: '/admin/tournaments/create',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/create',
  },
  {
    path: '/admin/tournaments/:id',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id',
  },
  {
    path: '/admin/tournaments/:id/edit',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/edit',
  },
  {
    path: '/admin/tournaments/:id/registrations',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/registrations',
  },
  {
    path: '/admin/tournaments/:id/draw',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/draw',
  },
  {
    path: '/admin/tournaments/:id/schedule',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/schedule',
  },
  {
    path: '/admin/tournaments/:id/print',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/print',
  },
  {
    path: '/admin/tournaments/:id/scoring/:matchId',
    workspace: 'admin',
    permission: 'tournaments.platform',
    status: 'live',
    pattern: '/admin/tournaments/:id/scoring/:matchId',
  },
  {
    path: '/admin/finance',
    workspace: 'admin',
    permission: 'finance.platform',
    status: 'live',
    nav: { label: 'Tài chính', icon: 'cash-outline', section: 'Menu chính' },
  },
  {
    path: '/admin/calendar',
    workspace: 'admin',
    permission: 'calendar.platform',
    status: 'live',
    nav: { label: 'Lịch sân', icon: 'calendar-outline', section: 'Menu chính' },
  },
  {
    path: '/admin/growth',
    workspace: 'admin',
    permission: 'growth.manage',
    status: 'live',
    nav: {
      label: 'Tăng trưởng & Đối tác',
      icon: 'trending-up-outline',
      section: 'Menu chính',
    },
  },
  {
    path: '/admin/qr-campaigns',
    workspace: 'admin',
    permission: 'growth.manage',
    status: 'live',
    nav: {
      label: 'QR Code Download',
      icon: 'qr-code-outline',
      section: 'Menu chính',
    },
  },
  {
    path: '/admin/qr-campaigns/:id',
    workspace: 'admin',
    permission: 'growth.manage',
    status: 'live',
    pattern: '/admin/qr-campaigns/:id',
  },
  {
    path: '/admin/pickup-campaigns',
    workspace: 'admin',
    permission: 'growth.manage',
    status: 'live',
    nav: {
      label: 'Campaign Giao Lưu',
      icon: 'flag-outline',
      section: 'Menu chính',
    },
  },
  {
    path: '/admin/pickup-campaigns/:id',
    workspace: 'admin',
    permission: 'growth.manage',
    status: 'live',
    pattern: '/admin/pickup-campaigns/:id',
  },
  {
    path: '/admin/moderation',
    workspace: 'admin',
    permission: 'moderation.manage',
    status: 'live',
    nav: {
      label: 'Kiểm duyệt',
      icon: 'shield-checkmark-outline',
      section: 'Vận hành',
    },
  },
  {
    path: '/admin/support',
    workspace: 'admin',
    permission: 'support.manage',
    status: 'live',
    nav: {
      label: 'Hỗ trợ',
      icon: 'chatbubbles-outline',
      section: 'Vận hành',
    },
  },
  {
    path: '/admin/audit',
    workspace: 'admin',
    permission: 'audit.view',
    status: 'live',
    nav: {
      label: 'Nhật ký hệ thống',
      icon: 'document-text-outline',
      section: 'Vận hành',
    },
  },
  {
    path: '/admin/settings',
    workspace: 'admin',
    permission: 'system.settings',
    status: 'live',
    nav: {
      label: 'Cài đặt',
      icon: 'settings-outline',
      section: 'Hệ thống',
    },
  },

  // --- Owner workspace ---
  {
    path: '/owner',
    workspace: 'owner',
    permission: 'owner.dashboard',
    status: 'live',
    nav: { label: 'Tổng quan', icon: 'grid-outline', section: 'Menu chính' },
  },
  {
    path: '/owner/venues',
    workspace: 'owner',
    permission: 'owner.dashboard',
    status: 'live',
    nav: { label: 'Sân của tôi', icon: 'business-outline', section: 'Menu chính' },
  },
  {
    path: '/owner/calendar',
    workspace: 'owner',
    permission: 'calendar.venue',
    status: 'live',
    nav: { label: 'Lịch sân', icon: 'calendar-outline', section: 'Menu chính' },
  },
  {
    path: '/owner/bookings',
    workspace: 'owner',
    permission: 'bookings.venue',
    status: 'live',
    nav: {
      label: 'Đặt sân',
      icon: 'receipt-outline',
      section: 'Menu chính',
    },
  },
  {
    path: '/owner/finance',
    workspace: 'owner',
    permission: 'finance.venue',
    status: 'live',
    nav: { label: 'Tài chính', icon: 'cash-outline', section: 'Menu chính' },
  },
  {
    path: '/owner/analytics',
    workspace: 'owner',
    permission: 'analytics.venue',
    status: 'live',
    nav: {
      label: 'Thống kê',
      icon: 'analytics-outline',
      section: 'Menu chính',
    },
  },

  // --- Organizer workspace ---
  {
    path: '/organizer',
    workspace: 'organizer',
    permission: 'organizer.dashboard',
    status: 'live',
    nav: { label: 'Tổng quan', icon: 'grid-outline', section: 'Menu chính' },
  },
  {
    path: '/organizer/tournaments',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    nav: { label: 'Giải đấu', icon: 'trophy-outline', section: 'Menu chính' },
  },
  {
    path: '/organizer/tournaments/create',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/create',
  },
  {
    path: '/organizer/tournaments/:id',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id',
  },
  {
    path: '/organizer/tournaments/:id/edit',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/edit',
  },
  {
    path: '/organizer/tournaments/:id/registrations',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/registrations',
  },
  {
    path: '/organizer/tournaments/:id/draw',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/draw',
  },
  {
    path: '/organizer/tournaments/:id/schedule',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/schedule',
  },
  {
    path: '/organizer/tournaments/:id/print',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/print',
  },
  {
    path: '/organizer/tournaments/:id/scoring/:matchId',
    workspace: 'organizer',
    permission: 'tournaments.organize',
    status: 'live',
    pattern: '/organizer/tournaments/:id/scoring/:matchId',
  },

  // --- Shared ---
  {
    path: '/shared/profile',
    workspace: 'shared',
    permission: 'profile.edit',
    status: 'live',
    nav: {
      label: 'Hồ sơ cá nhân',
      icon: 'person-outline',
      section: 'Hệ thống',
    },
  },

  // --- Utility ---
  {
    path: '/forbidden',
    workspace: 'shared',
    permission: 'profile.edit',
    status: 'live',
  },
];

function patternToRegex(pattern: string): RegExp {
  const regex = pattern
    .split('/')
    .map((part) =>
      part.startsWith(':')
        ? '[^/]+'
        : part.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    )
    .join('/');
  return new RegExp(`^${regex}$`);
}

const SORTED_MANIFEST = [...ROUTE_MANIFEST].sort(
  (a, b) =>
    (b.pattern ?? b.path).length - (a.pattern ?? a.path).length,
);

export function matchRouteManifest(pathname: string): RouteManifestEntry | undefined {
  const normalized =
    pathname.length > 1 && pathname.endsWith('/')
      ? pathname.slice(0, -1)
      : pathname;

  for (const entry of SORTED_MANIFEST) {
    const pattern = entry.pattern ?? entry.path;
    if (pattern.includes(':')) {
      if (patternToRegex(pattern).test(normalized)) return entry;
    } else if (normalized === entry.path) {
      return entry;
    }
  }

  return undefined;
}

export function getNavRoutesForWorkspace(
  workspace: PortalWorkspace,
): RouteManifestEntry[] {
  return ROUTE_MANIFEST.filter(
    (e) => e.workspace === workspace && e.nav && e.status === 'live',
  );
}

export function getBreadcrumbLabel(segment: string, pathname: string): string {
  const entry = ROUTE_MANIFEST.find(
    (e) => e.path === pathname || e.pattern === pathname,
  );
  if (entry?.nav?.breadcrumb) return entry.nav.breadcrumb;
  if (entry?.nav?.label) return entry.nav.label;

  const bySegment = ROUTE_MANIFEST.find((e) => {
    const last = e.path.split('/').filter(Boolean).pop();
    return last === segment && e.nav;
  });
  if (bySegment?.nav?.label) return bySegment.nav.label;

  return segment.charAt(0).toUpperCase() + segment.slice(1);
}
