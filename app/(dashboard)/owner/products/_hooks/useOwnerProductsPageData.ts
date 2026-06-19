/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu@gmail.com>
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
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { PAGE_SIZE } from './owner-products-page.constants';

const PRODUCT_SORT_FIELDS = [
  'name',
  'price',
  'stockQuantity',
  'status',
  'createdAt',
  'displayOrder',
] as const;

const CATEGORY_SORT_FIELDS = ['name', 'displayOrder', 'productCount'] as const;

export function useOwnerProductsPageData() {
  const { selectedVenueId, loading: venueLoading } = useVenueContext();
  const [viewTab, setViewTab] = useState<'products' | 'categories'>('products');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const allowedFields = useMemo(
    () =>
      viewTab === 'categories' ? CATEGORY_SORT_FIELDS : PRODUCT_SORT_FIELDS,
    [viewTab],
  );

  const { sortField, sortDir, handleSort } = useDataTableSortUrl({
    allowedFields,
    defaultField: viewTab === 'categories' ? 'displayOrder' : 'name',
    defaultDir: viewTab === 'categories' ? 'asc' : 'asc',
  });

  const sort = useMemo(
    () => toSortByOrder(sortField, sortDir),
    [sortField, sortDir],
  );

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
    sort,
    pagination,
    { skip: viewTab !== 'products' },
  );

  const categoriesQuery = useVenueCategories(
    selectedVenueId,
    sort,
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

  const categoriesForSelect = useVenueCategories(
    selectedVenueId,
    { sortBy: 'name', sortOrder: 'asc' },
    { limit: 100 },
  );

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

  const productsSortLoading =
    viewTab === 'products' &&
    productsQuery.loading &&
    productsQuery.products.length > 0;

  const categoriesSortLoading =
    viewTab === 'categories' &&
    categoriesQuery.loading &&
    categoriesQuery.categories.length > 0 &&
    !normalizedSearch;

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
    productsIsLoadingMore: productsQuery.isLoadingMore,
    productsLoading: productsQuery.loading,
    productsError: productsQuery.error,
    categories: filteredCategories,
    categoriesTotalCount: normalizedSearch
      ? filteredCategories.length
      : categoriesQuery.totalCount,
    categoriesHasNextPage: normalizedSearch ? false : categoriesQuery.hasNextPage,
    categoriesLoadMore: categoriesQuery.loadMore,
    categoriesIsLoadingMore: categoriesQuery.isLoadingMore,
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
    productSortField: sortField,
    productSortDir: sortDir,
    handleProductSort: handleSort,
    productSortLoading: productsSortLoading,
    categorySortField: sortField,
    categorySortDir: sortDir,
    handleCategorySort: handleSort,
    categorySortLoading: categoriesSortLoading,
  };
}

export type OwnerProductsPageData = ReturnType<typeof useOwnerProductsPageData>;
