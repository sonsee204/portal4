'use client';

import { cn } from '@/lib/utils';

export interface TabItem {
  label: string;
  value: string;
}

export interface TabGroupProps {
  tabs: TabItem[];
  active: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TabGroup({ tabs, active, onChange, className }: TabGroupProps) {
  return (
    <div
      className={cn(
        'border-surface-border bg-bg inline-flex items-center gap-1 rounded-lg border p-1',
        className
      )}
    >
      {tabs.map((tab) => (
        <button
          key={tab.value}
          type="button"
          onClick={() => onChange(tab.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            active === tab.value
              ? 'bg-surface border-surface-border border text-heading shadow-sm'
              : 'text-faint hover:text-heading'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
