'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { QrAnalyticsSummary } from '@/types';

interface QrSummaryCardsProps {
  summary?: QrAnalyticsSummary;
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
      <div className="bg-surface-hover h-4 w-32 animate-pulse rounded" />
    </div>
  );
}

export function QrSummaryCards({ summary, loading }: QrSummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      key: 'totalScans',
      label: 'Tổng lượt quét',
      value: (summary?.totalScans ?? 0).toLocaleString('vi-VN'),
      icon: 'qr-code-outline',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      subtitle: 'tất cả chiến dịch',
    },
    {
      key: 'uniqueDevices',
      label: 'Thiết bị duy nhất',
      value: (summary?.uniqueDevices ?? 0).toLocaleString('vi-VN'),
      icon: 'phone-portrait-outline',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      subtitle: 'ước tính',
    },
    {
      key: 'ios',
      label: 'iOS',
      value: `${summary?.iosPercentage ?? 0}%`,
      icon: 'logo-apple',
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-500/10',
      subtitle: 'lượt quét từ iPhone/iPad',
    },
    {
      key: 'android',
      label: 'Android',
      value: `${summary?.androidPercentage ?? 0}%`,
      icon: 'logo-android',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      subtitle: 'lượt quét từ Android',
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.key}
          className="bg-surface border-surface-border rounded-xl border p-5"
        >
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-faint text-sm font-medium">{card.label}</p>
              <h3 className="text-heading mt-1 text-2xl font-bold">
                {card.value}
              </h3>
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.iconBg}`}
            >
              <IonIcon name={card.icon} className={card.iconColor} />
            </div>
          </div>
          <p className="text-faint text-xs">{card.subtitle}</p>
        </div>
      ))}
    </div>
  );
}
