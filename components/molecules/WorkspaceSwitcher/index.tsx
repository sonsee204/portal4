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

import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useAuthStore } from '@/stores/auth';
import {
  getAccessibleWorkspaces,
  WORKSPACE_LABELS,
  type PortalWorkspace,
} from '@/lib/permissions';

const WORKSPACE_HOME: Record<PortalWorkspace, string> = {
  admin: '/admin',
  owner: '/owner',
  organizer: '/organizer',
  shared: '/shared/profile',
};

const WORKSPACE_ICONS: Record<PortalWorkspace, string> = {
  admin: 'shield-outline',
  owner: 'business-outline',
  organizer: 'trophy-outline',
  shared: 'person-outline',
};

function resolveCurrentWorkspace(pathname: string): PortalWorkspace | null {
  if (pathname.startsWith('/admin')) return 'admin';
  if (pathname.startsWith('/owner')) return 'owner';
  if (pathname.startsWith('/organizer')) return 'organizer';
  if (pathname.startsWith('/shared')) return 'shared';
  return null;
}

export interface WorkspaceSwitcherProps {
  variant?: 'sidebar' | 'header';
  className?: string;
}

export function WorkspaceSwitcher({
  variant = 'sidebar',
  className,
}: WorkspaceSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? null;
  const portalCapabilities = user?.portalCapabilities;

  const workspaces = useMemo(
    () =>
      getAccessibleWorkspaces(
        role,
        portalCapabilities ?? [],
        user?.hasVenueAccess ?? false
      ),
    [role, portalCapabilities, user?.hasVenueAccess]
  );

  const currentWorkspace = resolveCurrentWorkspace(pathname);
  const triggerLabel = currentWorkspace
    ? WORKSPACE_LABELS[currentWorkspace]
    : 'Chọn không gian';

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open]);

  if (workspaces.length < 2) {
    return null;
  }

  const isSidebar = variant === 'sidebar';

  const handleSelect = (ws: PortalWorkspace) => {
    setOpen(false);
    router.push(WORKSPACE_HOME[ws]);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className={cn(
          'text-secondary hover:text-primary flex cursor-pointer items-center gap-2 rounded-xl transition-colors',
          isSidebar
            ? 'border-surface-border bg-surface/60 hover:bg-surface-hover w-full border px-3 py-2.5 text-sm font-medium'
            : 'px-2 py-1 text-sm font-medium',
          open && 'ring-primary/40 ring-2'
        )}
      >
        <IonIcon
          name="swap-horizontal-outline"
          size="sm"
          className="shrink-0"
        />
        <span className="text-heading min-w-0 flex-1 truncate text-left font-medium">
          {triggerLabel}
        </span>
        <IonIcon
          name="chevron-down-outline"
          size="sm"
          className={cn('shrink-0 transition-transform', open && 'rotate-180')}
        />
      </button>

      {open ? (
        <div
          role="listbox"
          className={cn(
            'border-surface-border bg-surface absolute z-50 min-w-[220px] rounded-xl border p-1 shadow-2xl',
            isSidebar
              ? 'right-0 bottom-full left-0 mb-2 w-full'
              : 'right-0 mt-2'
          )}
        >
          <p className="text-faint px-3 py-2 text-[10px] font-bold tracking-widest uppercase">
            Chuyển không gian
          </p>
          {workspaces.map((ws) => {
            const isActive = ws === currentWorkspace;
            return (
              <button
                key={ws}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => handleSelect(ws)}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  isActive
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-body hover:bg-surface-hover'
                )}
              >
                <IonIcon
                  name={WORKSPACE_ICONS[ws]}
                  size="sm"
                  className={isActive ? 'text-primary' : 'text-muted'}
                />
                <span className="flex-1">{WORKSPACE_LABELS[ws]}</span>
                {isActive ? (
                  <IonIcon name="checkmark-outline" size="sm" />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}
