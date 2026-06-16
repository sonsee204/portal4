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

import { useMemo, useState } from 'react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { ProductStatus } from '@/graphql/generated';
import {
  useLowStockProducts,
  useProductStats,
  useVenueCategories,
  useVenueDetail,
  useVenueProducts,
  type VenueCategoryNode,
  type VenueProductNode,
} from '@/hooks/owner';
import { PAGE_SIZE } from './owner-products-page.constants';

export function useOwnerProductsPageData() {
  const { selectedVenueId, loading: venueLoading } = useVenueContext();
  const [viewTab, setViewTab] = useState<'products' | 'categories'>('products');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const pagination = { limit: PAGE_SIZE };

  const productsFilter = useMemo(
    () => ({
      categoryId: categoryFilter || undefined,
      includeAllStatuses: true,
      status:
        statusFilter === 'ALL'
          ? undefined
          : (statusFilter as ProductStatus),
      searchQuery: searchQuery.trim() || undefined,
    }),
    [categoryFilter, statusFilter, searchQuery],
  );

  const productsQuery = useVenueProducts(
    selectedVenueId,
    productsFilter,
    pagination,
    { skip: viewTab !== 'products' },
  );

  const categoriesQuery = useVenueCategories(
    selectedVenueId,
    pagination,
    { skip: viewTab !== 'categories' },
  );

  const { stats, loading: statsLoading, refetch: refetchStats } =
    useProductStats(selectedVenueId);

  const { venue, loading: venueDetailLoading } =
    useVenueDetail(selectedVenueId);

  const {
    products: lowStockProducts,
    loading: lowStockLoading,
    refetch: refetchLowStock,
  } = useLowStockProducts(selectedVenueId);

  const categoriesForSelect = useVenueCategories(selectedVenueId, {
    limit: 100,
  });

  const normalizedSearch = searchQuery.trim().toLowerCase();
  const filteredCategories = useMemo(() => {
    if (!normalizedSearch) {
      return categoriesQuery.categories as VenueCategoryNode[];
    }

    return (categoriesQuery.categories as VenueCategoryNode[]).filter((category) =>
      category.name.toLowerCase().includes(normalizedSearch),
    );
  }, [categoriesQuery.categories, normalizedSearch]);

  const refetchAll = () => {
    void productsQuery.refetch();
    void categoriesQuery.refetch();
    void categoriesForSelect.refetch();
    void refetchStats();
    void refetchLowStock();
  };

  return {
    venueId: selectedVenueId,
    venueLoading,
    viewTab,
    setViewTab,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    searchQuery,
    setSearchQuery,
    products: productsQuery.products as VenueProductNode[],
    productsTotalCount: productsQuery.totalCount,
    productsHasNextPage: productsQuery.hasNextPage,
    productsLoadMore: productsQuery.loadMore,
    productsLoading: productsQuery.loading,
    productsError: productsQuery.error,
    categories: filteredCategories,
    categoriesTotalCount: normalizedSearch
      ? filteredCategories.length
      : categoriesQuery.totalCount,
    categoriesHasNextPage: normalizedSearch ? false : categoriesQuery.hasNextPage,
    categoriesLoadMore: categoriesQuery.loadMore,
    categoriesLoading: categoriesQuery.loading,
    categoriesError: categoriesQuery.error,
    allCategories: categoriesForSelect.categories as VenueCategoryNode[],
    stats,
    statsLoading,
    lowStockProducts,
    lowStockLoading,
    marginThresholds: venue?.marginThresholds ?? null,
    venueDetailLoading,
    refetchAll,
  };
}

export type OwnerProductsPageData = ReturnType<typeof useOwnerProductsPageData>;
