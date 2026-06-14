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

import { DataTable } from '@/components/organisms/DataTable';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ProgressBar } from '@/components/atoms/ProgressBar';
import { Badge } from '@/components/atoms/Badge';
import { type AuditLogEntry } from '@/hooks/audit';
import {
  REVENUE_CHART_HEIGHTS,
  REVENUE_CHART_LABELS,
  SYSTEM_STATUS_METRICS,
  TOURNAMENTS_PLACEHOLDER,
  TOURNAMENT_STATUS_VARIANT,
} from '../_hooks/dashboard-page.constants';
import type { DashboardPageData } from '../_hooks/useDashboardPageData';

interface DashboardMainSectionProps {
  data: DashboardPageData;
}

export function DashboardMainSection({ data }: DashboardMainSectionProps) {
  const { recentLogs } = data;

  return (
    <div className="mt-6 grid gap-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <GlassPanel card>
          <h3 className="text-heading mb-4 text-sm font-bold">
            Doanh thu theo tuần
          </h3>
          <div className="flex h-48 items-end gap-2">
            {REVENUE_CHART_HEIGHTS.map((h, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="from-primary to-primary-light w-full rounded-t-md bg-gradient-to-t transition-all"
                  style={{ height: `${h}%` }}
                />
                <span className="text-faint text-[10px]">
                  {REVENUE_CHART_LABELS[i]}
                </span>
              </div>
            ))}
          </div>
        </GlassPanel>

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
            data={[...TOURNAMENTS_PLACEHOLDER]}
            renderRow={(t) => (
              <tr
                key={t._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="text-heading px-4 py-3 text-sm font-medium">
                  {t.name}
                </td>
                <td className="text-muted px-4 py-3 text-sm">{t.category}</td>
                <td className="text-body px-4 py-3 text-sm">
                  {t.participants}/{t.maxParticipants}
                </td>
                <td className="px-4 py-3">
                  <Badge variant={TOURNAMENT_STATUS_VARIANT[t.status] ?? 'neutral'}>
                    {t.status}
                  </Badge>
                </td>
              </tr>
            )}
          />
        </GlassPanel>
      </div>

      <div className="space-y-6">
        <GlassPanel card>
          <h3 className="text-heading mb-4 text-sm font-bold">
            Tình trạng hệ thống
          </h3>
          <div className="space-y-4">
            {SYSTEM_STATUS_METRICS.map((s) => (
              <div key={s.label}>
                <div className="mb-1 flex items-center justify-between text-xs">
                  <span className="text-muted">{s.label}</span>
                  <span className="text-heading font-medium">{s.value}%</span>
                </div>
                <ProgressBar value={s.value} variant={s.variant} />
              </div>
            ))}
          </div>
        </GlassPanel>

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
  );
}
