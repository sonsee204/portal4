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
import { PageHeader } from '@/components/organisms/PageHeader';
import { StatCard } from '@/components/molecules/StatCard';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { Button } from '@/components/atoms/Button';
import { formatCurrency } from '@/lib/utils';
import { useMyVenuesStats } from '@/hooks/owner';

export default function OwnerDashboardPage() {
  const { stats, loading, error, refetch } = useMyVenuesStats();

  return (
    <>
      <PageHeader
        title="Tổng quan sân"
        description="Theo dõi hoạt động và doanh thu các sân bạn quản lý."
      />

      <QueryState
        loading={loading && !stats}
        error={error}
        onRetry={() => void refetch()}
      >
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <StatCard
            icon="business-outline"
            iconColor="text-blue-400"
            label="Sân quản lý"
            value={stats ? String(stats.totalVenues) : '—'}
          />
          <StatCard
            icon="calendar-outline"
            iconColor="text-emerald-400"
            label="Đặt sân hôm nay"
            value={stats ? String(stats.todayBookings) : '—'}
          />
          <StatCard
            icon="cash-outline"
            iconColor="text-amber-400"
            label="Doanh thu"
            value={stats ? formatCurrency(stats.totalRevenue) : '—'}
          />
        </div>

        <GlassPanel card className="mt-6">
          <h3 className="text-heading mb-4 text-sm font-bold">
            Truy cập nhanh
          </h3>
          <div className="flex flex-wrap gap-3">
            <Link href="/owner/venues">
              <Button variant="secondary" size="sm" iconLeft="business-outline">
                Sân của tôi
              </Button>
            </Link>
            <Link href="/owner/calendar">
              <Button variant="secondary" size="sm" iconLeft="calendar-outline">
                Lịch sân
              </Button>
            </Link>
            <Link href="/owner/bookings">
              <Button variant="secondary" size="sm" iconLeft="receipt-outline">
                Đặt sân
              </Button>
            </Link>
            <Link href="/owner/finance">
              <Button variant="secondary" size="sm" iconLeft="cash-outline">
                Tài chính
              </Button>
            </Link>
          </div>
        </GlassPanel>
      </QueryState>
    </>
  );
}
