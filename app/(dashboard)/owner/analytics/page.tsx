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
import {
  PortalAreaChart,
  PortalBarChart,
  PortalDonutChart,
} from '@/components/molecules/charts';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useVenueAnalytics,
  useOrderAnalytics,
  useProductSalesAnalytics,
} from '@/hooks/owner';
import { formatCurrency } from '@/lib/utils';
import { downloadCsv } from '@/lib/utils/csv-export';

const PERIOD_OPTIONS = [
  { label: 'Tuần', value: 'week' },
  { label: 'Tháng', value: 'month' },
];

export default function OwnerAnalyticsPage() {
  const { selectedVenueId, selectedVenue } = useVenueContext();
  const [period, setPeriod] = useState('month');

  const {
    analytics: venueAnalytics,
    loading: venueLoading,
    error: venueError,
    refetch: refetchVenue,
  } = useVenueAnalytics(selectedVenueId, period);
  const {
    analytics: orderAnalytics,
    loading: orderLoading,
    error: orderError,
    refetch: refetchOrder,
  } = useOrderAnalytics(selectedVenueId, period);
  const {
    analytics: productAnalytics,
    loading: productLoading,
    error: productError,
    refetch: refetchProduct,
  } = useProductSalesAnalytics(selectedVenueId, period);

  const loading = venueLoading || orderLoading || productLoading;
  const error = venueError ?? orderError ?? productError;

  const venueSummary = venueAnalytics?.summary;
  const orderSummary = orderAnalytics?.summary;
  const productSummary = productAnalytics?.summary;

  const bookingTrend = useMemo(
    () =>
      (venueAnalytics?.revenueTrend ?? []).map((point) => ({
        label: point.label,
        value: point.value,
      })),
    [venueAnalytics?.revenueTrend]
  );

  const orderTrend = useMemo(
    () =>
      (orderAnalytics?.revenueTrend ?? []).map((point) => ({
        label: point.label,
        value: point.value,
      })),
    [orderAnalytics?.revenueTrend]
  );

  const bookingDistribution = useMemo(
    () =>
      (venueAnalytics?.bookingDistribution ?? []).map((item) => ({
        label: item.label,
        value: item.value,
      })),
    [venueAnalytics?.bookingDistribution]
  );

  const topProductsSource = productAnalytics?.topProducts?.length
    ? productAnalytics.topProducts
    : (orderAnalytics?.topProducts ?? []);

  const topProducts = topProductsSource.slice(0, 8).map((product) => ({
    label: product.productName,
    value: product.revenue,
  }));

  const handleExport = () => {
    const rows = [
      {
        nhom: 'Đặt sân',
        chi_tieu: 'Tổng đặt sân',
        gia_tri: venueSummary?.totalBookings ?? 0,
      },
      {
        nhom: 'Đặt sân',
        chi_tieu: 'Doanh thu đặt sân',
        gia_tri: venueSummary?.totalRevenue ?? 0,
      },
      {
        nhom: 'Đặt sân',
        chi_tieu: 'Thay đổi DT (%)',
        gia_tri: venueSummary?.revenueChangePercent ?? 0,
      },
      {
        nhom: 'Đơn hàng',
        chi_tieu: 'Tổng đơn',
        gia_tri: orderSummary?.totalOrders ?? 0,
      },
      {
        nhom: 'Đơn hàng',
        chi_tieu: 'Doanh thu đơn',
        gia_tri: orderSummary?.totalRevenue ?? 0,
      },
      {
        nhom: 'Đơn hàng',
        chi_tieu: 'Giá trị TB/đơn',
        gia_tri: orderSummary?.averageOrderValue ?? 0,
      },
      {
        nhom: 'Sản phẩm',
        chi_tieu: 'Doanh thu SP',
        gia_tri: productSummary?.totalRevenue ?? 0,
      },
      {
        nhom: 'Sản phẩm',
        chi_tieu: 'Số lượng bán',
        gia_tri: productSummary?.totalItemsSold ?? 0,
      },
      {
        nhom: 'Sản phẩm',
        chi_tieu: 'SP bán chạy nhất',
        gia_tri: productSummary?.bestSellingProduct ?? '',
      },
      ...bookingTrend.map((point) => ({
        nhom: 'Xu hướng đặt sân',
        chi_tieu: point.label,
        gia_tri: point.value,
      })),
      ...orderTrend.map((point) => ({
        nhom: 'Xu hướng đơn hàng',
        chi_tieu: point.label,
        gia_tri: point.value,
      })),
      ...topProducts.map((product) => ({
        nhom: 'Top sản phẩm',
        chi_tieu: product.label,
        gia_tri: product.value,
      })),
    ];

    const venueSlug =
      selectedVenue?.name?.replace(/\s+/g, '-').toLowerCase() ?? 'venue';
    downloadCsv(
      `thong-ke-${venueSlug}-${period}-${new Date().toISOString().slice(0, 10)}.csv`,
      rows
    );
  };

  const handleRetry = () => {
    void refetchVenue();
    void refetchOrder();
    void refetchProduct();
  };

  return (
    <>
      <PageHeader
        title="Thống kê sân"
        description="Phân tích đặt sân, đơn hàng và bán hàng theo từng cơ sở."
        actions={
          <Button
            variant="ghost"
            size="sm"
            iconLeft="download-outline"
            onClick={handleExport}
            disabled={!venueAnalytics && !orderAnalytics && !productAnalytics}
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
          loading={loading && !venueAnalytics && !orderAnalytics}
          error={error}
          empty={!selectedVenueId}
          emptyMessage="Chọn sân để xem thống kê."
          onRetry={handleRetry}
        >
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon="calendar-outline"
              iconColor="text-emerald-400"
              label="Tổng đặt sân"
              value={String(venueSummary?.totalBookings ?? 0)}
            />
            <StatCard
              icon="cash-outline"
              iconColor="text-amber-400"
              label="Doanh thu đặt sân"
              value={formatCurrency(venueSummary?.totalRevenue ?? 0)}
            />
            <StatCard
              icon="cart-outline"
              iconColor="text-blue-400"
              label="Doanh thu đơn hàng"
              value={formatCurrency(orderSummary?.totalRevenue ?? 0)}
            />
            <StatCard
              icon="receipt-outline"
              iconColor="text-sky-400"
              label="Tổng đơn"
              value={String(orderSummary?.totalOrders ?? 0)}
            />
            <StatCard
              icon="fast-food-outline"
              iconColor="text-orange-400"
              label="Doanh thu sản phẩm"
              value={formatCurrency(productSummary?.totalRevenue ?? 0)}
            />
            <StatCard
              icon="trending-up-outline"
              iconColor="text-violet-400"
              label="Thay đổi DT đặt sân"
              value={`${venueSummary?.revenueChangePercent?.toFixed(1) ?? 0}%`}
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-heading mb-3 text-sm font-bold">
                Xu hướng doanh thu đặt sân
              </h3>
              <PortalAreaChart
                data={bookingTrend}
                valueFormatter={(value) => formatCurrency(value)}
              />
            </div>
            <div>
              <h3 className="text-heading mb-3 text-sm font-bold">
                Xu hướng doanh thu đơn hàng
              </h3>
              <PortalAreaChart
                data={orderTrend}
                valueFormatter={(value) => formatCurrency(value)}
              />
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="text-heading mb-3 text-sm font-bold">
                Phân bổ đặt sân
              </h3>
              <PortalDonutChart data={bookingDistribution} />
            </div>
            <div>
              <h3 className="text-heading mb-3 text-sm font-bold">
                Top sản phẩm theo doanh thu
              </h3>
              <PortalBarChart
                data={topProducts}
                valueFormatter={(value) => formatCurrency(value)}
              />
            </div>
          </div>
        </QueryState>
      </GlassPanel>
    </>
  );
}
