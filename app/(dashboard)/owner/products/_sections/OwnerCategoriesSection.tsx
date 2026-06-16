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
import type { VenueCategoryNode } from '@/hooks/owner';
import { CategoryRowActions } from '../_components/CategoryRowActions';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

interface OwnerCategoriesSectionProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

export function OwnerCategoriesSection({
  data,
  actions,
}: OwnerCategoriesSectionProps) {
  const {
    venueId,
    venueLoading,
    categories,
    categoriesTotalCount,
    categoriesHasNextPage,
    categoriesLoading,
    categoriesError,
    refetchAll,
  } = data;

  const { handleCategoriesLoadMore } = actions;

  return (
    <>
      <QueryState
        loading={(categoriesLoading || venueLoading) && categories.length === 0}
        error={categoriesError}
        empty={!categoriesLoading && !venueId}
        emptyMessage="Chọn cơ sở để xem danh mục."
        onRetry={() => void refetchAll()}
      >
        <DataTable
          columns={[
            { key: 'name', label: 'Tên danh mục' },
            { key: 'slug', label: 'Slug' },
            { key: 'order', label: 'Thứ tự' },
            { key: 'products', label: 'Sản phẩm', align: 'right' },
            { key: 'actions', label: 'Thao tác', align: 'right' },
          ]}
          stickyHeader
          className={TABLE_SCROLL_CLASS_NAME}
          data={categories}
          emptyTitle="Chưa có danh mục"
          renderRow={(category: VenueCategoryNode) => (
            <tr
              key={category._id}
              className="border-surface-border hover:bg-surface-hover border-b transition-colors"
            >
              <td className="text-body px-4 py-3 text-sm font-medium">
                {category.name}
              </td>
              <td className="text-faint px-4 py-3 font-mono text-xs">
                {category.slug ?? '—'}
              </td>
              <td className="text-muted px-4 py-3 text-sm">
                {category.displayOrder ?? 0}
              </td>
              <td className="text-body px-4 py-3 text-right text-sm font-medium">
                {category.productCount ?? 0}
              </td>
              <td className="px-4 py-3 text-right">
                <CategoryRowActions category={category} actions={actions} />
              </td>
            </tr>
          )}
        />
      </QueryState>

      <ConnectionPager
        loadedCount={categories.length}
        totalCount={categoriesTotalCount}
        hasNextPage={categoriesHasNextPage}
        onNext={handleCategoriesLoadMore}
        loading={categoriesLoading}
      />
    </>
  );
}
