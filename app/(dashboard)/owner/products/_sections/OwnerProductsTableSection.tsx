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
import { DataTable } from '@/components/organisms/DataTable';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { Badge } from '@/components/atoms/Badge';
import { formatCurrency } from '@/lib/utils';
import {
  PRODUCT_STATUS_LABEL,
  PRODUCT_STATUS_VARIANT,
} from '@/lib/constants/product-status';
import type { VenueProductNode } from '@/hooks/owner';
import { ProductRowActions } from '../_components/ProductRowActions';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

interface OwnerProductsTableSectionProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

export function OwnerProductsTableSection({
  data,
  actions,
}: OwnerProductsTableSectionProps) {
  const {
    venueId,
    venueLoading,
    products,
    productsTotalCount,
    productsHasNextPage,
    productsLoading,
    productsError,
    refetchAll,
  } = data;

  const { handleProductsLoadMore } = actions;

  return (
    <>
      <QueryState
        loading={(productsLoading || venueLoading) && products.length === 0}
        error={productsError}
        empty={!productsLoading && !venueId}
        emptyMessage="Chọn cơ sở để xem sản phẩm."
        onRetry={() => void refetchAll()}
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Tên' },
            { key: 'sku', label: 'SKU' },
            { key: 'category', label: 'Danh mục' },
            { key: 'stock', label: 'Tồn kho' },
            { key: 'status', label: 'Trạng thái', align: 'center' },
            { key: 'price', label: 'Giá', align: 'right' },
            { key: 'actions', label: 'Thao tác', align: 'right' },
          ]}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={products}
          emptyTitle="Chưa có sản phẩm"
          renderRow={(product: VenueProductNode) => {
            const isLowStock =
              product.stockQuantity != null &&
              product.lowStockThreshold != null &&
              product.stockQuantity <= product.lowStockThreshold;

            return (
              <tr
                key={product._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="text-body px-4 py-3 text-sm font-medium">
                  {product.name}
                </td>
                <td className="text-faint px-4 py-3 font-mono text-xs">
                  {product.sku ?? '—'}
                </td>
                <td className="text-muted px-4 py-3 text-sm">
                  {product.category?.name ?? '—'}
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={isLowStock ? 'text-amber-400' : 'text-body'}>
                    {product.stockQuantity ?? 0}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge
                    variant={
                      PRODUCT_STATUS_VARIANT[product.status] ?? 'neutral'
                    }
                  >
                    {PRODUCT_STATUS_LABEL[product.status] ?? product.status}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-right text-sm font-medium text-emerald-400">
                  {formatCurrency(product.price)}
                </td>
                <td className="px-4 py-3 text-right">
                  <ProductRowActions product={product} actions={actions} />
                </td>
              </tr>
            );
          }}
        />
      </QueryState>

      <ConnectionPager
        loadedCount={products.length}
        totalCount={productsTotalCount}
        hasNextPage={productsHasNextPage}
        onNext={handleProductsLoadMore}
        loading={productsLoading}
      />
    </>
  );
}
