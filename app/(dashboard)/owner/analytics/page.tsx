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

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { StatCard } from '@/components/molecules/StatCard';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import { QueryState } from '@/components/molecules/QueryState';
import { formatCurrency } from '@/lib/utils';
import { useMyVenues, useVenueAnalytics } from '@/hooks/owner';

const PERIOD_OPTIONS = [
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Quý', value: 'quarter' },
  { label: 'Năm', value: 'year' },
];

export default function OwnerAnalyticsPage() {
  const { venues } = useMyVenues({ limit: 50 });
  const [venueId, setVenueId] = useState('');
  const [period, setPeriod] = useState('month');

  const effectiveVenueId = venueId || venues[0]?._id || null;
  const { analytics, loading, error, refetch } = useVenueAnalytics(
    effectiveVenueId,
    period
  );

  const venueOptions = useMemo(
    () => venues.map((v) => ({ label: v.name, value: v._id })),
    [venues]
  );

  const summary = analytics?.summary;

  return (
    <>
      <PageHeader
        title="Thống kê sân"
        description="Phân tích hiệu suất hoạt động theo từng cơ sở."
      />

      <GlassPanel card className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {venueOptions.length > 0 && (
            <Select
              label="Chọn sân"
              options={venueOptions}
              value={effectiveVenueId ?? ''}
              onChange={(e) => setVenueId(e.target.value)}
            />
          )}
          <Select
            label="Kỳ báo cáo"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>

        <QueryState
          loading={loading && !analytics}
          error={error}
          empty={!effectiveVenueId}
          emptyMessage="Chọn sân để xem thống kê."
          onRetry={() => void refetch()}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon="calendar-outline"
              iconColor="text-emerald-400"
              label="Tổng đặt sân"
              value={String(summary?.totalBookings ?? 0)}
            />
            <StatCard
              icon="cash-outline"
              iconColor="text-amber-400"
              label="Doanh thu"
              value={formatCurrency(summary?.totalRevenue ?? 0)}
            />
            <StatCard
              icon="trending-up-outline"
              iconColor="text-blue-400"
              label="Thay đổi DT"
              value={`${summary?.revenueChangePercent?.toFixed(1) ?? 0}%`}
            />
          </div>

          {analytics?.revenueTrend && analytics.revenueTrend.length > 0 && (
            <div className="mt-6">
              <h3 className="text-heading mb-3 text-sm font-bold">
                Xu hướng doanh thu
              </h3>
              <div className="flex h-40 items-end gap-2">
                {analytics.revenueTrend.map((point) => {
                  const max = Math.max(
                    ...analytics.revenueTrend.map((p) => p.value),
                    1
                  );
                  const h = (point.value / max) * 100;
                  return (
                    <div
                      key={point.label}
                      className="flex flex-1 flex-col items-center gap-1"
                    >
                      <div
                        className="from-primary to-primary-light w-full rounded-t-md bg-gradient-to-t"
                        style={{ height: `${h}%` }}
                      />
                      <span className="text-faint text-[10px]">
                        {point.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </QueryState>
      </GlassPanel>
    </>
  );
}
