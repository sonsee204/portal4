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

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/atoms/Logo';
import { NavItem } from '@/components/molecules/NavItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { WorkspaceSwitcher } from '@/components/molecules/WorkspaceSwitcher';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import type { UserRole } from '@/types';
import { can, getAccessibleWorkspaces } from '@/lib/permissions';
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
  platformOwnerOnly?: boolean;
  venueOwnerOnly?: boolean;
  ownerOnly?: boolean;
}

function isOwnerNavHref(href: string): boolean {
  return href === '/owner' || href.startsWith('/owner/');
}

function shouldSkipOwnerPortalPermissionCheck(
  href: string,
  role: UserRole | null,
  hasVenueAccess: boolean
): boolean {
  return (
    isOwnerNavHref(href) &&
    Boolean(role) &&
    (hasVenueAccess || role === 'FACILITY_OWNER')
  );
}

function filterNavByRole(
  nav: SidebarNavSection[],
  role: UserRole | null,
  isPlatformOwner = false,
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
        if (
          item.venueOwnerOnly ||
          (item.ownerOnly && item.href.startsWith('/owner/'))
        ) {
          const isVenueOwnerOnAnyVenue =
            venueFilter?.venues.some((venue) => venue.isOwner) ?? false;
          if (!isVenueOwnerOnAnyVenue && !venueFilter?.isVenueOwner) {
            return false;
          }
        } else if (
          item.platformOwnerOnly ||
          (item.ownerOnly && !item.href.startsWith('/owner/'))
        ) {
          if (!isPlatformOwner) {
            return false;
          }
        }
        if (
          item.permission &&
          !shouldSkipOwnerPortalPermissionCheck(
            item.href,
            role,
            hasVenueAccess
          ) &&
          !can(role, item.permission, [], hasVenueAccess, isPlatformOwner)
        ) {
          return false;
        }
        if (venueFilter && isOwnerNavHref(item.href)) {
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

export { filterNavByRole };

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
  const isPlatformOwner = user?.isOwner ?? false;
  const hasVenueAccess = user?.hasVenueAccess ?? false;
  const venueContext = useOptionalVenueContext();

  const filteredNav = filterNavByRole(
    nav,
    userRole,
    isPlatformOwner,
    hasVenueAccess,
    venueContext
      ? {
          venues: venueContext.venues,
          permissions: venueContext.permissions,
          isVenueOwner: venueContext.isOwner,
        }
      : undefined
  );

  const showWorkspaceSwitcher = useMemo(
    () =>
      getAccessibleWorkspaces(
        userRole,
        user?.portalCapabilities ?? [],
        hasVenueAccess,
        isPlatformOwner
      ).length >= 2,
    [userRole, user?.portalCapabilities, hasVenueAccess, isPlatformOwner]
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

        {showWorkspaceSwitcher ? (
          <div className="border-surface-border border-t p-4">
            <WorkspaceSwitcher variant="sidebar" />
          </div>
        ) : null}
      </aside>
    </>
  );
}
