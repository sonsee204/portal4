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
import { Button } from '@/components/atoms/Button';
import { QueryState } from '@/components/molecules/QueryState';
import { PortalAreaChart } from '@/components/molecules/charts';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useVenueRevenueStats,
  useOrderStats,
  useVenueAnalytics,
} from '@/hooks/owner';
import { formatCurrency } from '@/lib/utils';
import { downloadCsv } from '@/lib/utils/csv-export';

const PERIOD_OPTIONS = [
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
  { label: 'Quý', value: 'quarter' },
  { label: 'Năm', value: 'year' },
];

export default function OwnerFinancePage() {
  const { selectedVenueId, selectedVenue } = useVenueContext();
  const [period, setPeriod] = useState('month');

  const { stats, loading, error, refetch } = useVenueRevenueStats(
    selectedVenueId,
    period
  );
  const {
    stats: orderStats,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrders,
  } = useOrderStats(selectedVenueId, stats?.startDate, stats?.endDate);
  const { analytics } = useVenueAnalytics(selectedVenueId, period);

  const revenueTrend = useMemo(
    () =>
      (analytics?.revenueTrend ?? []).map((point) => ({
        label: point.label,
        value: point.value,
      })),
    [analytics?.revenueTrend]
  );

  const handleExport = () => {
    if (!stats) return;

    const summaryRows = [
      {
        loai: 'Tổng quan',
        chi_tieu: 'Đã thu (đặt sân)',
        gia_tri: stats.bookingRevenue.collectedRevenue,
      },
      {
        loai: 'Tổng quan',
        chi_tieu: 'Dự kiến (đặt sân)',
        gia_tri: stats.bookingRevenue.expectedRevenue,
      },
      {
        loai: 'Tổng quan',
        chi_tieu: 'Đã thu (đơn hàng)',
        gia_tri: stats.orderRevenue.collectedRevenue,
      },
      {
        loai: 'Tổng quan',
        chi_tieu: 'Dự kiến (đơn hàng)',
        gia_tri: stats.orderRevenue.expectedRevenue,
      },
      {
        loai: 'Tổng quan',
        chi_tieu: 'Tăng trưởng (%)',
        gia_tri: stats.growthPercentage,
      },
      {
        loai: 'Đơn hàng',
        chi_tieu: 'Tổng đơn',
        gia_tri: orderStats?.totalOrders ?? 0,
      },
      {
        loai: 'Đơn hàng',
        chi_tieu: 'Hoàn thành',
        gia_tri: orderStats?.completedOrders ?? 0,
      },
      {
        loai: 'Đơn hàng',
        chi_tieu: 'Doanh thu đơn',
        gia_tri: orderStats?.totalRevenue ?? 0,
      },
      {
        loai: 'Đơn hàng',
        chi_tieu: 'Doanh thu hôm nay',
        gia_tri: orderStats?.todayRevenue ?? 0,
      },
    ];

    const trendRows = revenueTrend.map((point) => ({
      loai: 'Xu hướng doanh thu',
      chi_tieu: point.label,
      gia_tri: point.value,
    }));

    const venueSlug =
      selectedVenue?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'venue';
    downloadCsv(
      `tai-chinh-${venueSlug}-${period}-${new Date().toISOString().slice(0, 10)}.csv`,
      [...summaryRows, ...trendRows]
    );
  };

  const handleRetry = () => {
    void refetch();
    void refetchOrders();
  };

  return (
    <>
      <PageHeader
        title="Tài chính sân"
        description="Theo dõi doanh thu đặt sân và đơn hàng theo từng cơ sở."
        actions={
          <Button
            variant="ghost"
            size="sm"
            iconLeft="download-outline"
            onClick={handleExport}
            disabled={!stats}
          >
            Export CSV
          </Button>
        }
      />

      <GlassPanel card className="mt-6 space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:max-w-md">
          <Select
            label="Kỳ báo cáo"
            options={PERIOD_OPTIONS}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          />
        </div>

        <QueryState
          loading={(loading || orderLoading) && !stats}
          error={error ?? orderError}
          empty={!selectedVenueId}
          emptyMessage="Chọn sân để xem tài chính."
          onRetry={handleRetry}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              icon="cash-outline"
              iconColor="text-emerald-400"
              label="Đã thu (đặt sân)"
              value={formatCurrency(
                stats?.bookingRevenue?.collectedRevenue ?? 0
              )}
            />
            <StatCard
              icon="trending-up-outline"
              iconColor="text-blue-400"
              label="Dự kiến (đặt sân)"
              value={formatCurrency(
                stats?.bookingRevenue?.expectedRevenue ?? 0
              )}
            />
            <StatCard
              icon="cart-outline"
              iconColor="text-amber-400"
              label="Doanh thu đơn hàng"
              value={formatCurrency(orderStats?.totalRevenue ?? 0)}
            />
            <StatCard
              icon="analytics-outline"
              iconColor="text-violet-400"
              label="Tăng trưởng"
              value={`${stats?.growthPercentage?.toFixed(1) ?? 0}%`}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <StatCard
              icon="receipt-outline"
              iconColor="text-sky-400"
              label="Tổng đơn"
              value={String(orderStats?.totalOrders ?? 0)}
            />
            <StatCard
              icon="checkmark-circle-outline"
              iconColor="text-emerald-400"
              label="Hoàn thành"
              value={String(orderStats?.completedOrders ?? 0)}
            />
            <StatCard
              icon="today-outline"
              iconColor="text-orange-400"
              label="Doanh thu hôm nay"
              value={formatCurrency(orderStats?.todayRevenue ?? 0)}
            />
          </div>

          <div>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Xu hướng doanh thu
            </h3>
            <PortalAreaChart
              data={revenueTrend}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </div>
        </QueryState>
      </GlassPanel>
    </>
  );
}
