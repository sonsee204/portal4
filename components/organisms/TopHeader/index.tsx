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
import { IonIcon } from '@/components/atoms/IonIcon';
import { Avatar } from '@/components/atoms/Avatar';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { SearchInput } from '@/components/molecules/SearchInput';
import {
  Breadcrumb,
  type BreadcrumbItem,
} from '@/components/molecules/Breadcrumb';
import { NotificationBell } from '@/components/molecules/NotificationBell';
import { useUIStore } from '@/stores/ui';
import { useAuthStore } from '@/stores/auth';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';

export interface TopHeaderProps {
  breadcrumbs?: BreadcrumbItem[];
  /** Optional slot for page-level actions (e.g. "Save Changes" button) */
  actions?: React.ReactNode;
  className?: string;
}

export function TopHeader({ breadcrumbs, actions, className }: TopHeaderProps) {
  const { setMobileNavOpen } = useUIStore();
  const user = useAuthStore((s) => s.user);

  const displayName = user?.displayName || user?.fullName || 'Người dùng';
  const initials =
    user?.displayName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    user?.fullName
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ||
    'U';

  return (
    <header
      className={cn(
        'border-surface-border bg-bg/80 sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b px-6 backdrop-blur-md',
        className
      )}
    >
      {/* Left side */}
      <div className="flex items-center gap-4">
        <button
          className="text-muted hover:text-heading lg:hidden"
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
          placeholder="Tìm kiếm..."
          wrapperClassName="hidden md:block w-64"
        />
        <ThemeToggle />
        <NotificationBell />
        <div className="bg-surface-border hidden h-8 w-px md:block" />
        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p
              className="text-heading max-w-[140px] truncate text-sm font-bold"
              title={displayName}
            >
              {displayName}
            </p>
            <p className="text-primary text-xs">
              {user?.role ? ROLE_DISPLAY_NAMES[user.role] : ''}
            </p>
          </div>
          <Avatar
            fallback={initials}
            src={user?.photoURL}
            status="online"
            size="sm"
          />
        </div>
      </div>
    </header>
  );
}
