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
import { cn, formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceOperationsSectionProps {
  data: OwnerFinancePageData;
}

const HEATMAP_DAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

const HEATMAP_CELL_SIZE = '2.25rem';

function buildHeatmapGridTemplate(columnCount: number): string {
  return `2.25rem repeat(${columnCount}, ${HEATMAP_CELL_SIZE})`;
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

  const heatmapHours = useMemo(() => {
    const hours = [
      ...new Set((operations?.heatMapData ?? []).map((cell) => cell.hour)),
    ];
    return hours.sort((left, right) => Number(left) - Number(right));
  }, [operations?.heatMapData]);

  const heatmapGrid = useMemo(() => {
    const cells = operations?.heatMapData ?? [];
    const lookup = new Map(
      cells.map((cell) => [`${cell.day}-${cell.hour}`, cell.intensity])
    );

    return HEATMAP_DAYS.map((dayLabel) => ({
      dayLabel,
      cells: heatmapHours.map((hour) => ({
        hour,
        intensity: lookup.get(`${dayLabel}-${hour}`) ?? 0,
      })),
    }));
  }, [heatmapHours, operations?.heatMapData]);

  const heatmapGridTemplate = buildHeatmapGridTemplate(heatmapHours.length);

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
            hint="Theo ngày lịch đặt sân"
          />
        </div>

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

        <GlassPanel card>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-heading text-sm font-bold">
                Biểu đồ nhiệt công suất
              </h3>
              <p className="text-muted mt-1 text-xs">
                Mật độ lịch đặt theo ngày trong tuần và khung giờ.
              </p>
            </div>
          </div>

          {heatmapGrid.some((row) =>
            row.cells.some((cell) => cell.intensity > 0)
          ) ? (
            <div className="overflow-x-auto">
              <div className="mx-auto w-fit min-w-0">
                <div
                  className="text-muted mb-2 grid gap-1.5 text-[11px]"
                  style={{ gridTemplateColumns: heatmapGridTemplate }}
                >
                  <span />
                  {heatmapHours.map((hour) => (
                    <span key={hour} className="text-center">
                      {hour}h
                    </span>
                  ))}
                </div>
                {heatmapGrid.map((row) => (
                  <div
                    key={row.dayLabel}
                    className="mb-1.5 grid gap-1.5 last:mb-0"
                    style={{ gridTemplateColumns: heatmapGridTemplate }}
                  >
                    <span className="text-muted flex items-center text-xs font-medium">
                      {row.dayLabel}
                    </span>
                    {row.cells.map((cell) => (
                      <div
                        key={`${row.dayLabel}-${cell.hour}`}
                        title={`${row.dayLabel} ${cell.hour}:00 — ${Math.round(cell.intensity * 100)}%`}
                        className={cn(
                          'size-9 rounded-md border border-white/5',
                          cell.intensity >= 0.75
                            ? 'bg-emerald-500/70'
                            : cell.intensity >= 0.5
                              ? 'bg-emerald-500/45'
                              : cell.intensity >= 0.25
                                ? 'bg-amber-500/35'
                                : cell.intensity > 0
                                  ? 'bg-sky-500/25'
                                  : 'bg-surface-hover/40'
                        )}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-muted flex h-40 items-center justify-center rounded-xl border border-dashed border-white/10 text-sm">
              Chưa có dữ liệu biểu đồ nhiệt trong kỳ đã chọn.
            </div>
          )}
        </GlassPanel>
      </div>
    </QueryState>
  );
}
