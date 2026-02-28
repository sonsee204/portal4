/**
 * Centralized sidebar navigation — portal structure.
 * Each item can optionally require a PortalFeature for role-based visibility.
 */

import type { PortalFeature } from '@/lib/permissions';

/** Routes that are currently enabled (not dimmed/disabled). All others show as disabled. */
export const ENABLED_SIDEBAR_ROUTES = ['/users', '/audit', '/growth', '/support', '/tournaments'] as const;

export interface NavItem {
  href: string;
  label: string;
  icon: string;
  badge?: number;
  /** Feature required to see this item. If not set, visible to all authenticated users. */
  requiredFeature?: PortalFeature;
}

export interface SidebarNavSection {
  section: string;
  items: NavItem[];
}

export const sidebarNav: SidebarNavSection[] = [
  {
    section: 'Menu chính',
    items: [
      { href: '/', label: 'Tổng quan', icon: 'grid-outline' },
      {
        href: '/users',
        label: 'Quản lý người dùng',
        icon: 'people-outline',
        requiredFeature: 'user_management',
      },
      {
        href: '/ecosystem',
        label: 'Hệ sinh thái',
        icon: 'git-network-outline',
        requiredFeature: 'ecosystem',
      },
      {
        href: '/tournaments',
        label: 'Giải đấu',
        icon: 'trophy-outline',
        requiredFeature: 'tournaments',
      },
      {
        href: '/finance',
        label: 'Tài chính',
        icon: 'cash-outline',
        requiredFeature: 'finance',
      },
      {
        href: '/calendar',
        label: 'Lịch sân',
        icon: 'calendar-outline',
        requiredFeature: 'calendar',
      },
      {
        href: '/growth',
        label: 'Tăng trưởng & Đối tác',
        icon: 'trending-up-outline',
        requiredFeature: 'growth',
      },
    ],
  },
  {
    section: 'Vận hành',
    items: [
      {
        href: '/moderation',
        label: 'Kiểm duyệt',
        icon: 'shield-checkmark-outline',
        requiredFeature: 'moderation',
      },
      {
        href: '/support',
        label: 'Hỗ trợ',
        icon: 'chatbubbles-outline',
        requiredFeature: 'support',
      },
      {
        href: '/cms',
        label: 'Nội dung & Banner',
        icon: 'images-outline',
        requiredFeature: 'cms',
      },
      {
        href: '/audit',
        label: 'Nhật ký hệ thống',
        icon: 'document-text-outline',
        requiredFeature: 'audit',
      },
    ],
  },
  {
    section: 'Hệ thống',
    items: [
      {
        href: '/settings',
        label: 'Cài đặt',
        icon: 'settings-outline',
        requiredFeature: 'system_settings',
      },
    ],
  },
];
