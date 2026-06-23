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
import { Badge } from '@/components/atoms/Badge';
import { FinanceSignedTrendBadge } from '@/app/(dashboard)/owner/finance/_components/FinanceSignedTrendBadge';
import { cn, formatCurrency } from '@/lib/utils';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';
import type { OwnerProductStatsPageActions } from '../_hooks/useOwnerProductStatsPageActions';
import { ProductStatsInsightStrip } from '../_components/ProductStatsInsightStrip';

interface OwnerProductStatsAlertsSectionProps {
  data: OwnerProductStatsPageData;
  actions: OwnerProductStatsPageActions;
}

function RevenueShareBar({ percentage }: { percentage: number }) {
  return (
    <div className="bg-surface-hover mt-1.5 h-1.5 w-full overflow-hidden rounded-full">
      <div
        className="h-full rounded-full bg-emerald-500/80 transition-all"
        style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
      />
    </div>
  );
}

function ProductRankRow({
  rank,
  name,
  categoryName,
  imageUrl,
  revenue,
  growth,
  sharePercent,
  quantitySold,
  onClick,
}: {
  rank: number;
  name: string;
  categoryName: string;
  imageUrl?: string | null;
  revenue: number;
  growth: number;
  sharePercent: number;
  quantitySold?: number;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="hover:bg-surface-hover flex w-full flex-col rounded-lg px-2 py-2.5 text-left transition-colors"
    >
      <div className="flex items-center gap-3">
        <span className="text-muted w-5 shrink-0 text-sm font-medium">
          {rank}
        </span>
        <div className="bg-surface-hover flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={imageUrl} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="text-muted text-xs">SP</span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-body truncate text-sm font-medium">{name}</p>
          <p className="text-muted truncate text-xs">
            {categoryName}
            {quantitySold != null ? ` · ${quantitySold} sp` : ''}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-medium text-emerald-400">
            {formatCurrency(revenue)}
          </p>
          <FinanceSignedTrendBadge
            metric={{
              changePercent: growth,
              value: revenue,
              previousValue: null,
            }}
          />
        </div>
      </div>
      <div className="mt-1 pl-8">
        <div className="flex items-center justify-between gap-2">
          <RevenueShareBar percentage={sharePercent} />
          <span className="text-muted shrink-0 text-[10px]">
            {sharePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </button>
  );
}

function CategoryRankRow({
  rank,
  name,
  revenue,
  sharePercent,
  growth,
  quantitySold,
}: {
  rank: number;
  name: string;
  revenue: number;
  sharePercent: number;
  growth: number;
  quantitySold: number;
}) {
  return (
    <div className="rounded-lg px-2 py-2.5">
      <div className="flex items-center gap-3">
        <span className="text-muted w-5 shrink-0 text-sm font-medium">
          {rank}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-body truncate text-sm font-medium">{name}</p>
          <p className="text-muted text-xs">{quantitySold} sp đã bán</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-sm font-medium text-emerald-400">
            {formatCurrency(revenue)}
          </p>
          <FinanceSignedTrendBadge
            metric={{
              changePercent: growth,
              value: revenue,
              previousValue: null,
            }}
          />
        </div>
      </div>
      <div className="mt-1.5 pl-8">
        <div className="flex items-center justify-between gap-2">
          <RevenueShareBar percentage={sharePercent} />
          <span className="text-muted shrink-0 text-[10px]">
            {sharePercent.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}

export function OwnerProductStatsAlertsSection({
  data,
  actions,
}: OwnerProductStatsAlertsSectionProps) {
  const report = data.report;
  const summary = report?.summary;
  const inventoryStatus = report?.inventoryStatus;

  const topProducts = useMemo(
    () => (report?.topProducts ?? []).slice(0, 5),
    [report?.topProducts]
  );

  const decliningProducts = useMemo(
    () => (report?.decliningProducts ?? []).slice(0, 5),
    [report?.decliningProducts]
  );

  const categoryRows = useMemo(
    () =>
      [...(report?.salesByCategory ?? [])]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 5),
    [report?.salesByCategory]
  );

  const stockAlerts = useMemo(
    () => (report?.stockAlerts ?? []).slice(0, 8),
    [report?.stockAlerts]
  );

  const showDeclining = decliningProducts.length > 0;

  return (
    <QueryState
      loading={data.reportLoading && !report}
      error={data.reportError}
      empty={!data.allVenues && !data.selectedVenueId}
      emptyMessage="Chọn sân để xem insight."
      onRetry={() => void data.refetchReport()}
    >
      {summary ? <ProductStatsInsightStrip summary={summary} /> : null}

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <GlassPanel card className="flex min-h-[22rem] flex-col">
          <h3 className="text-heading mb-1 text-sm font-bold">
            Top 5 bán chạy
          </h3>
          <p className="text-muted mb-3 text-xs">Theo doanh thu trong kỳ</p>
          <div className="flex flex-1 flex-col divide-y divide-white/5">
            {topProducts.length > 0 ? (
              topProducts.map((product) => (
                <ProductRankRow
                  key={product.productId}
                  rank={product.rank ?? 0}
                  name={product.productName}
                  categoryName={product.categoryName}
                  imageUrl={product.imageUrl}
                  revenue={product.revenue}
                  growth={product.revenueGrowth}
                  sharePercent={product.revenuePercentage}
                  quantitySold={product.quantitySold}
                  onClick={() => actions.openProductDetail(product.productId)}
                />
              ))
            ) : (
              <p className="text-muted flex flex-1 items-center justify-center py-8 text-center text-sm">
                Chưa có bán hàng trong kỳ đã chọn.
              </p>
            )}
          </div>
        </GlassPanel>

        <GlassPanel card className="flex min-h-[22rem] flex-col">
          <h3 className="text-heading mb-1 text-sm font-bold">
            {showDeclining
              ? 'Sản phẩm giảm doanh số'
              : 'Doanh thu theo danh mục'}
          </h3>
          <p className="text-muted mb-3 text-xs">
            {showDeclining
              ? 'So với kỳ trước'
              : 'Phân bổ doanh thu sản phẩm theo nhóm'}
          </p>
          <div className="flex flex-1 flex-col divide-y divide-white/5">
            {showDeclining
              ? decliningProducts.map((product) => (
                  <ProductRankRow
                    key={product.productId}
                    rank={product.rank ?? 0}
                    name={product.productName}
                    categoryName={product.categoryName}
                    imageUrl={product.imageUrl}
                    revenue={product.revenue}
                    growth={product.revenueGrowth}
                    sharePercent={product.revenuePercentage}
                    quantitySold={product.quantitySold}
                    onClick={() => actions.openProductDetail(product.productId)}
                  />
                ))
              : null}
            {!showDeclining && categoryRows.length > 0
              ? categoryRows.map((category, index) => (
                  <CategoryRankRow
                    key={category.categoryId}
                    rank={index + 1}
                    name={category.categoryName}
                    revenue={category.revenue}
                    sharePercent={category.percentage}
                    growth={category.growth}
                    quantitySold={category.quantitySold}
                  />
                ))
              : null}
            {!showDeclining && categoryRows.length === 0 ? (
              <p className="text-muted flex flex-1 items-center justify-center py-8 text-center text-sm">
                Doanh thu theo danh mục sẽ hiện khi có bán hàng.
              </p>
            ) : null}
          </div>
        </GlassPanel>

        <GlassPanel
          card
          className="flex min-h-[22rem] flex-col lg:col-span-2 xl:col-span-1"
        >
          <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
            <div>
              <h3 className="text-heading text-sm font-bold">
                Cảnh báo tồn kho
              </h3>
              <p className="text-muted mt-1 text-xs">
                Sản phẩm hết hàng hoặc tồn thấp
              </p>
            </div>
            {inventoryStatus ? (
              <div className="flex flex-wrap gap-1.5">
                <Badge variant="danger">
                  {inventoryStatus.outOfStockProducts} hết
                </Badge>
                <Badge variant="warning">
                  {inventoryStatus.lowStockProducts} thấp
                </Badge>
                <Badge variant="neutral">
                  {inventoryStatus.activeProducts} đang bán
                </Badge>
              </div>
            ) : null}
          </div>

          <div className="flex flex-1 flex-col divide-y divide-white/5">
            {stockAlerts.length > 0 ? (
              stockAlerts.map((alert) => (
                <button
                  key={alert.productId}
                  type="button"
                  onClick={() => actions.openProductDetail(alert.productId)}
                  className="hover:bg-surface-hover flex w-full items-center justify-between gap-3 rounded-lg px-2 py-2.5 text-left transition-colors"
                >
                  <div className="min-w-0">
                    <p className="text-body truncate text-sm font-medium">
                      {alert.productName}
                    </p>
                    <p className="text-muted text-xs">
                      {alert.categoryName}
                      {alert.recentSales > 0
                        ? ` · ${alert.recentSales} sp / 7 ngày`
                        : ''}
                    </p>
                    <p className="text-muted text-xs">
                      Tồn {alert.currentStock}
                      {alert.lowStockThreshold != null
                        ? ` / ngưỡng ${alert.lowStockThreshold}`
                        : ''}
                    </p>
                  </div>
                  <Badge
                    variant={
                      alert.alertType === 'out_of_stock' ? 'danger' : 'warning'
                    }
                  >
                    {alert.alertType === 'out_of_stock'
                      ? 'Hết hàng'
                      : 'Tồn thấp'}
                  </Badge>
                </button>
              ))
            ) : (
              <p className="text-muted flex flex-1 items-center justify-center py-8 text-center text-sm">
                Không có sản phẩm dưới ngưỡng cảnh báo.
              </p>
            )}
          </div>

          {report?.inventory ? (
            <div className="border-surface-border mt-3 grid grid-cols-2 gap-3 border-t pt-3">
              <div>
                <p className="text-muted text-xs">Giá trị tồn (bán lẻ)</p>
                <p className="text-body text-sm font-medium">
                  {formatCurrency(report.inventory.totalStockValue)}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs">Giá trị tồn (vốn)</p>
                <p className="text-body text-sm font-medium">
                  {formatCurrency(report.inventory.totalCostValue)}
                </p>
              </div>
            </div>
          ) : null}
        </GlassPanel>
      </div>
    </QueryState>
  );
}
