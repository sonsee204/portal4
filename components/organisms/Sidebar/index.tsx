'use client';

import { cn } from '@/lib/utils';
import { Logo } from '@/components/atoms/Logo';
import { Avatar } from '@/components/atoms/Avatar';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { NavItem } from '@/components/molecules/NavItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useUIStore } from '@/stores/ui';

export interface SidebarNavSection {
  section: string;
  items: {
    href: string;
    label: string;
    icon: string;
    badge?: number;
  }[];
}

export interface SidebarProps {
  nav: SidebarNavSection[];
  activePath?: string;
  className?: string;
}

export function Sidebar({ nav, activePath = '/', className }: SidebarProps) {
  const { mobileNavOpen, setMobileNavOpen } = useUIStore();

  return (
    <>
      {/* Mobile overlay */}
      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      )}

      <aside
        className={cn(
          'glass-panel border-surface-border fixed top-0 left-0 z-50 flex h-screen w-72 flex-col border-r transition-transform duration-300',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
          'lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between p-6 pb-4">
          <Logo />
          <button
            className="text-slate-400 hover:text-white lg:hidden"
            onClick={() => setMobileNavOpen(false)}
          >
            <IonIcon name="close-outline" size="md" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="no-scrollbar flex-1 space-y-6 overflow-y-auto px-4 py-2">
          {nav.map((group) => (
            <div key={group.section}>
              <p className="mb-2 px-4 text-[11px] font-bold tracking-widest text-slate-500 uppercase">
                {group.section}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={item.label}
                    icon={item.icon}
                    badge={item.badge}
                    active={activePath === item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="space-y-4 p-4">
          {/* Server status */}
          <div className="border-surface-border relative overflow-hidden rounded-xl border bg-gradient-to-br from-white/5 to-transparent p-4">
            <div className="bg-primary/20 absolute -top-4 -right-4 h-16 w-16 rounded-full blur-2xl" />
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs text-slate-400">Server Status</span>
              <span className="neon-glow h-2 w-2 rounded-full bg-emerald-500" />
            </div>
            <ProgressBar value={99} variant="primary" />
            <p className="mt-1.5 text-[10px] text-slate-500">Uptime: 99.9%</p>
          </div>

          {/* User profile */}
          <div className="hover:bg-surface-hover flex cursor-pointer items-center gap-3 rounded-xl p-2 transition-colors">
            <Avatar fallback="AD" status="online" size="sm" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">Admin</p>
              <p className="truncate text-xs text-slate-500">
                admin@hitri.tech
              </p>
            </div>
            <IonIcon
              name="log-out-outline"
              size="sm"
              className="text-slate-500 transition-colors hover:text-red-400"
            />
          </div>
        </div>
      </aside>
    </>
  );
}
