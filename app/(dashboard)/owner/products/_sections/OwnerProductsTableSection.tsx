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
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import type { VenueProductNode } from '@/hooks/owner';
import { OwnerProductsTableRow } from '../_components/OwnerProductsTableRow';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

const BASE_COLUMNS: DataTableColumn[] = [
  { key: 'name', label: 'Tên', sortable: true },
  { key: 'sku', label: 'SKU' },
  { key: 'category', label: 'Danh mục' },
  {
    key: 'stock',
    label: 'Tồn kho',
    sortable: true,
    sortField: 'stockQuantity',
  },
  { key: 'status', label: 'Trạng thái', align: 'center', sortable: true },
  { key: 'price', label: 'Giá', align: 'right', sortable: true },
];

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
    productsIsLoadingMore,
    productsLoading,
    productsError,
    productSortField,
    productSortDir,
    handleProductSort,
    productSortLoading,
    refetchAll,
  } = data;

  const { handleProductsLoadMore, selectionMode, selectedProductIds } = actions;

  const columns: DataTableColumn[] = selectionMode
    ? [{ key: 'select', label: '', align: 'center' }, ...BASE_COLUMNS]
    : [...BASE_COLUMNS, { key: 'actions', label: 'Thao tác', align: 'right' }];

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
          columns={columns}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={products}
          emptyTitle="Chưa có sản phẩm"
          sortKey={productSortField}
          sortDir={productSortDir}
          onSort={handleProductSort}
          sortLoading={productSortLoading}
          infiniteScroll={{
            loadedCount: products.length,
            totalCount: productsTotalCount,
            hasNextPage: productsHasNextPage,
            onLoadMore: handleProductsLoadMore,
            loading: productsLoading && products.length === 0,
            loadingMore: productsIsLoadingMore,
          }}
          renderRow={(product: VenueProductNode) => (
            <OwnerProductsTableRow
              key={product._id}
              product={product}
              actions={actions}
              selectionMode={selectionMode}
              selected={selectedProductIds.has(product._id)}
            />
          )}
        />
      </QueryState>
    </>
  );
}
