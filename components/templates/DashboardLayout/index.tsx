'use client';

import { cn } from '@/lib/utils';
import { Sidebar } from '@/components/organisms/Sidebar';
import { TopHeader } from '@/components/organisms/TopHeader';
import { sidebarNav } from '@/config/navigation';
import type { BreadcrumbItem } from '@/components/molecules/Breadcrumb';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  activePath?: string;
  breadcrumbs?: BreadcrumbItem[];
  className?: string;
}

export function DashboardLayout({
  children,
  activePath = '/',
  breadcrumbs,
  className,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar nav={sidebarNav} activePath={activePath} />

      {/* Main area — offset by sidebar width on desktop */}
      <div className="flex flex-1 flex-col lg:ml-72">
        {/* Ambient background glow */}
        <div className="bg-primary/5 pointer-events-none absolute top-0 left-0 h-96 w-full blur-3xl" />

        <TopHeader breadcrumbs={breadcrumbs} />

        <main
          className={cn(
            'relative flex-1 overflow-y-auto px-6 py-8 md:px-8',
            className
          )}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
