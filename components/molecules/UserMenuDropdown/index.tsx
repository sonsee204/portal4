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

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useAuthStore } from '@/stores/auth';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import { useLogout } from '@/hooks/useLogout';
import { getUserAccountMenuItems } from '@/config/navigation';

export interface UserMenuDropdownProps {
  open: boolean;
  onClose: () => void;
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}

export function UserMenuDropdown({
  open,
  onClose,
  containerRef,
  className,
}: UserMenuDropdownProps) {
  const user = useAuthStore((s) => s.user);
  const { logout, isLoggingOut } = useLogout();

  const displayName = user?.displayName || user?.fullName || 'Người dùng';

  const menuItems = useMemo(
    () =>
      getUserAccountMenuItems(
        user?.role,
        user?.portalCapabilities ?? [],
        user?.isOwner ?? false,
        user?.hasVenueAccess ?? false,
      ),
    [user?.role, user?.portalCapabilities, user?.isOwner, user?.hasVenueAccess],
  );

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [open, onClose, containerRef]);

  if (!open) return null;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface absolute top-full right-0 z-50 mt-2 w-56 overflow-hidden rounded-xl border shadow-2xl',
        className,
      )}
    >
      <div className="border-surface-border border-b px-4 py-3">
        <p className="text-heading truncate text-sm font-semibold">
          {displayName}
        </p>
        <p className="text-muted truncate text-xs">
          {user?.role ? ROLE_DISPLAY_NAMES[user.role] : ''}
        </p>
      </div>

      <div className="p-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onClose}
            className="text-body hover:bg-surface-hover flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors"
          >
            <IonIcon name={item.icon} size="sm" className="text-muted" />
            {item.label}
          </Link>
        ))}

        {menuItems.length > 0 ? (
          <div className="border-surface-border my-1 border-t" />
        ) : null}

        <button
          type="button"
          disabled={isLoggingOut}
          onClick={() => {
            onClose();
            void logout();
          }}
          className={cn(
            'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors',
            isLoggingOut
              ? 'text-faint pointer-events-none'
              : 'text-red-400 hover:bg-red-500/10',
          )}
        >
          <IonIcon
            name={isLoggingOut ? 'sync-outline' : 'log-out-outline'}
            size="sm"
            className={isLoggingOut ? 'animate-spin' : undefined}
          />
          Đăng xuất
        </button>
      </div>
    </div>
  );
}
