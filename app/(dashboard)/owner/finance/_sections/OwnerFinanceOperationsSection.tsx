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

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { StatCard } from '@/components/molecules/StatCard';
import { PortalBarChart } from '@/components/molecules/charts';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import { OwnerFinanceOperationsHeatmapSection } from './OwnerFinanceOperationsHeatmapSection';
import { OwnerFinanceScheduleCoverageSection } from './OwnerFinanceScheduleCoverageSection';

interface OwnerFinanceOperationsSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceOperationsSection({
  data,
}: OwnerFinanceOperationsSectionProps) {
  const operations = data.operations;

  const revenueByPromotion = useMemo(
    () =>
      (operations?.byPromotion ?? [])
        .filter((item) => item.count > 0 || item.revenue > 0)
        .map((item) => ({
          label: item.label,
          value: item.revenue,
        })),
    [operations?.byPromotion]
  );

  const bookingsByPromotion = useMemo(
    () =>
      (operations?.byPromotion ?? [])
        .filter((item) => item.count > 0 || item.revenue > 0)
        .map((item) => ({
          label: item.label,
          value: item.count,
        })),
    [operations?.byPromotion]
  );

  const revenueByScheduleType = useMemo(
    () =>
      (operations?.byScheduleType ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [operations?.byScheduleType]
  );

  const bookingsByScheduleType = useMemo(
    () =>
      (operations?.byScheduleType ?? []).map((item) => ({
        label: item.label,
        value: item.count,
      })),
    [operations?.byScheduleType]
  );

  const scheduleCoverageTrend = useMemo(
    () =>
      (operations?.scheduleCoverageTrend ?? []).map((point) => ({
        label: point.label,
        revenue: point.revenue,
        bookingCount: point.bookingCount,
        occupiedSlots: point.occupiedSlots,
        availableSlots: point.availableSlots,
        occupancyRate: point.occupancyRate,
        previousRevenue: point.previousRevenue,
        previousOccupancyRate: point.previousOccupancyRate,
      })),
    [operations?.scheduleCoverageTrend]
  );

  return (
    <QueryState
      loading={data.operationsLoading && !data.operations}
      error={data.operationsError}
      empty={!data.selectedVenueId && !data.allVenues}
      emptyMessage="Chọn sân để xem vận hành."
      onRetry={() => void data.refetchOperations()}
    >
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon="grid-outline"
            iconColor="text-emerald-400"
            label="Công suất tổng"
            hint={
              operations?.occupancy
                ? `${operations.occupancy.occupiedSlots.toLocaleString('vi-VN')} / ${operations.occupancy.availableSlots.toLocaleString('vi-VN')} khung giờ trong kỳ`
                : 'Khung giờ đã đặt / khung giờ khả dụng trong kỳ'
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
            hint="Tổng kỳ theo ngày lịch — biểu đồ bên dưới là chi tiết từng ngày"
          />
        </div>

        <OwnerFinanceScheduleCoverageSection data={scheduleCoverageTrend} />

        <div className="grid gap-6 xl:grid-cols-2">
          <GlassPanel card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Doanh thu theo loại lịch
            </h3>
            <PortalBarChart
              data={revenueByScheduleType}
              valueFormatter={(value) => formatCurrency(value)}
            />
          </GlassPanel>

          <GlassPanel card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Số lịch theo loại
            </h3>
            <PortalBarChart
              data={bookingsByScheduleType}
              valueFormatter={(value) => String(value)}
              axisTickFormatter={(value) => String(value)}
            />
          </GlassPanel>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <GlassPanel card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Doanh thu theo khuyến mãi
            </h3>
            {revenueByPromotion.length > 0 ? (
              <PortalBarChart
                data={revenueByPromotion}
                valueFormatter={(value) => formatCurrency(value)}
              />
            ) : (
              <div className="text-muted flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm">
                Chưa có lịch nào dùng khuyến mãi trong kỳ.
              </div>
            )}
          </GlassPanel>

          <GlassPanel card>
            <h3 className="text-heading mb-3 text-sm font-bold">
              Số lịch theo khuyến mãi
            </h3>
            {bookingsByPromotion.length > 0 ? (
              <PortalBarChart
                data={bookingsByPromotion}
                valueFormatter={(value) => String(value)}
                axisTickFormatter={(value) => String(value)}
              />
            ) : (
              <div className="text-muted flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm">
                Chưa có lịch nào dùng khuyến mãi trong kỳ.
              </div>
            )}
          </GlassPanel>
        </div>

        <OwnerFinanceOperationsHeatmapSection
          heatMapData={operations?.heatMapData}
        />
      </div>
    </QueryState>
  );
}
