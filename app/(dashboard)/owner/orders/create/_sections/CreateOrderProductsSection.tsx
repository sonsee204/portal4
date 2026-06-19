/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import { CreateOrderEmptyProducts } from '../_components/CreateOrderEmptyProducts';
import { CreateOrderProductRow } from '../_components/CreateOrderProductRow';
import type { CreateOrderPageActions } from '../_hooks/useCreateOrderPageActions';
import type { CreateOrderPageData } from '../_hooks/useCreateOrderPageData';

interface CreateOrderProductsSectionProps {
  data: CreateOrderPageData;
  actions: CreateOrderPageActions;
}

export function CreateOrderProductsSection({
  data,
  actions,
}: CreateOrderProductsSectionProps) {
  const {
    categories,
    selectedCategoryId,
    setSelectedCategoryId,
    searchQuery,
    setSearchQuery,
    products,
    productsLoading,
    productsHasNextPage,
    loadMoreProducts,
    productsLoadingMore,
  } = data;

  const categoryChips = [
    { label: 'Tất cả', value: 'ALL' },
    ...categories.map((c) => ({ label: c.name, value: c._id })),
  ];

  return (
    <GlassPanel card className="space-y-4">
      <h2 className="text-heading text-base font-semibold">Sản phẩm</h2>

      <Input
        placeholder="Tìm tên, SKU..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        leftIcon="search-outline"
      />

      {categories.length > 0 ? (
        <FilterChips
          chips={categoryChips}
          active={selectedCategoryId ?? 'ALL'}
          onChange={(value) =>
            setSelectedCategoryId(value === 'ALL' ? null : value)
          }
        />
      ) : null}

      {productsLoading && products.length === 0 ? (
        <QueryState loading={true} empty={false}>
          <span />
        </QueryState>
      ) : products.length === 0 ? (
        <CreateOrderEmptyProducts />
      ) : (
        <>
          <div className="max-h-[min(50vh,480px)] overflow-y-auto pr-1">
            {products.map((product) => (
              <CreateOrderProductRow
                key={product._id}
                product={product}
                quantity={actions.getQuantity(product._id)}
                actions={actions}
              />
            ))}
          </div>
          {productsHasNextPage ? (
            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => void loadMoreProducts()}
                disabled={productsLoadingMore}
              >
                {productsLoadingMore ? 'Đang tải...' : 'Tải thêm sản phẩm'}
              </Button>
            </div>
          ) : null}
        </>
      )}
    </GlassPanel>
  );
}
