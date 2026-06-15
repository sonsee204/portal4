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

import { IonIcon } from '@/components/atoms/IonIcon';
import type { QrCampaignStats } from '@/types';

interface QrStatsCardsProps {
  stats?: QrCampaignStats;
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

export function QrStatsCards({ stats, loading }: QrStatsCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  const total = stats?.totalScans ?? 0;

  const cards = [
    {
      key: 'total',
      label: 'Tổng lượt quét',
      value: total.toLocaleString('vi-VN'),
      icon: 'qr-code-outline',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      bar: null,
    },
    {
      key: 'unique',
      label: 'Thiết bị duy nhất',
      value: (stats?.uniqueDevices ?? 0).toLocaleString('vi-VN'),
      icon: 'phone-portrait-outline',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      bar: null,
    },
    {
      key: 'ios',
      label: 'iOS',
      value: `${stats?.iosPercentage ?? 0}%`,
      icon: 'logo-apple',
      iconColor: 'text-slate-600',
      iconBg: 'bg-slate-500/10',
      bar: { value: stats?.iosPercentage ?? 0, color: 'bg-slate-500' },
    },
    {
      key: 'android',
      label: 'Android',
      value: `${stats?.androidPercentage ?? 0}%`,
      icon: 'logo-android',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      bar: { value: stats?.androidPercentage ?? 0, color: 'bg-emerald-500' },
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
          {card.bar && (
            <div className="bg-overlay-subtle h-1.5 overflow-hidden rounded-full">
              <div
                className={`h-full rounded-full ${card.bar.color}`}
                style={{ width: `${card.bar.value}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
