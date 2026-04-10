'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { CampaignStats } from '@/graphql/types';

interface CampaignStatsCardsProps {
  stats?: CampaignStats;
  loading: boolean;
}

function SkeletonCard() {
  return (
    <div className="bg-surface border-surface-border rounded-xl border p-5">
      <div className="mb-4 flex items-start justify-between">
        <div className="space-y-2">
          <div className="bg-surface-hover h-4 w-28 animate-pulse rounded" />
          <div className="bg-surface-hover h-7 w-20 animate-pulse rounded" />
        </div>
        <div className="bg-surface-hover h-10 w-10 animate-pulse rounded-lg" />
      </div>
      <div className="bg-surface-hover h-2 w-full animate-pulse rounded-full" />
    </div>
  );
}

export function CampaignStatsCards({
  stats,
  loading,
}: CampaignStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const fillRatePct = Math.round((stats?.avgFillRate ?? 0) * 100);
  const returnRatePct = Math.round((stats?.returnRate ?? 0) * 100);

  const cards = [
    {
      key: 'checkins',
      label: 'Tổng Check-in',
      value: (stats?.totalCheckIns ?? 0).toLocaleString('vi-VN'),
      sub: `${stats?.uniqueParticipants ?? 0} người chơi unique`,
      icon: 'checkmark-done-outline',
      iconColor: 'text-green-600',
      iconBg: 'bg-green-500/10',
      bar: null,
    },
    {
      key: 'fillrate',
      label: 'Fill Rate',
      value: `${fillRatePct}%`,
      sub: `${stats?.totalSlots ?? 0} slot tổng cộng`,
      icon: 'people-outline',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-500/10',
      bar: { value: fillRatePct, color: 'bg-blue-500' },
    },
    {
      key: 'returnrate',
      label: 'Retention Rate',
      value: `${returnRatePct}%`,
      sub: 'Người chơi ≥ 2 kèo',
      icon: 'repeat-outline',
      iconColor: 'text-purple-600',
      iconBg: 'bg-purple-500/10',
      bar: { value: returnRatePct, color: 'bg-purple-500' },
    },
    {
      key: 'delta',
      label: 'Check-in Delta',
      value:
        stats?.avgCheckInDeltaMinutes != null
          ? `${stats.avgCheckInDeltaMinutes > 0 ? '+' : ''}${Math.round(stats.avgCheckInDeltaMinutes)} phút`
          : '—',
      sub:
        stats?.avgCheckInDeltaMinutes != null
          ? stats.avgCheckInDeltaMinutes < 0
            ? 'Đến sớm trung bình'
            : 'Đến muộn trung bình'
          : 'Chưa có dữ liệu',
      icon: 'time-outline',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-500/10',
      bar: null,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-surface border-surface-border rounded-xl border p-5"
        >
          <div className="mb-3 flex items-start justify-between">
            <div>
              <p className="text-faint text-sm font-medium">{card.label}</p>
              <h3 className="text-heading mt-1 text-2xl font-bold">
                {card.value}
              </h3>
              <p className="text-faint mt-0.5 text-xs">{card.sub}</p>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}
            >
              <IonIcon name={card.icon} className={card.iconColor} />
            </div>
          </div>
          {card.bar && (
            <div className="bg-overlay-subtle h-1.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${card.bar.color}`}
                style={{ width: `${Math.min(card.bar.value, 100)}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
