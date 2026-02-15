'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { AuditStats } from '@/types';

interface AuditStatsCardsProps {
  stats: AuditStats | undefined;
  loading: boolean;
}

const cards = [
  {
    key: 'totalEvents' as const,
    label: 'Tổng sự kiện',
    icon: 'list-outline',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    key: 'failedLast24h' as const,
    label: 'Lỗi (24h)',
    icon: 'alert-circle-outline',
    color: 'text-red-400',
    bg: 'bg-red-500/10',
  },
  {
    key: 'securityLast7d' as const,
    label: 'Bảo mật (7 ngày)',
    icon: 'shield-outline',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    key: 'authLast24h' as const,
    label: 'Xác thực (24h)',
    icon: 'key-outline',
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
  },
];

export function AuditStatsCards({ stats, loading }: AuditStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-surface border-surface-border rounded-xl border p-4"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.bg}`}
            >
              <IonIcon name={card.icon} className={card.color} />
            </div>
            <div>
              <p className="text-faint text-xs">{card.label}</p>
              {loading ? (
                <div className="bg-surface-hover mt-1 h-6 w-16 animate-pulse rounded" />
              ) : (
                <p className="text-heading text-xl font-bold">
                  {stats?.[card.key]?.toLocaleString() ?? '0'}
                </p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
