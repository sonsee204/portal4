/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FinanceSignedTrendBadge } from '@/app/(dashboard)/owner/finance/_components/FinanceSignedTrendBadge';
import { cn, formatCurrency } from '@/lib/utils';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_VARIANT,
} from '@/lib/constants/product-status';
import type { ProductReportRowNode } from '@/hooks/owner';
import type { OwnerProductStatsPageData } from '../_hooks/useOwnerProductStatsPageData';
import type { OwnerProductStatsPageActions } from '../_hooks/useOwnerProductStatsPageActions';

interface OwnerProductStatsTableSectionProps {
  data: OwnerProductStatsPageData;
  actions: OwnerProductStatsPageActions;
}

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

export function OwnerProductStatsTableSection({
  data,
  actions,
}: OwnerProductStatsTableSectionProps) {
  const showVenueColumn = data.allVenues;

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-3 text-sm font-bold">Bảng sản phẩm</h3>
      <QueryState
        loading={data.reportLoading && data.tableRows.length === 0}
        error={data.reportError}
        empty={!data.allVenues && !data.selectedVenueId}
        emptyMessage="Chọn sân để xem bảng sản phẩm."
        onRetry={() => void data.refetchReport()}
      >
        <DataTable
          columns={[
            { key: 'product', label: 'Sản phẩm' },
            ...(showVenueColumn ? [{ key: 'venue', label: 'Sân' }] : []),
            { key: 'sku', label: 'SKU / Danh mục' },
            {
              key: 'status',
              label: 'Trạng thái / Tồn',
              align: 'center' as const,
            },
            {
              key: 'soldQuantity',
              label: 'SL bán',
              align: 'right' as const,
              sortable: true,
            },
            {
              key: 'cogs',
              label: 'Giá vốn',
              align: 'right' as const,
              sortable: true,
            },
            {
              key: 'revenue',
              label: 'Doanh thu',
              align: 'right' as const,
              sortable: true,
            },
            {
              key: 'grossProfit',
              label: 'Lãi gộp',
              align: 'right' as const,
              sortable: true,
            },
            { key: 'margin', label: 'Biên', align: 'right' as const },
            {
              key: 'revenuePercentage',
              label: '% đóng góp',
              align: 'right' as const,
              sortable: true,
            },
          ]}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={data.tableRows}
          emptyTitle="Không có sản phẩm phù hợp"
          sortKey={data.tableSort.sortField}
          sortDir={data.tableSort.sortDir}
          onSort={data.tableSort.handleSort}
          infiniteScroll={{
            loadedCount: data.tableRows.length,
            totalCount: data.tableTotalCount,
            hasNextPage: data.tableHasNextPage,
            onLoadMore: data.loadMoreTable,
            loading: data.reportLoading && data.tableRows.length === 0,
            loadingMore: data.tableLoadingMore,
          }}
          renderRow={(row: ProductReportRowNode) => {
            const isLowStock =
              row.trackInventory && row.stockQuantity === 0
                ? true
                : row.stockQuantity <= 0;

            return (
              <tr
                key={row.productId}
                className="border-surface-border hover:bg-surface-hover cursor-pointer border-b transition-colors"
                onClick={() => actions.openProductDetail(row.productId)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="bg-surface-hover flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
                      {row.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={row.imageUrl}
                          alt=""
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="text-muted text-xs">SP</span>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="text-body truncate text-sm font-medium">
                        {row.productName}
                      </p>
                      {row.rank ? (
                        <p className="text-muted text-xs">Hạng #{row.rank}</p>
                      ) : null}
                    </div>
                  </div>
                </td>
                {showVenueColumn ? (
                  <td className="text-muted px-4 py-3 text-sm">
                    {row.venueName ?? '—'}
                  </td>
                ) : null}
                <td className="px-4 py-3 text-sm">
                  <p className="text-faint font-mono text-xs">
                    {row.sku ?? '—'}
                  </p>
                  <p className="text-muted">{row.categoryName}</p>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={PRODUCT_STATUS_VARIANT[row.status] ?? 'neutral'}
                  >
                    {PRODUCT_STATUS_LABEL[row.status] ?? row.status}
                  </Badge>
                  <p
                    className={cn(
                      'mt-1 text-xs',
                      isLowStock ? 'text-amber-400' : 'text-muted'
                    )}
                  >
                    Tồn {row.stockQuantity}
                  </p>
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {row.soldQuantity}
                </td>
                <td className="text-muted px-4 py-3 text-right text-sm">
                  {formatCurrency(row.cogs)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  <p className="font-medium text-emerald-400">
                    {formatCurrency(row.revenue)}
                  </p>
                  <div className="mt-1 flex justify-end">
                    <FinanceSignedTrendBadge
                      metric={{
                        changePercent: row.revenueGrowth,
                        value: row.revenue,
                        previousValue: row.previousRevenue,
                      }}
                    />
                  </div>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium">
                  {formatCurrency(row.grossProfit)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {row.profitMargin.toFixed(1)}%
                </td>
                <td className="text-muted px-4 py-3 text-right text-sm">
                  {row.revenuePercentage.toFixed(1)}%
                </td>
              </tr>
            );
          }}
        />
      </QueryState>
    </GlassPanel>
  );
}
