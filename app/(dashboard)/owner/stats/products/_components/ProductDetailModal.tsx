/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Modal } from '@/components/molecules/Modal';
import { QueryState } from '@/components/molecules/QueryState';
import { Badge } from '@/components/atoms/Badge';
import { PortalBarChart } from '@/components/molecules/charts';
import { useProductPerformanceReport } from '@/hooks/owner';
import { type ProductReportFilterInput } from '@/graphql/generated';
import { formatCurrency } from '@/lib/utils';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_VARIANT,
} from '@/lib/constants/product-status';
import {
  PRODUCT_DETAIL_TABS,
  type ProductDetailTab,
} from '../_hooks/owner-product-stats.constants';
import { cn } from '@/lib/utils';
import { ProductDetailMovementsPanel } from './ProductDetailMovementsPanel';

interface ProductDetailModalProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
  filter: ProductReportFilterInput | null;
  initialTab?: ProductDetailTab;
}

export function ProductDetailModal({
  productId,
  open,
  onClose,
  filter,
  initialTab = 'overview',
}: ProductDetailModalProps) {
  return (
    <Modal open={open} onClose={onClose} title="Chi tiết sản phẩm" size="xl">
      {open && productId ? (
        <ProductDetailModalBody
          key={`${productId}-${initialTab}`}
          productId={productId}
          filter={filter}
          initialTab={initialTab}
        />
      ) : null}
    </Modal>
  );
}

function ProductDetailModalBody({
  productId,
  filter,
  initialTab,
}: {
  productId: string;
  filter: ProductReportFilterInput | null;
  initialTab: ProductDetailTab;
}) {
  const [activeTab, setActiveTab] = useState<ProductDetailTab>(initialTab);

  const { report, loading, error, refetch } = useProductPerformanceReport(
    productId,
    filter
  );

  const trendData = useMemo(
    () =>
      (report?.trend ?? []).map((point) => ({
        label: point.label,
        value: point.revenue,
      })),
    [report?.trend]
  );

  const product = report?.product;
  const summary = report?.summary;
  const venueId = product?.venueId ?? filter?.venueIds?.[0] ?? null;

  return (
    <>
      <div className="mb-4 flex flex-wrap gap-2 border-b border-white/10 pb-4">
        {PRODUCT_DETAIL_TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'rounded-full px-3 py-1.5 text-sm transition-colors',
              activeTab === tab.id
                ? 'bg-emerald-500/20 text-emerald-300'
                : 'text-muted hover:bg-surface-hover'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <QueryState
        loading={loading && !report}
        error={error}
        empty={!productId}
        emptyMessage="Không có sản phẩm được chọn."
        onRetry={() => void refetch()}
      >
        {activeTab === 'overview' && summary ? (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="text-muted text-xs">Doanh thu kỳ</p>
                <p className="text-lg font-semibold text-emerald-400">
                  {formatCurrency(summary.revenue)}
                </p>
              </div>
              <div>
                <p className="text-muted text-xs">SL bán</p>
                <p className="text-lg font-semibold">{summary.soldQuantity}</p>
              </div>
              <div>
                <p className="text-muted text-xs">Hạng / đóng góp</p>
                <p className="text-lg font-semibold">
                  #{summary.rank ?? '—'} ·{' '}
                  {summary.revenuePercentage.toFixed(1)}%
                </p>
              </div>
            </div>
            <PortalBarChart
              data={trendData}
              valueFormatter={formatCurrency}
              height={220}
            />
          </div>
        ) : null}

        {activeTab === 'finance' && summary ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailMetric
                label="Doanh thu"
                value={formatCurrency(summary.revenue)}
              />
              <DetailMetric label="COGS" value={formatCurrency(summary.cogs)} />
              <DetailMetric
                label="Lãi gộp"
                value={formatCurrency(summary.grossProfit)}
              />
              <DetailMetric
                label="Biên (%)"
                value={`${summary.profitMargin.toFixed(1)}%`}
              />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-muted border-b border-white/10 text-left">
                    <th className="px-2 py-2">Ngày</th>
                    <th className="px-2 py-2 text-right">Doanh thu</th>
                    <th className="px-2 py-2 text-right">SL</th>
                  </tr>
                </thead>
                <tbody>
                  {(report?.trend ?? []).map((point) => (
                    <tr key={point.label} className="border-b border-white/5">
                      <td className="px-2 py-2">{point.label}</td>
                      <td className="px-2 py-2 text-right">
                        {formatCurrency(point.revenue)}
                      </td>
                      <td className="px-2 py-2 text-right">
                        {point.quantitySold}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {activeTab === 'inventory' && product ? (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <DetailMetric
                label="Tồn hiện tại"
                value={String(product.stockQuantity)}
              />
              <DetailMetric
                label="Giá vốn TB"
                value={
                  product.averageCost != null
                    ? formatCurrency(product.averageCost)
                    : '—'
                }
              />
            </div>
            <h4 className="text-body text-sm font-medium">
              Lịch sử nhập gần đây
            </h4>
            <ProductDetailMovementsPanel
              venueId={venueId}
              productId={productId}
              enabled={activeTab === 'inventory'}
              importOnly
            />
          </div>
        ) : null}

        {activeTab === 'movements' ? (
          <ProductDetailMovementsPanel
            venueId={venueId}
            productId={productId}
            enabled={activeTab === 'movements'}
          />
        ) : null}

        {activeTab === 'info' && product ? (
          <div className="space-y-3">
            <DetailMetric label="SKU" value={product.sku ?? '—'} />
            <DetailMetric label="Danh mục" value={product.categoryName} />
            <DetailMetric label="Đơn vị" value={product.unit} />
            <DetailMetric
              label="Giá bán"
              value={formatCurrency(product.unitPrice)}
            />
            <DetailMetric label="Sân" value={product.venueName ?? '—'} />
            <div className="flex items-center gap-2">
              <span className="text-muted text-sm">Trạng thái</span>
              <Badge
                variant={PRODUCT_STATUS_VARIANT[product.status] ?? 'neutral'}
              >
                {PRODUCT_STATUS_LABEL[product.status] ?? product.status}
              </Badge>
            </div>
            {product.venueId ? (
              <Link
                href={`/owner/products?venueId=${product.venueId}`}
                className="text-sm text-emerald-400 hover:underline"
              >
                Quản lý sản phẩm →
              </Link>
            ) : null}
          </div>
        ) : null}
      </QueryState>
    </>
  );
}

function DetailMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-surface-hover rounded-lg px-3 py-2">
      <p className="text-muted text-xs">{label}</p>
      <p className="text-body text-sm font-medium">{value}</p>
    </div>
  );
}
