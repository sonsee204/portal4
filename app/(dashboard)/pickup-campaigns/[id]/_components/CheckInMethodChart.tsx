'use client';

import { IonIcon } from '@/components/atoms/IonIcon';
import type { CampaignStats } from '@/graphql/types';

interface CheckInMethodChartProps {
  stats?: CampaignStats;
  loading: boolean;
}

export function CheckInMethodChart({
  stats,
  loading,
}: CheckInMethodChartProps) {
  if (loading) {
    return (
      <div className="bg-surface border-surface-border rounded-xl border p-6">
        <div className="bg-surface-hover mb-4 h-5 w-36 animate-pulse rounded" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="bg-surface-hover h-4 w-20 animate-pulse rounded" />
              <div className="bg-surface-hover h-2 flex-1 animate-pulse rounded-full" />
              <div className="bg-surface-hover h-4 w-12 animate-pulse rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  const total = stats?.totalCheckIns ?? 0;

  const methods = [
    {
      label: 'QR Scan',
      count: stats?.qrScanCount ?? 0,
      icon: 'qr-code-outline',
      color: 'bg-green-500',
      textColor: 'text-green-600',
      description: 'Người chơi quét mã QR',
    },
    {
      label: 'Thủ công',
      count: stats?.manualCount ?? 0,
      icon: 'hand-left-outline',
      color: 'bg-amber-500',
      textColor: 'text-amber-600',
      description: 'Host check-in trực tiếp',
    },
    {
      label: 'Bulk',
      count: stats?.bulkCount ?? 0,
      icon: 'people-outline',
      color: 'bg-blue-500',
      textColor: 'text-blue-600',
      description: 'Check-in cả nhóm cùng lúc',
    },
  ];

  return (
    <div className="bg-surface border-surface-border rounded-xl border p-6">
      <h3 className="text-heading mb-4 text-sm font-semibold">
        Phương thức Check-in
      </h3>

      {total === 0 ? (
        <p className="text-faint text-sm">Chưa có dữ liệu</p>
      ) : (
        <div className="space-y-4">
          {methods.map((method) => {
            const pct =
              total > 0 ? Math.round((method.count / total) * 100) : 0;
            return (
              <div key={method.label} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-body flex items-center gap-1.5 font-medium">
                    <IonIcon name={method.icon} className={method.textColor} />
                    {method.label}
                    <span className="text-faint text-xs font-normal">
                      · {method.description}
                    </span>
                  </span>
                  <span className="text-heading font-semibold">
                    {method.count.toLocaleString('vi-VN')} ({pct}%)
                  </span>
                </div>
                <div className="bg-overlay-subtle h-2 overflow-hidden rounded-full">
                  <div
                    className={`h-full rounded-full ${method.color}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
