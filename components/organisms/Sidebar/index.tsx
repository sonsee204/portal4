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
import { NavItem } from '@/components/molecules/NavItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';
import { can, ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import { useLogout } from '@/hooks/useLogout';
import type { SidebarNavSection } from '@/lib/permissions/navigation';
import type { PortalPermission } from '@/lib/permissions';
import { useOptionalVenueContext } from '@/components/providers/VenueContextProvider';
import {
  canAccessOwnerRoute,
  type VenuePermissionSet,
} from '@/lib/venue/permissions';

export type { SidebarNavSection };

export interface SidebarProps {
  nav: SidebarNavSection[];
  activePath?: string;
  workspaceLabel?: string;
  className?: string;
}

interface NavItemConfig {
  href: string;
  label: string;
  icon: string;
  permission?: PortalPermission;
  ownerOnly?: boolean;
}

function filterNavByRole(
  nav: SidebarNavSection[],
  role: UserRole | null,
  isOwner = false,
  hasVenueAccess = false,
  venueFilter?: {
    venues: Array<{
      myPermissions?: import('@/graphql/generated').VenueAction[] | null;
      isOwner?: boolean;
    }>;
    permissions: VenuePermissionSet;
    isVenueOwner: boolean;
  }
): SidebarNavSection[] {
  return nav
    .map((section) => ({
      ...section,
      items: section.items.filter((item: NavItemConfig) => {
        if (item.ownerOnly) {
          if (item.href.startsWith('/owner/')) {
            const isVenueOwnerOnAnyVenue =
              venueFilter?.venues.some((venue) => venue.isOwner) ?? false;
            if (!isVenueOwnerOnAnyVenue && !venueFilter?.isVenueOwner) {
              return false;
            }
          } else if (!isOwner) {
            return false;
          }
        }
        if (
          item.permission &&
          !can(role, item.permission, [], hasVenueAccess)
        ) {
          return false;
        }
        if (venueFilter && item.href.startsWith('/owner/')) {
          const visibleOnSelectedVenue = canAccessOwnerRoute(
            item.href,
            venueFilter.permissions,
            venueFilter.isVenueOwner
          );
          if (visibleOnSelectedVenue) return true;

          return venueFilter.venues.some((venue) =>
            canAccessOwnerRoute(
              item.href,
              (venue.myPermissions ?? []) as VenuePermissionSet,
              venue.isOwner ?? false
            )
          );
        }
        return true;
      }),
    }))
    .filter((section) => section.items.length > 0);
}

const WORKSPACE_ROOTS = new Set(['/admin', '/owner', '/organizer']);

export function Sidebar({
  nav,
  activePath = '/',
  workspaceLabel,
  className,
}: SidebarProps) {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);
  const userRole = user?.role ?? null;
  const isOwner = user?.isOwner ?? false;
  const hasVenueAccess = user?.hasVenueAccess ?? false;
  const venueContext = useOptionalVenueContext();

  const { logout, isLoggingOut } = useLogout();
  const filteredNav = filterNavByRole(
    nav,
    userRole,
    isOwner,
    hasVenueAccess,
    venueContext
      ? {
          venues: venueContext.venues,
          permissions: venueContext.permissions,
          isVenueOwner: venueContext.isOwner,
        }
      : undefined
  );

  return (
    <>
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
        <div className="flex items-center justify-between p-6 pb-2">
          <Logo />
          <button
            className="text-muted hover:text-heading lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>

        {workspaceLabel && (
          <p className="text-faint px-6 pb-3 text-[10px] font-bold tracking-widest uppercase">
            {workspaceLabel}
          </p>
        )}

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
                    active={
                      activePath === item.href ||
                      (!WORKSPACE_ROOTS.has(item.href) &&
                        activePath.startsWith(`${item.href}/`))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4">
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
