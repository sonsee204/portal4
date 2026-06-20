/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import {
  PortalBarChart,
  PortalDonutChart,
  PortalLineChart,
} from '@/components/molecules/charts';
import { cn, formatCurrency } from '@/lib/utils';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';

interface OwnerProductStatsChartsSectionProps {
  data: OwnerProductStatsPageData;
}

export function OwnerProductStatsChartsSection({
  data,
}: OwnerProductStatsChartsSectionProps) {
  const report = data.report;

  const trendData = useMemo(
    () =>
      (report?.trend ?? []).map((point) => ({
        label: point.label,
        value: point.revenue,
      })),
    [report?.trend]
  );

  const salesTrendData = useMemo(
    () =>
      (report?.salesTrend ?? []).map((point) => ({
        label: point.label,
        value: point.revenue,
      })),
    [report?.salesTrend]
  );

  const categoryData = useMemo(
    () =>
      (report?.salesByCategory ?? []).map((item) => ({
        id: item.categoryId,
        label: item.categoryName,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [report?.salesByCategory]
  );

  return (
    <QueryState
      loading={data.reportLoading && !report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem biểu đồ."
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Doanh thu theo ngày
          </h3>
          <PortalBarChart data={trendData} valueFormatter={formatCurrency} />
        </GlassPanel>
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Xu hướng 6 tháng
          </h3>
          <PortalLineChart
            data={salesTrendData}
            valueFormatter={formatCurrency}
          />
        </GlassPanel>
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Doanh thu theo danh mục
          </h3>
          <PortalDonutChart
            data={categoryData}
            valueFormatter={formatCurrency}
          />
        </GlassPanel>
        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Giờ bán cao điểm
          </h3>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(2.25rem,1fr))] gap-1">
            {(report?.hourlySales ?? []).map((item) => (
              <div
                key={item.hour}
                title={`${item.hour}:00 · ${formatCurrency(item.revenue)} · ${item.quantitySold} sp`}
                className={cn(
                  'flex aspect-square flex-col items-center justify-center rounded-sm border border-white/5 text-[10px]',
                  item.intensity > 0.75
                    ? 'bg-emerald-500/80 text-white'
                    : item.intensity > 0.5
                      ? 'bg-emerald-500/55'
                      : item.intensity > 0.25
                        ? 'bg-emerald-500/35'
                        : item.intensity > 0
                          ? 'bg-emerald-500/20'
                          : 'bg-surface-hover text-muted'
                )}
              >
                <span>{item.hour}</span>
              </div>
            ))}
          </div>
        </GlassPanel>
      </div>
    </QueryState>
  );
}
