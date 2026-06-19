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

import { useEffect, useMemo, type ReactNode, Children } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/auth';
import {
  canAccessRoute,
  canAccessWorkspace,
  type PortalWorkspace,
} from '@/lib/permissions';

interface AccessGuardProps {
  children: ReactNode;
  workspace: PortalWorkspace;
}

/**
 * Fine-grained route guard — redirects to /forbidden when role lacks permission.
 */
export function AccessGuard({ children, workspace }: AccessGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const isInitialized = useAuthStore((s) => s.isInitialized);
  const isLoading = useAuthStore((s) => s.isLoading);
  const role = user?.role ?? null;
  const capabilities = useMemo(
    () => user?.portalCapabilities ?? [],
    [user?.portalCapabilities]
  );
  const isPlatformOwner = user?.isOwner ?? false;
  const hasVenueAccess = user?.hasVenueAccess ?? false;
  const authPending = !isInitialized || isLoading || (isInitialized && !user);

  useEffect(() => {
    if (authPending) return;

    if (
      !role ||
      !canAccessWorkspace(role, workspace, capabilities, hasVenueAccess)
    ) {
      router.replace('/forbidden');
      return;
    }

    if (
      !canAccessRoute(
        role,
        pathname,
        capabilities,
        isPlatformOwner,
        hasVenueAccess
      )
    ) {
      router.replace('/forbidden');
    }
  }, [
    authPending,
    role,
    capabilities,
    isPlatformOwner,
    hasVenueAccess,
    pathname,
    workspace,
    router,
  ]);

  if (authPending) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <p className="text-muted text-sm">Đang tải...</p>
      </div>
    );
  }

  if (
    !role ||
    !canAccessWorkspace(role, workspace, capabilities, hasVenueAccess)
  ) {
    return null;
  }

  if (
    !canAccessRoute(
      role,
      pathname,
      capabilities,
      isPlatformOwner,
      hasVenueAccess
    )
  ) {
    return null;
  }

  return Children.toArray(children);
}
