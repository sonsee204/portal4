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

import { VenueAction } from '@/graphql/generated';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { StatCard } from '@/components/molecules/StatCard';
import { formatCurrency } from '@/lib/utils';
import type { OwnerDashboardData } from '../_hooks/useOwnerDashboardData';

interface OwnerDashboardStatsSectionProps {
  data: OwnerDashboardData;
}

export function OwnerDashboardStatsSection({
  data,
}: OwnerDashboardStatsSectionProps) {
  const { stats } = data;
  if (!stats) return null;

  return (
    <div className="mt-6 grid gap-4 sm:grid-cols-3">
      <StatCard
        icon="business-outline"
        iconColor="text-blue-400"
        label="Sân quản lý"
        value={String(stats.totalVenues)}
      />
      <VenueActionGate action={VenueAction.ViewBookings}>
        <StatCard
          icon="calendar-outline"
          iconColor="text-emerald-400"
          label="Đặt sân hôm nay"
          value={String(stats.todayBookings)}
        />
      </VenueActionGate>
      <VenueActionGate action={VenueAction.ViewSensitiveData}>
        <StatCard
          icon="cash-outline"
          iconColor="text-amber-400"
          label="Doanh thu"
          value={formatCurrency(stats.totalRevenue)}
        />
      </VenueActionGate>
    </div>
  );
}
