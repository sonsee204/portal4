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
import { WorkspaceDashboardShell } from '@/components/templates/WorkspaceDashboardShell';
import {
  adminSidebarNav,
  ownerSidebarNav,
  withProfileSection,
} from '@/config/navigation';
import { useAuthStore } from '@/stores/auth';

export default function SharedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const role = useAuthStore((s) => s.user?.role);

  const nav = useMemo(() => {
    const base = role === 'FACILITY_OWNER' ? ownerSidebarNav : adminSidebarNav;
    return withProfileSection(base);
  }, [role]);

  return (
    <WorkspaceDashboardShell workspace="shared" nav={nav}>
      {children}
    </WorkspaceDashboardShell>
  );
}
