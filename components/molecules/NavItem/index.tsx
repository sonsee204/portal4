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

import Link from 'next/link';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface NavItemProps {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
  /** Optional count badge */
  badge?: number;
  /** When true, item is dimmed and not clickable */
  disabled?: boolean;
  className?: string;
}

export function NavItem({
  href,
  label,
  icon,
  active,
  badge,
  disabled,
  className,
}: NavItemProps) {
  const baseClassName = cn(
    'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
    disabled
      ? 'cursor-not-allowed opacity-50 pointer-events-none text-faint'
      : active
        ? 'bg-primary/10 border-primary/20 neon-glow text-heading border'
        : 'text-muted hover:bg-surface-hover hover:text-heading',
    className
  );

  if (disabled) {
    return (
      <span className={baseClassName} title="Tính năng đang được phát triển">
        <IonIcon name={icon} size="md" className="relative z-10" />
        <span className="relative z-10">{label}</span>
        {badge != null && badge > 0 && (
          <span className="bg-primary text-heading relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold">
            {badge}
          </span>
        )}
      </span>
    );
  }

  return (
    <Link href={href} className={baseClassName}>
      {active && (
        <div className="from-primary/20 absolute inset-0 rounded-xl bg-gradient-to-r to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      )}
      <IonIcon
        name={icon}
        size="md"
        className={cn(
          'relative z-10 transition-colors',
          active ? 'text-primary' : 'group-hover:text-primary'
        )}
      />
      <span className="relative z-10">{label}</span>
      {badge != null && badge > 0 && (
        <span className="bg-primary text-heading relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold">
          {badge}
        </span>
      )}
    </Link>
  );
}
