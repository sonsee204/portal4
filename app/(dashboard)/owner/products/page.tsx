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

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { TabGroup } from '@/components/molecules/TabGroup';
import { VenueAction } from '@/graphql/generated';
import { useOwnerProductsPageActions } from './_hooks/useOwnerProductsPageActions';
import { useOwnerProductsPageData } from './_hooks/useOwnerProductsPageData';
import {
  PRODUCT_STATUS_CHIPS,
  PRODUCT_VIEW_TABS,
} from './_hooks/owner-products-page.constants';
import { ImportStockModal } from './_components/ImportStockModal';
import { ProductFormModal } from './_components/ProductFormModal';
import { CategoryFormModal } from './_components/CategoryFormModal';
import { DeleteConfirmModals } from './_components/DeleteConfirmModals';
import { OwnerProductsHeaderSection } from './_sections/OwnerProductsHeaderSection';
import { OwnerProductsStatsSection } from './_sections/OwnerProductsStatsSection';
import { OwnerProductsTableSection } from './_sections/OwnerProductsTableSection';
import { OwnerCategoriesSection } from './_sections/OwnerCategoriesSection';

export default function OwnerProductsPage() {
  const data = useOwnerProductsPageData();
  const actions = useOwnerProductsPageActions(data);

  const isProductsTab = data.viewTab === 'products';

  const categoryOptions = [
    { label: 'Tất cả danh mục', value: '' },
    ...data.allCategories.map((category) => ({
      label: category.name,
      value: category._id,
    })),
  ];

  return (
    <>
      <OwnerProductsHeaderSection />
      {isProductsTab && (
        <OwnerProductsStatsSection data={data} actions={actions} />
      )}

      <GlassPanel card className="mt-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabGroup
            tabs={PRODUCT_VIEW_TABS}
            active={data.viewTab}
            onChange={actions.handleViewTabChange}
          />

          <Input
            className="max-w-xs"
            placeholder={
              isProductsTab ? 'Tìm tên sản phẩm...' : 'Tìm tên danh mục...'
            }
            value={data.searchQuery}
            onChange={(event) => data.setSearchQuery(event.target.value)}
            leftIcon="search-outline"
          />

          {isProductsTab ? (
            <div className="flex flex-wrap items-center gap-3">
              <Select
                className="max-w-xs"
                options={categoryOptions}
                value={data.categoryFilter}
                onChange={(event) => data.setCategoryFilter(event.target.value)}
              />
              <VenueActionGate action={VenueAction.ManageProducts}>
                <Button
                  variant="secondary"
                  iconLeft="archive-outline"
                  onClick={() => actions.openImportStock()}
                >
                  Nhập kho
                </Button>
                <Button
                  iconLeft="add-outline"
                  onClick={actions.openCreateProduct}
                >
                  Thêm sản phẩm
                </Button>
              </VenueActionGate>
            </div>
          ) : (
            <VenueActionGate action={VenueAction.ManageProducts}>
              <Button
                iconLeft="add-outline"
                onClick={actions.openCreateCategory}
              >
                Thêm danh mục
              </Button>
            </VenueActionGate>
          )}
        </div>

        {isProductsTab && (
          <FilterChips
            chips={PRODUCT_STATUS_CHIPS}
            active={data.statusFilter}
            onChange={actions.handleStatusFilterChange}
          />
        )}

        {isProductsTab ? (
          <OwnerProductsTableSection data={data} actions={actions} />
        ) : (
          <OwnerCategoriesSection data={data} actions={actions} />
        )}
      </GlassPanel>

      <ProductFormModal data={data} actions={actions} />
      <ImportStockModal data={data} actions={actions} />
      <CategoryFormModal actions={actions} />
      <DeleteConfirmModals actions={actions} />
    </>
  );
}
