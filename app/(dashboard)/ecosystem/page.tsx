'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ModuleCard } from './_components/ModuleCard';
import { NotificationForm } from './_components/NotificationForm';
import { DonutChart } from './_components/DonutChart';
import { mockSportModules } from '@/lib/mock-data';
import type { SportModule } from '@/types/portal';

const healthLogs = [
  {
    icon: 'checkmark-circle-outline',
    iconColor: 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30',
    title: 'Badminton module recovered',
    time: '10 phút trước',
  },
  {
    icon: 'warning-outline',
    iconColor: 'text-amber-400 bg-amber-500/20 border-amber-500/30',
    title: 'Pickleball module entering maintenance',
    time: '1 giờ trước',
  },
  {
    icon: 'server-outline',
    iconColor: 'text-blue-400 bg-blue-500/20 border-blue-500/30',
    title: 'Auto-scaling triggered (Region VN)',
    time: '3 giờ trước',
  },
];

export default function EcosystemPage() {
  const [modules, setModules] = useState<SportModule[]>(mockSportModules);

  const handleToggle = (sport: string) => {
    setModules((prev) =>
      prev.map((m) => (m.sport === sport ? { ...m, enabled: !m.enabled } : m))
    );
  };

  return (
    <>
      <PageHeader
        title="Quản lý Ecosystem"
        description="Quản lý các module thể thao và thông báo hệ thống."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Sport modules */}
          <div className="grid gap-4 sm:grid-cols-3">
            {modules.map((m) => (
              <ModuleCard key={m.sport} module={m} onToggle={handleToggle} />
            ))}
          </div>

          {/* Notification form */}
          <NotificationForm />
        </div>

        {/* Right 1/3 */}
        <div className="space-y-6">
          <DonutChart />

          {/* System Health Log */}
          <GlassPanel card>
            <h3 className="mb-4 text-lg font-semibold text-white">
              System Health Log
            </h3>
            <div className="space-y-6">
              {healthLogs.map((log, i) => (
                <TimelineItem
                  key={i}
                  icon={log.icon}
                  iconColor={log.iconColor}
                  title={log.title}
                  time={log.time}
                  isLast={i === healthLogs.length - 1}
                />
              ))}
            </div>
            <button className="border-primary/20 text-primary hover:border-primary/50 mt-6 w-full rounded-lg border py-2 text-sm font-medium transition-colors hover:text-purple-400">
              View Full Logs
            </button>
          </GlassPanel>

          {/* Pro tip */}
          <GlassPanel card className="border-primary/30 bg-primary/5 !p-5">
            <div className="flex gap-3">
              <IonIcon name="bulb-outline" className="text-primary shrink-0" />
              <div>
                <p className="text-primary text-xs font-bold">Pro Tip</p>
                <p className="mt-1 text-xs text-slate-400">
                  Tắt module trước khi bảo trì sẽ tự động thông báo đến người
                  dùng đang hoạt động trong module đó.
                </p>
              </div>
            </div>
          </GlassPanel>
        </div>
      </div>
    </>
  );
}
