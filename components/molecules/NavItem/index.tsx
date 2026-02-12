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
  className?: string;
}

export function NavItem({
  href,
  label,
  icon,
  active,
  badge,
  className,
}: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all',
        active
          ? 'bg-primary/10 border-primary/20 neon-glow border text-white'
          : 'text-slate-400 hover:bg-white/5 hover:text-white',
        className
      )}
    >
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
        <span className="bg-primary relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}
