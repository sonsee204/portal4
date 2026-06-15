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
import { useMyVenues, useVenueRevenueStats } from '@/hooks/owner';

const PERIOD_OPTIONS = [
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Quý', value: 'quarter' },
  { label: 'Năm', value: 'year' },
];

export default function OwnerFinancePage() {
  const { venues } = useMyVenues({ limit: 50 });
  const [venueId, setVenueId] = useState('');
  const [period, setPeriod] = useState('month');

  const effectiveVenueId = venueId || venues[0]?._id || null;
  const { stats, loading, error, refetch } = useVenueRevenueStats(
    effectiveVenueId,
    period
  );

  const venueOptions = useMemo(
    () => venues.map((v) => ({ label: v.name, value: v._id })),
    [venues]
  );

  return (
    <>
      <PageHeader
        title="Tài chính sân"
        description="Theo dõi doanh thu theo từng cơ sở."
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
          loading={loading && !stats}
          error={error}
          empty={!effectiveVenueId}
          emptyMessage="Chọn sân để xem tài chính."
          onRetry={() => void refetch()}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon="cash-outline"
              iconColor="text-emerald-400"
              label="Đã thu"
              value={formatCurrency(
                stats?.bookingRevenue?.collectedRevenue ?? 0
              )}
            />
            <StatCard
              icon="trending-up-outline"
              iconColor="text-blue-400"
              label="Dự kiến"
              value={formatCurrency(
                stats?.bookingRevenue?.expectedRevenue ?? 0
              )}
            />
            <StatCard
              icon="analytics-outline"
              iconColor="text-amber-400"
              label="Tăng trưởng"
              value={`${stats?.growthPercentage?.toFixed(1) ?? 0}%`}
            />
          </div>
        </QueryState>
      </GlassPanel>
    </>
  );
}
