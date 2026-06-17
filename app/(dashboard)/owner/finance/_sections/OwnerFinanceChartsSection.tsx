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
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import {
  PortalBarChart,
  PortalDonutChart,
} from '@/components/molecules/charts';
import { CHART_COLORS, CHART_THEME } from '@/lib/charts/theme';
import { formatCurrency } from '@/lib/utils';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';

interface OwnerFinanceChartsSectionProps {
  data: OwnerFinancePageData;
}

export function OwnerFinanceChartsSection({
  data,
}: OwnerFinanceChartsSectionProps) {
  const trendCombo = useMemo(
    () =>
      (data.report?.trend ?? []).map((point) => ({
        label: point.label,
        revenue: point.revenue,
        netProfit: point.netProfit,
      })),
    [data.report?.trend]
  );

  const paymentData = useMemo(
    () =>
      (data.report?.byPaymentMethod ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [data.report?.byPaymentMethod]
  );

  const orderTypeData = useMemo(
    () =>
      (data.report?.byOrderType ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [data.report?.byOrderType]
  );

  const expenseData = useMemo(
    () =>
      (data.report?.expenseByCategory ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [data.report?.expenseByCategory]
  );

  const courtData = useMemo(
    () =>
      (data.report?.byCourt ?? []).slice(0, 8).map((item) => ({
        label: item.label,
        value: item.revenue,
      })),
    [data.report?.byCourt]
  );

  const revenueStreamData = useMemo(
    () =>
      (data.report?.byRevenueStream ?? []).map((item) => ({
        label: item.label,
        value: item.revenue,
        percentage: item.percentage,
      })),
    [data.report?.byRevenueStream]
  );

  return (
    <QueryState
      loading={data.reportLoading && !data.report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem biểu đồ."
      onRetry={() => void data.refetchReport()}
    >
      <div className="grid gap-6 xl:grid-cols-2">
        <GlassPanel card className="xl:col-span-2">
          <h3 className="text-heading mb-3 text-sm font-bold">
            Doanh thu vs lãi ròng
          </h3>
          {trendCombo.length > 0 ? (
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={trendCombo}
                  margin={{ top: 8, right: 8, left: 0, bottom: 0 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke={CHART_THEME.grid}
                    vertical={false}
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    tick={{ fill: CHART_THEME.axis, fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={64}
                    tickFormatter={(value) => formatCurrency(Number(value))}
                  />
                  <Tooltip
                    contentStyle={{
                      background: CHART_THEME.tooltipBg,
                      border: `1px solid ${CHART_THEME.tooltipBorder}`,
                      borderRadius: 12,
                      color: CHART_THEME.tooltipText,
                    }}
                    formatter={(value, name) => [
                      formatCurrency(Number(value)),
                      name === 'revenue' ? 'Doanh thu' : 'Lãi ròng',
                    ]}
                  />
                  <Bar
                    dataKey="revenue"
                    name="revenue"
                    fill={CHART_COLORS[0]}
                    radius={[6, 6, 0, 0]}
                  />
                  <Line
                    type="monotone"
                    dataKey="netProfit"
                    name="netProfit"
                    stroke={CHART_COLORS[1]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-muted text-sm">Không có dữ liệu xu hướng.</p>
          )}
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Doanh thu theo sân con
          </h3>
          <PortalBarChart
            data={courtData}
            valueFormatter={(value) => formatCurrency(value)}
          />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Theo nguồn doanh thu
          </h3>
          <PortalDonutChart data={revenueStreamData} />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">
            Theo phương thức thanh toán
          </h3>
          <PortalDonutChart data={paymentData} />
        </GlassPanel>

        <GlassPanel card>
          <h3 className="text-heading mb-3 text-sm font-bold">Theo loại đơn</h3>
          <PortalDonutChart data={orderTypeData} />
        </GlassPanel>

        {!data.allVenues ? (
          <GlassPanel card className="xl:col-span-2">
            <h3 className="text-heading mb-3 text-sm font-bold">
              Chi phí theo nhóm
            </h3>
            <PortalDonutChart data={expenseData} />
          </GlassPanel>
        ) : null}
      </div>
    </QueryState>
  );
}
