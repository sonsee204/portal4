/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { usePathname } from 'next/navigation';
import { DashboardLayout } from '@/components/templates/DashboardLayout';
import { AccessGuard } from '@/components/atoms/AccessGuard';
import { WorkspaceSwitcher } from '@/components/molecules/WorkspaceSwitcher';
import { VenueSwitcher } from '@/components/molecules/VenueSwitcher';
import { getBreadcrumbLabel } from '@/lib/permissions/navigation';
import { WORKSPACE_LABELS, type PortalWorkspace } from '@/lib/permissions';
import type { SidebarNavSection } from '@/lib/permissions/navigation';

const WORKSPACE_HOME: Record<PortalWorkspace, string> = {
  admin: '/admin',
  owner: '/owner',
  organizer: '/organizer',
  shared: '/shared/profile',
};

interface WorkspaceDashboardShellProps {
  children: React.ReactNode;
  workspace: PortalWorkspace;
  nav: SidebarNavSection[];
  /** @deprecated Prefer built-in owner header slot — avoids RSC slot key warnings. */
  extraHeaderActions?: React.ReactNode;
}

export function WorkspaceDashboardShell({
  children,
  workspace,
  nav,
  extraHeaderActions,
}: WorkspaceDashboardShellProps) {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
  const homeHref = WORKSPACE_HOME[workspace];

  const breadcrumbs = [
    { label: 'Trang chủ', href: homeHref },
    ...segments.slice(1).map((seg, i) => {
      const href = '/' + segments.slice(0, i + 2).join('/');
      return {
        label: getBreadcrumbLabel(seg, href),
        href: i < segments.length - 2 ? href : undefined,
      };
    }),
  ];

  return (
    <AccessGuard workspace={workspace}>
      <DashboardLayout
        nav={nav}
        workspaceLabel={WORKSPACE_LABELS[workspace]}
        breadcrumbs={breadcrumbs}
        headerActions={
          <div className="flex items-center gap-2">
            {workspace === 'owner' ? (
              <VenueSwitcher key="venue-switcher" />
            ) : null}
            {extraHeaderActions}
            <WorkspaceSwitcher key="workspace-switcher" />
          </div>
        }
      >
        {children}
      </DashboardLayout>
    </AccessGuard>
  );
}
