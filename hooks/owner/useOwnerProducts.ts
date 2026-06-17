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

import { useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client/react';
import {
  LOW_STOCK_PRODUCTS,
  MY_VENUES_FOR_PRODUCT_TRANSFER,
  PRODUCT_STATS,
  VENUE_CATEGORIES_CONNECTION,
  VENUE_PRODUCTS_CONNECTION,
} from '@/graphql/owner/queries';
import {
  CREATE_PRODUCT,
  CREATE_PRODUCT_CATEGORY,
  DELETE_PRODUCT,
  DELETE_PRODUCT_CATEGORY,
  IMPORT_STOCK,
  PUBLISH_PRODUCT,
  UNPUBLISH_PRODUCT,
  UPDATE_PRODUCT,
  UPDATE_PRODUCT_CATEGORY,
} from '@/graphql/owner/mutations';
import type {
  CreateProductCategoryInput,
  CreateProductInput,
  ImportStockInput,
  LowStockProductsQuery,
  ProductStatsQuery,
  ProductStatus,
  UpdateProductCategoryInput,
  UpdateProductInput,
  VenueCategoriesConnectionQuery,
  VenueProductsConnectionQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';
import { createMutationOptions, createSilentMutationOptions } from '@/hooks/shared/mutation-helpers';

const PRODUCT_MUTATION_REFETCH_QUERIES = [
  'VenueProductsConnection',
  'ProductStats',
  'LowStockProducts',
] as const;

const CATEGORY_MUTATION_REFETCH_QUERIES = [
  'VenueCategoriesConnection',
  'VenueProductsConnection',
] as const;

export type VenueProductNode = NonNullable<
  NonNullable<
    VenueProductsConnectionQuery['venueProductsConnection']
  >['edges'][number]['node']
>;

export type VenueCategoryNode = NonNullable<
  NonNullable<
    VenueCategoriesConnectionQuery['venueCategoriesConnection']
  >['edges'][number]['node']
>;

export function useVenueProducts(
  venueId: string | null,
  filter?: {
    categoryId?: string;
    includeAllStatuses?: boolean;
    status?: ProductStatus;
    searchQuery?: string;
  },
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const trimmedSearch = filter?.searchQuery?.trim();
  const graphFilter = filter
    ? {
      categoryId: filter.categoryId,
      includeAllStatuses: filter.includeAllStatuses ?? true,
      status: filter.status,
      searchQuery: trimmedSearch || undefined,
    }
    : { includeAllStatuses: true };

  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueProductsConnectionQuery>(VENUE_PRODUCTS_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        filter: graphFilter,
        pagination: { first },
      },
      skip: !venueId || options?.skip,
    });

  const connection = data?.venueProductsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      filter: graphFilter,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueProductsConnection: {
        ...next.venueProductsConnection!,
        edges: mergeConnectionEdges(
          prev.venueProductsConnection?.edges ?? [],
          next.venueProductsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    products: (connectionNodes(connection?.edges) ?? []) as VenueProductNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useVenueCategories(
  venueId: string | null,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueCategoriesConnectionQuery>(VENUE_CATEGORIES_CONNECTION, {
      variables: {
        venueId: venueId ?? '',
        pagination: { first },
      },
      skip: !venueId || options?.skip,
    });

  const connection = data?.venueCategoriesConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      venueId: venueId ?? '',
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueCategoriesConnection: {
        ...next.venueCategoriesConnection!,
        edges: mergeConnectionEdges(
          prev.venueCategoriesConnection?.edges ?? [],
          next.venueCategoriesConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    categories: (connectionNodes(connection?.edges) ?? []) as VenueCategoryNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useProductStats(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<ProductStatsQuery>(
    PRODUCT_STATS,
    {
      variables: { venueId: venueId ?? '' },
      skip: !venueId,
    },
  );
  return { stats: data?.productStats, loading, error, refetch };
}

export function useLowStockProducts(venueId: string | null) {
  const { data, loading, error, refetch } = useQuery<LowStockProductsQuery>(
    LOW_STOCK_PRODUCTS,
    {
      variables: { venueId: venueId ?? '' },
      skip: !venueId,
    },
  );
  return {
    products: data?.lowStockProducts ?? [],
    loading,
    error,
    refetch,
  };
}

export function useOwnerProductMutations() {
  const [createProductMutation, { loading: creating }] = useMutation(
    CREATE_PRODUCT,
    createMutationOptions('CreateProduct', 'Đã tạo sản phẩm'),
  );

  const [updateProductMutation, { loading: updating }] = useMutation(
    UPDATE_PRODUCT,
    createMutationOptions('UpdateProduct', 'Đã cập nhật sản phẩm'),
  );

  const [deleteProductMutation, { loading: deleting }] = useMutation(
    DELETE_PRODUCT,
    createMutationOptions('DeleteProduct', 'Đã xóa sản phẩm'),
  );

  const [publishProductMutation, { loading: publishing }] = useMutation(
    PUBLISH_PRODUCT,
    createMutationOptions('PublishProduct', 'Đã đăng bán sản phẩm'),
  );

  const [unpublishProductMutation, { loading: unpublishing }] = useMutation(
    UNPUBLISH_PRODUCT,
    createMutationOptions('UnpublishProduct', 'Đã ngừng bán sản phẩm'),
  );

  const createProduct = useCallback(
    async (input: CreateProductInput) => {
      await createProductMutation({
        variables: { input },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [createProductMutation],
  );

  const updateProduct = useCallback(
    async (input: UpdateProductInput) => {
      await updateProductMutation({
        variables: { input },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [updateProductMutation],
  );

  const deleteProduct = useCallback(
    async (productId: string) => {
      await deleteProductMutation({
        variables: { productId },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [deleteProductMutation],
  );

  const publishProduct = useCallback(
    async (productId: string) => {
      await publishProductMutation({
        variables: { productId },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [publishProductMutation],
  );

  const unpublishProduct = useCallback(
    async (productId: string) => {
      await unpublishProductMutation({
        variables: { productId },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [unpublishProductMutation],
  );

  return {
    createProduct,
    updateProduct,
    deleteProduct,
    publishProduct,
    unpublishProduct,
    creating,
    updating,
    deleting,
    publishing,
    unpublishing,
    mutationLoading:
      creating || updating || deleting || publishing || unpublishing,
  };
}

export function useImportStock(venueId: string | null) {
  const [importStockMutation, { loading: importing }] = useMutation(
    IMPORT_STOCK,
    createSilentMutationOptions('ImportStock'),
  );

  const importStock = useCallback(
    async (input: ImportStockInput) => {
      await importStockMutation({
        variables: { venueId: venueId ?? '', input },
        refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
      });
    },
    [importStockMutation, venueId],
  );

  return { importStock, importing };
}

export function useOwnerCategoryMutations() {
  const [createCategoryMutation, { loading: creating }] = useMutation(
    CREATE_PRODUCT_CATEGORY,
    createMutationOptions('CreateProductCategory', 'Đã tạo danh mục'),
  );

  const [updateCategoryMutation, { loading: updating }] = useMutation(
    UPDATE_PRODUCT_CATEGORY,
    createMutationOptions('UpdateProductCategory', 'Đã cập nhật danh mục'),
  );

  const [deleteCategoryMutation, { loading: deleting }] = useMutation(
    DELETE_PRODUCT_CATEGORY,
    createMutationOptions('DeleteProductCategory', 'Đã xóa danh mục'),
  );

  const createCategory = useCallback(
    async (input: CreateProductCategoryInput) => {
      await createCategoryMutation({
        variables: { input },
        refetchQueries: [...CATEGORY_MUTATION_REFETCH_QUERIES],
      });
    },
    [createCategoryMutation],
  );

  const updateCategory = useCallback(
    async (input: UpdateProductCategoryInput) => {
      await updateCategoryMutation({
        variables: { input },
        refetchQueries: [...CATEGORY_MUTATION_REFETCH_QUERIES],
      });
    },
    [updateCategoryMutation],
  );

  const deleteCategory = useCallback(
    async (categoryId: string) => {
      await deleteCategoryMutation({
        variables: { categoryId },
        refetchQueries: [...CATEGORY_MUTATION_REFETCH_QUERIES],
      });
    },
    [deleteCategoryMutation],
  );

  return {
    createCategory,
    updateCategory,
    deleteCategory,
    creating,
    updating,
    deleting,
    mutationLoading: creating || updating || deleting,
  };
}

export function useMyVenuesForProductTransfer() {
  const { data, loading, error, refetch } = useQuery<{
    myVenuesForProductTransfer: Array<{ _id: string; name: string }>;
  }>(MY_VENUES_FOR_PRODUCT_TRANSFER);

  return {
    venues: data?.myVenuesForProductTransfer ?? [],
    loading,
    error,
    refetch,
  };
}
