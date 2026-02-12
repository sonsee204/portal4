'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Avatar } from '@/components/atoms/Avatar';
import { SearchInput } from '@/components/molecules/SearchInput';
import {
  Breadcrumb,
  type BreadcrumbItem,
} from '@/components/molecules/Breadcrumb';
import { NotificationBell } from '@/components/molecules/NotificationBell';
import { useUIStore } from '@/stores/ui';

export interface TopHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  /** Optional slot for page-level actions (e.g. "Save Changes" button) */
  actions?: React.ReactNode;
  className?: string;
}

export function TopHeader({ breadcrumbs, actions, className }: TopHeaderProps) {
  const { setMobileNavOpen } = useUIStore();

  return (
    <header
      className={cn(
        'border-surface-border bg-bg-dark/80 sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-6 backdrop-blur-md',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="text-slate-400 hover:text-white lg:hidden"
          onClick={() => setMobileNavOpen(true)}
        >
          <IonIcon name="menu-outline" size="md" />
        </button>
        {breadcrumbs && breadcrumbs.length > 0 && (
          <Breadcrumb items={breadcrumbs} className="hidden sm:flex" />
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {actions}
        <SearchInput
          placeholder="Search..."
          wrapperClassName="hidden md:block w-64"
        />
        <NotificationBell count={3} />
        <div className="bg-surface-border hidden h-8 w-px md:block" />
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-white">Admin</p>
            <p className="text-primary text-xs">Super Admin</p>
          </div>
          <Avatar fallback="AD" status="online" />
        </div>
      </div>
    </header>
  );
}
