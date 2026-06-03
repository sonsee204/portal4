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

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { StatCard } from '@/components/molecules/StatCard';
import { TabGroup } from '@/components/molecules/TabGroup';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Badge } from '@/components/atoms/Badge';
import { QueryState } from '@/components/molecules/QueryState';
import { useSystemStats } from '@/hooks/admin';
import { useAuditLogs, type AuditLogEntry } from '@/hooks/audit';

const RECENT_LOGS_LIMIT = 5;

const TOURNAMENTS_PLACEHOLDER = [
  {
    _id: 't1',
    name: 'Cyber League Winter',
    category: 'Esports • FPS',
    status: 'live',
    participants: 1204,
    maxParticipants: 2000,
  },
  {
    _id: 't2',
    name: 'Global Soccer Qualifier',
    category: 'Sports • Sim',
    status: 'registration',
    participants: 854,
    maxParticipants: 1000,
  },
  {
    _id: 't3',
    name: 'Badminton Pro Open',
    category: 'Badminton',
    status: 'upcoming',
    participants: 32,
    maxParticipants: 64,
  },
  {
    _id: 't4',
    name: 'Pickleball City Cup',
    category: 'Pickleball',
    status: 'completed',
    participants: 16,
    maxParticipants: 16,
  },
];

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

function formatNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n);
}

function formatCurrency(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)} tỷ`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)} tr`;
  return new Intl.NumberFormat('vi-VN').format(n) + ' ₫';
}

export default function DashboardPage() {
  const [period, setPeriod] = useState('daily');

  const { stats, loading, error, refetch } = useSystemStats();
  const { logs: recentLogs } = useAuditLogs({
    pagination: { page: 1, limit: RECENT_LOGS_LIMIT },
  });

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Dashboard"
          description="Tổng quan hoạt động hệ thống HITRI TECH Portal."
        />
        <TabGroup tabs={periodTabs} active={period} onChange={setPeriod} />
      </div>

      <QueryState
        loading={loading && !stats}
        error={error}
        onRetry={() => void refetch()}
      >
        {/* Stats grid */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon="people-outline"
            iconColor="text-primary"
            label="Tổng người dùng"
            value={stats ? formatNumber(stats.totalUsers) : '—'}
          />
          <StatCard
            icon="business-outline"
            iconColor="text-blue-400"
            label="Sân hoạt động"
            value={stats ? formatNumber(stats.activeVenues) : '—'}
          />
          <StatCard
            icon="calendar-outline"
            iconColor="text-emerald-400"
            label="Tổng đặt sân"
            value={stats ? formatNumber(stats.totalBookings) : '—'}
          />
          <StatCard
            icon="cash-outline"
            iconColor="text-amber-400"
            label="Doanh thu"
            value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          />
        </div>

        {/* Two-column layout */}
        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Left: Chart + Table */}
          <div className="space-y-6 lg:col-span-2">
            {/* Mock bar chart */}
            <GlassPanel card>
              <h3 className="text-heading mb-4 text-sm font-bold">
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
                    <span className="text-faint text-[10px]">
                      {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'][i]}
                    </span>
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Top tournaments table */}
            <GlassPanel card>
              <h3 className="text-heading mb-4 text-sm font-bold">
                Giải đấu nổi bật
              </h3>
              <DataTable
                columns={[
                  { key: 'name', label: 'Tên giải', sortable: true },
                  { key: 'category', label: 'Thể loại' },
                  { key: 'participants', label: 'Người chơi', sortable: true },
                  { key: 'status', label: 'Trạng thái' },
                ]}
                data={TOURNAMENTS_PLACEHOLDER}
                renderRow={(t) => (
                  <tr
                    key={t._id}
                    className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                  >
                    <td className="text-heading px-4 py-3 text-sm font-medium">
                      {t.name}
                    </td>
                    <td className="text-muted px-4 py-3 text-sm">
                      {t.category}
                    </td>
                    <td className="text-body px-4 py-3 text-sm">
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
              <h3 className="text-heading mb-4 text-sm font-bold">
                Tình trạng hệ thống
              </h3>
              <div className="space-y-4">
                {[
                  {
                    label: 'CPU Usage',
                    value: 45,
                    variant: 'primary' as const,
                  },
                  {
                    label: 'RAM Usage',
                    value: 68,
                    variant: 'warning' as const,
                  },
                  {
                    label: 'SSD Storage',
                    value: 32,
                    variant: 'success' as const,
                  },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="mb-1 flex items-center justify-between text-xs">
                      <span className="text-muted">{s.label}</span>
                      <span className="text-heading font-medium">
                        {s.value}%
                      </span>
                    </div>
                    <ProgressBar value={s.value} variant={s.variant} />
                  </div>
                ))}
              </div>
            </GlassPanel>

            {/* Recent activity */}
            <GlassPanel card>
              <h3 className="text-heading mb-4 text-sm font-bold">
                Hoạt động gần đây
              </h3>
              <div>
                {recentLogs.length > 0
                  ? recentLogs.map((log: AuditLogEntry, i: number) => (
                      <TimelineItem
                        key={log._id}
                        icon="document-text-outline"
                        iconColor="text-primary bg-primary/20 border-primary/30"
                        title={`${log.actorName}: ${log.action} — ${log.target}`}
                        time={new Date(log.createdAt).toLocaleString('vi-VN')}
                        isLast={i === recentLogs.length - 1}
                      />
                    ))
                  : [0, 1, 2].map((i) => (
                      <TimelineItem
                        key={i}
                        icon="ellipse-outline"
                        iconColor="text-muted bg-surface-hover border-surface-border"
                        title="Chưa có hoạt động"
                        time=""
                        isLast={i === 2}
                      />
                    ))}
              </div>
            </GlassPanel>
          </div>
        </div>
      </QueryState>
    </>
  );
}
