'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { GrowthStats } from '@/types';

export interface GrowthKPI {
  key: string;
  label: string;
  value: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  trend?: { value: string; direction: 'up' | 'down' };
  subtitle?: string;
  progress?: { value: number; label: string };
}

interface GrowthStatsCardsProps {
  stats?: GrowthStats;
  loading: boolean;
}

function formatNumber(n: number): string {
  return n.toLocaleString('vi-VN');
}

function formatRevenue(n: number): string {
  if (n >= 1_000_000) return `${Math.round(n / 1_000_000)}M VND`;
  if (n >= 1_000) return `${Math.round(n / 1_000)}K VND`;
  return `${formatNumber(n)} VND`;
}

function buildKPIs(stats: GrowthStats): GrowthKPI[] {
  return [
    {
      key: 'totalNewUsers',
      label: 'Tổng người dùng mới',
      value: formatNumber(stats.totalNewUsers),
      icon: 'people-outline',
      iconColor: 'text-primary',
      iconBg: 'bg-primary/10',
      subtitle: 'trong khoảng thời gian',
    },
    {
      key: 'partnerContribution',
      label: 'Đóng góp từ đối tác',
      value: `${stats.partnerPercentage}%`,
      icon: 'hand-left-outline',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-500/10',
      progress: {
        value: stats.partnerPercentage,
        label: `so ${(100 - stats.partnerPercentage).toFixed(1)}% Hữu cơ`,
      },
    },
    {
      key: 'activationRate',
      label: 'Tỷ lệ kích hoạt',
      value: `${stats.activationRate}%`,
      icon: 'flash-outline',
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-500/10',
      subtitle: 'Trung bình toàn nguồn',
    },
    {
      key: 'totalRevenue',
      label: 'Tổng doanh thu quy đổi',
      value: formatRevenue(stats.totalRevenue),
      icon: 'wallet-outline',
      iconColor: 'text-emerald-500',
      iconBg: 'bg-emerald-500/10',
      subtitle: 'từ đối tác giới thiệu',
    },
  ];
}

export function GrowthStatsCards({ stats, loading }: GrowthStatsCardsProps) {
  const cards = stats ? buildKPIs(stats) : [];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border-surface-border rounded-xl border p-5"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="space-y-2">
                <div className="bg-surface-hover h-4 w-28 animate-pulse rounded" />
                <div className="bg-surface-hover h-7 w-20 animate-pulse rounded" />
              </div>
              <div className="bg-surface-hover h-10 w-10 animate-pulse rounded-lg" />
            </div>
            <div className="bg-surface-hover h-4 w-32 animate-pulse rounded" />
          </div>
        ))}
      </div>
    );
  }

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

          <div className="flex items-center text-xs font-medium">
            {card.trend && (
              <>
                <span
                  className={`flex items-center gap-0.5 rounded px-2 py-0.5 ${
                    card.trend.direction === 'up'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : 'bg-red-500/10 text-red-500'
                  }`}
                >
                  <IonIcon
                    name={
                      card.trend.direction === 'up'
                        ? 'trending-up-outline'
                        : 'trending-down-outline'
                    }
                    size="xs"
                  />
                  {card.trend.value}
                </span>
                {card.subtitle && (
                  <span className="text-faint ml-2">{card.subtitle}</span>
                )}
              </>
            )}

            {card.progress && (
              <div className="flex w-full items-center gap-2">
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/5 dark:bg-white/5">
                  <div className="flex h-full">
                    <div
                      className="rounded-full bg-purple-500"
                      style={{ width: `${card.progress.value}%` }}
                    />
                  </div>
                </div>
                <span className="text-faint whitespace-nowrap">
                  {card.progress.label}
                </span>
              </div>
            )}

            {!card.trend && !card.progress && card.subtitle && (
              <span className="text-faint">{card.subtitle}</span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
