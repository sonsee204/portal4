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

import { useState, useMemo } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ModuleCard } from './_components/ModuleCard';
import { NotificationForm } from './_components/NotificationForm';
import { DonutChart } from './_components/DonutChart';
import { QueryState } from '@/components/molecules/QueryState';
import { useSports } from '@/hooks/sport';
import { useAuditLogs } from '@/hooks/audit';
import type { SportType } from '@/types/mock';

const RECENT_LOGS_LIMIT = 5;

export default function EcosystemPage() {
  const { sports, loading, error, refetch } = useSports();
  const { logs: recentLogs } = useAuditLogs({
    pagination: { page: 1, limit: RECENT_LOGS_LIMIT },
  });

  const modules = useMemo(
    () =>
      sports.map((s) => ({
        sport: s.type as SportType,
        label: s.name,
        activeUsers: s.isPopular ? 'Phổ biến' : '—',
        status: s.isActive ? ('online' as const) : ('maintenance' as const),
        enabled: s.isActive,
        icon: s.icon,
      })),
    [sports]
  );

  const [localModules, setLocalModules] = useState<typeof modules>([]);
  const displayModules = localModules.length > 0 ? localModules : modules;

  const handleToggle = (sport: string) => {
    const base = localModules.length > 0 ? localModules : modules;
    setLocalModules(
      base.map((m) => (m.sport === sport ? { ...m, enabled: !m.enabled } : m))
    );
  };

  const healthLogs = useMemo(
    () =>
      recentLogs
        .slice(0, 3)
        .map(
          (log: {
            actorName?: string;
            action: string;
            target?: string;
            createdAt: string;
          }) => ({
            icon:
              log.action === 'LOGIN'
                ? 'log-in-outline'
                : log.action === 'CREATE'
                  ? 'add-circle-outline'
                  : 'checkmark-circle-outline',
            iconColor:
              log.action === 'LOGIN'
                ? 'text-blue-400 bg-blue-500/20 border-blue-500/30'
                : 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
            title: `${log.actorName || 'System'}: ${log.action}${log.target ? ` → ${log.target}` : ''}`,
            time: new Date(log.createdAt).toLocaleString('vi-VN'),
          })
        ),
    [recentLogs]
  );

  return (
    <>
      <PageHeader
        title="Quản lý Ecosystem"
        description="Quản lý các module thể thao và thông báo hệ thống."
      />

      <QueryState
        loading={loading && sports.length === 0}
        error={error}
        onRetry={() => void refetch()}
      >
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left 2/3 */}
          <div className="space-y-6 lg:col-span-2">
            {/* Sport modules */}
            <div className="grid gap-4 sm:grid-cols-3">
              {displayModules.map((m) => (
                <ModuleCard key={m.sport} module={m} onToggle={handleToggle} />
              ))}
            </div>

            {/* Notification form */}
            <NotificationForm />
          </div>

          {/* Right 1/3 */}
          <div className="space-y-6">
            <DonutChart />

            {/* System Activity Log */}
            <GlassPanel card>
              <h3 className="text-heading mb-4 text-lg font-semibold">
                Hoạt động gần đây
              </h3>
              <div className="space-y-6">
                {healthLogs.length > 0 ? (
                  healthLogs.map(
                    (
                      log: {
                        icon: string;
                        iconColor: string;
                        title: string;
                        time: string;
                      },
                      i: number
                    ) => (
                      <TimelineItem
                        key={i}
                        icon={log.icon}
                        iconColor={log.iconColor}
                        title={log.title}
                        time={log.time}
                        isLast={i === healthLogs.length - 1}
                      />
                    )
                  )
                ) : (
                  <p className="text-muted text-sm">Chưa có hoạt động</p>
                )}
              </div>
            </GlassPanel>

            <GlassPanel card className="border-primary/30 bg-primary/5 !p-5">
              <div className="flex gap-3">
                <IonIcon
                  name="bulb-outline"
                  className="text-primary shrink-0"
                />
                <div>
                  <p className="text-primary text-xs font-bold">Pro Tip</p>
                  <p className="text-muted mt-1 text-xs">
                    Tắt module trước khi bảo trì sẽ tự động thông báo đến người
                    dùng đang hoạt động trong module đó.
                  </p>
                </div>
              </div>
            </GlassPanel>
          </div>
        </div>
      </QueryState>
    </>
  );
}
