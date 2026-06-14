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

import { StatCard } from '@/components/molecules/StatCard';
import {
  formatCurrency,
  formatNumber,
} from '../_hooks/dashboard-page.formatters';
import type { DashboardPageData } from '../_hooks/useDashboardPageData';

interface DashboardStatsSectionProps {
  data: DashboardPageData;
}

export function DashboardStatsSection({ data }: DashboardStatsSectionProps) {
  const { stats } = data;

  return (
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
  );
}
