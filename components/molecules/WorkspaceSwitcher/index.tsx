/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
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

export function WorkspaceSwitcher() {
  const router = useRouter();
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

  if (workspaces.length < 2) {
    return null;
  }

  return (
    <div className="relative">
      <details className="group">
        <summary className="text-secondary hover:text-primary flex cursor-pointer list-none items-center gap-2 rounded-lg px-2 py-1 text-sm font-medium transition-colors">
          <IonIcon name="swap-horizontal-outline" size="sm" />
          <span className="hidden sm:inline">Workspace</span>
          <IonIcon
            name="chevron-down-outline"
            size="sm"
            className="transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="border-surface-border bg-surface absolute right-0 z-50 mt-2 min-w-[200px] rounded-xl border p-1 shadow-2xl">
          {workspaces.map((ws) => (
            <Button
              key={ws}
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={() => router.push(WORKSPACE_HOME[ws])}
            >
              {WORKSPACE_LABELS[ws]}
            </Button>
          ))}
        </div>
      </details>
    </div>
  );
}
