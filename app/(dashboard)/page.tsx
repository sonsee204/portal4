'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { StatCard } from '@/components/molecules/StatCard';
import { TabGroup } from '@/components/molecules/TabGroup';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Badge } from '@/components/atoms/Badge';
import {
  mockDashboardStats,
  mockRecentActivity,
  mockTournaments,
} from '@/lib/mock-data';

const periodTabs = [
  { label: 'Hàng ngày', value: 'daily' },
  { label: 'Hàng tuần', value: 'weekly' },
  { label: 'Hàng tháng', value: 'monthly' },
];

const statusVariant: Record<string, 'success' | 'warning' | 'info' | 'danger'> =
  {
    live: 'success',
    registration: 'info',
    completed: 'danger',
    upcoming: 'warning',
  };

export default function DashboardPage() {
  const [period, setPeriod] = useState('daily');

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Tổng quan hoạt động hệ thống HITRI TECH Portal."
        />
        <TabGroup tabs={periodTabs} active={period} onChange={setPeriod} />
      </div>

      {/* Stats grid */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {mockDashboardStats.map((s) => (
          <StatCard
            key={s.label}
            icon={s.icon}
            iconColor={s.iconColor}
            label={s.label}
            value={s.value}
            trend={s.trend}
          />
        ))}
      </div>

      {/* Two-column layout */}
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Left: Chart + Table */}
        <div className="space-y-6 lg:col-span-2">
          {/* Mock bar chart */}
          <GlassPanel card>
            <h3 className="mb-4 text-sm font-bold text-white">
              Doanh thu theo tuần
            </h3>
            <div className="flex h-48 items-end gap-2">
              {[65, 40, 80, 55, 90, 70, 50].map((h, i) => (
                <div
                  key={i}
                  className="flex flex-1 flex-col items-center gap-1"
                >
                  <div
                    className="from-primary to-primary-light w-full rounded-t-md bg-gradient-to-t transition-all"
                    style={{ height: `${h}%` }}
                  />
                  <span className="text-[10px] text-slate-500">
                    {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                  </span>
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Top tournaments table */}
          <GlassPanel card>
            <h3 className="mb-4 text-sm font-bold text-white">
              Giải đấu nổi bật
            </h3>
            <DataTable
              columns={[
                { key: 'name', label: 'Tên giải', sortable: true },
                { key: 'category', label: 'Thể loại' },
                { key: 'participants', label: 'Người chơi', sortable: true },
                { key: 'status', label: 'Trạng thái' },
              ]}
              data={mockTournaments}
              renderRow={(t) => (
                <tr
                  key={t._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="px-4 py-3 text-sm font-medium text-white">
                    {t.name}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-400">
                    {t.category}
                  </td>
                  <td className="px-4 py-3 text-sm text-slate-300">
                    {t.participants}/{t.maxParticipants}
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={statusVariant[t.status] ?? 'neutral'}>
                      {t.status}
                    </Badge>
                  </td>
                </tr>
              )}
            />
          </GlassPanel>
        </div>

        {/* Right: System + Activity */}
        <div className="space-y-6">
          {/* System status */}
          <GlassPanel card>
            <h3 className="mb-4 text-sm font-bold text-white">
              Tình trạng hệ thống
            </h3>
            <div className="space-y-4">
              {[
                { label: 'CPU Usage', value: 45, variant: 'primary' as const },
                { label: 'RAM Usage', value: 68, variant: 'warning' as const },
                {
                  label: 'SSD Storage',
                  value: 32,
                  variant: 'success' as const,
                },
              ].map((s) => (
                <div key={s.label}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="text-slate-400">{s.label}</span>
                    <span className="font-medium text-white">{s.value}%</span>
                  </div>
                  <ProgressBar value={s.value} variant={s.variant} />
                </div>
              ))}
            </div>
          </GlassPanel>

          {/* Recent activity */}
          <GlassPanel card>
            <h3 className="mb-4 text-sm font-bold text-white">
              Hoạt động gần đây
            </h3>
            <div>
              {mockRecentActivity.map((a, i) => (
                <TimelineItem
                  key={i}
                  icon={a.icon}
                  iconColor={a.iconColor}
                  title={a.title}
                  time={a.time}
                  isLast={i === mockRecentActivity.length - 1}
                />
              ))}
            </div>
          </GlassPanel>
        </div>
      </div>
    </>
  );
}
