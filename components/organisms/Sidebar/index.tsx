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

'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/atoms/Logo';
import { Avatar } from '@/components/atoms/Avatar';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { NavItem } from '@/components/molecules/NavItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';
import { canAccess } from '@/lib/permissions';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import { useLogout } from '@/hooks/useLogout';
import {
  ENABLED_SIDEBAR_ROUTES,
  type SidebarNavSection,
  type NavItem as NavItemType,
} from '@/config/navigation';

export type { SidebarNavSection };

export interface SidebarProps {
  nav: SidebarNavSection[];
  activePath?: string;
  className?: string;
}

/**
 * Filter navigation items based on user role
 */
function filterNavByRole(
  nav: SidebarNavSection[],
  role: UserRole | null
): SidebarNavSection[] {
  return nav
    .map((section) => ({
      ...section,
      items: section.items.filter((item: NavItemType) => {
        // Items without requiredFeature are visible to all
        if (!item.requiredFeature) return true;
        return canAccess(role, item.requiredFeature);
      }),
    }))
    .filter((section) => section.items.length > 0);
}

export function Sidebar({ nav, activePath = '/', className }: SidebarProps) {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role ?? null;

  const { logout, isLoggingOut } = useLogout();

  // Filter navigation based on role
  const filteredNav = filterNavByRole(nav, userRole);

  return (
    <>
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={cn(
          'glass-panel border-surface-border fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r transition-transform duration-300',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 pb-4">
          <Logo />
          <button
            className="text-muted hover:text-heading lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-2">
          {filteredNav.map((group) => (
            <div key={group.section}>
              <p className="text-faint mb-2 px-4 text-[11px] font-bold tracking-widest uppercase">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    active={activePath === item.href}
                    disabled={
                      !ENABLED_SIDEBAR_ROUTES.includes(
                        item.href as (typeof ENABLED_SIDEBAR_ROUTES)[number]
                      )
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="space-y-4 p-4">
          {/* Server status */}
          <div className="border-surface-border from-overlay-faint relative overflow-hidden rounded-xl border bg-gradient-to-br to-transparent p-4">
            <div className="bg-primary/20 absolute -top-4 -right-4 h-16 w-16 rounded-full blur-2xl" />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-muted text-xs">Server Status</span>
              <span className="neon-glow h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <ProgressBar value={99} variant="primary" />
            <p className="text-faint mt-1.5 text-[10px]">Uptime: 99.9%</p>
          </div>

          {/* User profile */}
          <div className="flex items-center gap-3 rounded-xl p-2">
            <Avatar
              fallback={
                user?.displayName
                  ?.split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase() || 'U'
              }
              src={user?.photoURL}
              status="online"
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="text-heading truncate text-sm font-medium">
                {user?.displayName || user?.fullName || 'User'}
              </p>
              <p className="text-faint truncate text-xs">
                {userRole ? ROLE_DISPLAY_NAMES[userRole] : ''}
              </p>
            </div>
            <button
              onClick={() => void logout()}
              disabled={isLoggingOut}
              title="Đăng xuất"
              className={cn(
                'transition-colors',
                isLoggingOut
                  ? 'text-faint pointer-events-none'
                  : 'text-faint hover:text-red-400'
              )}
            >
              <IonIcon
                name={isLoggingOut ? 'sync-outline' : 'log-out-outline'}
                size="sm"
                className={isLoggingOut ? 'animate-spin' : undefined}
              />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
