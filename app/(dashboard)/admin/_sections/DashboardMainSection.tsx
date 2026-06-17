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

import Link from 'next/link';
import { TimelineItem } from '@/components/molecules/TimelineItem';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { type AuditLogEntry } from '@/hooks/audit';
import { formatDateTime } from '@/lib/utils';
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
            Truy cập nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/admin/venue-requests">
              <Button variant="secondary" size="sm" iconLeft="business-outline">
                Yêu cầu đăng ký sân
              </Button>
            </Link>
            <Link href="/admin/claim-requests">
              <Button
                variant="secondary"
                size="sm"
                iconLeft="hand-left-outline"
              >
                Yêu cầu nhận sân
              </Button>
            </Link>
            <Link href="/admin/users">
              <Button variant="secondary" size="sm" iconLeft="people-outline">
                Người dùng
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </div>

      <GlassPanel card>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-heading text-sm font-bold">Hoạt động gần đây</h3>
          <Link
            href="/admin/audit"
            className="text-primary text-xs font-medium hover:underline"
          >
            Xem tất cả
          </Link>
        </div>
        <div>
          {recentLogs.length > 0
            ? recentLogs.map((log: AuditLogEntry, i: number) => (
                <TimelineItem
                  key={log._id}
                  icon="document-text-outline"
                  iconColor="text-primary bg-primary/20 border-primary/30"
                  title={`${log.actorName}: ${log.action} — ${log.target}`}
                  time={formatDateTime(log.createdAt)}
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
  );
}
