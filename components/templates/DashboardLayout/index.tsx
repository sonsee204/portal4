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

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/organisms/Sidebar';
import { TopHeader } from '@/components/organisms/TopHeader';
import type { BreadcrumbItem } from '@/components/molecules/Breadcrumb';
import type { SidebarNavSection } from '@/lib/permissions/navigation';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  nav: SidebarNavSection[];
  breadcrumbs?: BreadcrumbItem[];
  workspaceLabel?: string;
  headerActions?: React.ReactNode;
  className?: string;
}

export function DashboardLayout({
  children,
  nav,
  breadcrumbs,
  workspaceLabel,
  headerActions,
  className,
}: DashboardLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen">
      <Sidebar
        nav={nav}
        activePath={pathname}
        workspaceLabel={workspaceLabel}
      />

      <div className="flex min-w-0 flex-1 flex-col lg:ml-72">
        <div className="bg-primary/5 pointer-events-none absolute top-0 left-0 h-96 w-full blur-3xl" />

        <TopHeader breadcrumbs={breadcrumbs} actions={headerActions} />

        <main
          className={cn(
            'relative min-w-0 flex-1 overflow-y-auto px-6 py-8 md:px-8',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
