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
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { StatCard } from '@/components/molecules/StatCard';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import { EmptyState } from '@/components/molecules/EmptyState';
import { QueryState } from '@/components/molecules/QueryState';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { COMMON } from '@/lib/strings';
import {
  BOOKING_STATUS_VARIANT,
  BOOKING_STATUS_LABEL,
} from '@/lib/constants/booking-status';
import { useAdminAllBookings, type AdminBooking } from '@/hooks/admin';
import { useAuditLogs, useAuditStats, type AuditLogEntry } from '@/hooks/audit';

const cmsTabs = [
  { label: 'Đặt sân gần đây', value: 'bookings' },
  { label: 'Nhật ký hệ thống', value: 'audit' },
];

const PAGE_SIZE = 10;

export default function CmsPage() {
  const [tab, setTab] = useState('bookings');

  const {
    bookings,
    total: bookingTotal,
    totalCount: bookingTotalCount,
    hasNextPage: bookingsHasNextPage,
    loadMore: loadMoreBookings,
    loading: bookingsLoading,
    error: bookingsError,
    refetch: bookingsRefetch,
  } = useAdminAllBookings(
    { pagination: { limit: PAGE_SIZE } },
    { skip: tab !== 'bookings' }
  );

  const {
    logs: auditLogs,
    total: auditTotal,
    totalCount: auditTotalCount,
    hasNextPage: auditHasNextPage,
    loadMore: loadMoreAudit,
    loading: auditLoading,
    error: auditError,
  } = useAuditLogs(
    { pagination: { limit: PAGE_SIZE } },
    { skip: tab !== 'audit' }
  );

  const { stats: auditStats } = useAuditStats();

  return (
    <>
      <PageHeader
        title="CMS & Vận hành"
        description="Quản lý nội dung, đặt sân và hoạt động hệ thống."
      />

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="calendar-outline"
          iconColor="text-primary"
          label="Đặt sân hôm nay"
          value={String(bookingTotal)}
        />
        <StatCard
          icon="shield-checkmark-outline"
          iconColor="text-emerald-400"
          label="Tổng nhật ký"
          value={String(auditStats?.totalEvents ?? 0)}
        />
        <StatCard
          icon="alert-circle-outline"
          iconColor="text-amber-400"
          label="Lỗi 24h qua"
          value={String(auditStats?.failedLast24h ?? 0)}
        />
      </div>

      <QueryState
        loading={
          (bookingsLoading && bookings.length === 0) ||
          (auditLoading && auditLogs.length === 0)
        }
        error={bookingsError || auditError}
        onRetry={() => void bookingsRefetch()}
      >
        <TabGroup
          tabs={cmsTabs}
          active={tab}
          onChange={(v) => {
            setTab(v);
          }}
          className="mt-6"
        />

        {tab === 'bookings' && (
          <GlassPanel card className="mt-4">
            {bookingsLoading && bookings.length === 0 ? (
              <div className="text-muted flex justify-center py-12 text-sm">
                {COMMON.LOADING}
              </div>
            ) : bookings.length === 0 ? (
              <EmptyState
                icon="calendar-outline"
                title="Chưa có đặt sân"
                description="Không tìm thấy lịch đặt sân nào."
              />
            ) : (
              <>
                <DataTable
                  columns={[
                    { key: 'venue', label: 'Cụm sân' },
                    { key: 'court', label: 'Sân' },
                    { key: 'date', label: 'Ngày' },
                    { key: 'time', label: 'Giờ' },
                    { key: 'price', label: 'Giá', sortable: true },
                    { key: 'status', label: 'Trạng thái' },
                    { key: 'actions', label: '' },
                  ]}
                  data={bookings}
                  renderRow={(b: AdminBooking) => (
                    <tr
                      key={b._id}
                      className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                    >
                      <td className="text-body px-4 py-3 text-sm">
                        {b.venueName}
                      </td>
                      <td className="text-muted px-4 py-3 text-sm">
                        {b.courtName}
                      </td>
                      <td className="text-muted px-4 py-3 text-sm">{b.date}</td>
                      <td className="text-muted px-4 py-3 text-sm">
                        {b.timeSlots}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                        {b.totalPrice.toLocaleString('vi-VN')} ₫
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            BOOKING_STATUS_VARIANT[b.status] ?? 'neutral'
                          }
                        >
                          {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <IconButton icon="eye-outline" size="sm" />
                      </td>
                    </tr>
                  )}
                />
                <ConnectionPager
                  loadedCount={bookings.length}
                  totalCount={bookingTotalCount ?? bookingTotal}
                  hasNextPage={bookingsHasNextPage}
                  onNext={() => void loadMoreBookings()}
                  loading={bookingsLoading}
                  className="mt-4"
                />
              </>
            )}
          </GlassPanel>
        )}

        {tab === 'audit' && (
          <GlassPanel card className="mt-4">
            {auditLoading && auditLogs.length === 0 ? (
              <div className="text-muted flex justify-center py-12 text-sm">
                {COMMON.LOADING}
              </div>
            ) : auditLogs.length === 0 ? (
              <EmptyState
                icon="document-text-outline"
                title="Chưa có nhật ký"
                description="Không tìm thấy nhật ký hoạt động nào."
              />
            ) : (
              <>
                <DataTable
                  columns={[
                    { key: 'actor', label: 'Người thực hiện' },
                    { key: 'action', label: 'Hành động' },
                    { key: 'target', label: 'Đối tượng' },
                    { key: 'status', label: 'Trạng thái' },
                    { key: 'time', label: 'Thời gian' },
                  ]}
                  data={auditLogs}
                  renderRow={(log: AuditLogEntry) => (
                    <tr
                      key={log._id}
                      className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                    >
                      <td className="text-body px-4 py-3 text-sm">
                        {log.actorName || 'System'}
                      </td>
                      <td className="text-muted px-4 py-3 text-sm">
                        {log.action}
                      </td>
                      <td className="text-muted px-4 py-3 text-sm">
                        {log.target || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <Badge
                          variant={
                            log.status === 'SUCCESS' ? 'success' : 'danger'
                          }
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="text-muted px-4 py-3 text-xs">
                        {new Date(log.createdAt).toLocaleString('vi-VN')}
                      </td>
                    </tr>
                  )}
                />
                <ConnectionPager
                  loadedCount={auditLogs.length}
                  totalCount={auditTotalCount ?? auditTotal}
                  hasNextPage={auditHasNextPage}
                  onNext={() => void loadMoreAudit()}
                  loading={auditLoading}
                  className="mt-4"
                />
              </>
            )}
          </GlassPanel>
        )}
      </QueryState>
    </>
  );
}
