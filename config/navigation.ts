/**
 * Centralized sidebar navigation — portal structure from portal-ui HTML files.
 * All icons use Ionicons (synced with landing-page).
 */

import type { SidebarNavSection } from '@/components/organisms/Sidebar';

export const sidebarNav: SidebarNavSection[] = [
  {
    section: 'Main Menu',
    items: [
      { href: '/', label: 'Dashboard', icon: 'grid-outline' },
      { href: '/users', label: 'Quản lý người dùng', icon: 'people-outline' },
      {
        href: '/ecosystem',
        label: 'Hệ sinh thái',
        icon: 'git-network-outline',
      },
      {
        href: '/tournaments',
        label: 'Giải đấu',
        icon: 'trophy-outline',
      },
      { href: '/finance', label: 'Tài chính', icon: 'cash-outline' },
      { href: '/calendar', label: 'Lịch sân', icon: 'calendar-outline' },
    ],
  },
  {
    section: 'Operations',
    items: [
      {
        href: '/moderation',
        label: 'Kiểm duyệt',
        icon: 'shield-checkmark-outline',
      },
      { href: '/support', label: 'Hỗ trợ', icon: 'chatbubbles-outline' },
      { href: '/cms', label: 'CMS & Banner', icon: 'images-outline' },
      { href: '/audit', label: 'Nhật ký hệ thống', icon: 'document-text-outline' },
    ],
  },
  {
    section: 'System',
    items: [
      { href: '/settings', label: 'Cài đặt', icon: 'settings-outline' },
      {
        href: '/roles',
        label: 'Phân quyền (RBAC)',
        icon: 'key-outline',
      },
    ],
  },
];
