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

import { QueryState } from '@/components/molecules/QueryState';
import { StatCard } from '@/components/molecules/StatCard';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOverviewOpsStripSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOverviewOpsStripSection({
  data,
}: OwnerFinanceOverviewOpsStripSectionProps) {
  const operations = data.operations;

  return (
    <QueryState
      loading={data.operationsLoading && !data.operations}
      error={data.operationsError}
      empty={!data.selectedVenueId}
      emptyMessage=""
      onRetry={() => void data.refetchOperations()}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon="grid-outline"
          iconColor="text-emerald-400"
          label="Công suất tổng"
          hint={
            operations?.occupancy
              ? `${operations.occupancy.occupiedSlots.toLocaleString('vi-VN')} / ${operations.occupancy.availableSlots.toLocaleString('vi-VN')} khung giờ`
              : 'Khung giờ đã đặt / khả dụng'
          }
          value={`${operations?.occupancy.occupancyRate.toFixed(1) ?? 0}%`}
        />
        <StatCard
          icon="calendar-outline"
          iconColor="text-violet-400"
          label="Tổng lịch"
          value={String(operations?.totalBookings ?? 0)}
          hint="Lịch đã xác nhận hoặc hoàn thành"
        />
        <StatCard
          icon="tennisball-outline"
          iconColor="text-amber-400"
          label="Doanh thu sân (lịch)"
          value={formatCurrency(operations?.courtRevenue ?? 0)}
          signedValue={operations?.courtRevenue ?? 0}
          hint="Theo ngày lịch đặt sân"
        />
        <StatCard
          icon="wallet-outline"
          iconColor={
            (operations?.unpaidAmount ?? 0) > 0
              ? 'text-red-400'
              : 'text-slate-400'
          }
          label="Chưa thanh toán"
          value={formatCurrency(operations?.unpaidAmount ?? 0)}
          valueClassName={
            (operations?.unpaidAmount ?? 0) > 0
              ? 'text-red-400'
              : 'text-heading'
          }
          hint="Số dư đơn đặt sân còn lại (theo lịch trong kỳ)"
        />
      </div>
    </QueryState>
  );
}
