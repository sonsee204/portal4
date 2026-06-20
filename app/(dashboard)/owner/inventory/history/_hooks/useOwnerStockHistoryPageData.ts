/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { useOwnerDateRange } from '@/components/providers/OwnerDateRangeProvider';
import {
  useStockMovementsConnection,
  useVenueProducts,
  type StockMovementNode,
} from '@/hooks/owner';
import {
  ProductStatus,
  StockMovementType,
  FinanceCompareMode,
  type ProductReportFilterInput,
  type StockMovementFilterInput,
} from '@/graphql/generated';
import type { StockMovementTypeFilterId } from '@/lib/inventory/stock-movement-display';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { isStockMovementType, STOCK_HISTORY_TABLE_SORT_FIELDS } from './owner-stock-history.constants';

export function useOwnerStockHistoryPageData() {
  const { selectedVenueId, selectedVenue } = useVenueContext();
  const {
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
  } = useOwnerDateRange();
  const searchParams = useSearchParams();

  const initialProductId = searchParams.get('productId') ?? '';
  const initialTypeParam = searchParams.get('type') ?? 'all';

  const [selectedType, setSelectedType] = useState<StockMovementTypeFilterId>(
    () =>
      isStockMovementType(initialTypeParam) ? initialTypeParam : 'all',
  );
  const [productIdFilter, setProductIdFilter] = useState(
    () => initialProductId,
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(
      () => setDebouncedSearch(searchQuery.trim()),
      300,
    );
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const movementFilter = useMemo((): StockMovementFilterInput | null => {
    if (!selectedVenueId) return null;

    const filter: StockMovementFilterInput = {};
    if (productIdFilter) filter.productId = productIdFilter;
    if (selectedType !== 'all') {
      filter.types = [selectedType as StockMovementType];
    }
    if (dateRange.from) filter.dateFrom = dateRange.from;
    if (dateRange.to) filter.dateTo = dateRange.to;
    if (debouncedSearch) filter.searchQuery = debouncedSearch;

    return filter;
  }, [
    dateRange.from,
    dateRange.to,
    debouncedSearch,
    productIdFilter,
    selectedType,
    selectedVenueId,
  ]);

  const tableSort = useDataTableSortUrl({
    allowedFields: STOCK_HISTORY_TABLE_SORT_FIELDS,
    defaultField: 'quantity',
    defaultDir: 'desc',
    sortParam: 'sort',
    dirParam: 'dir',
  });

  const hasActiveSort = useMemo(() => {
    const field = searchParams.get('sort');
    return (
      field != null &&
      (STOCK_HISTORY_TABLE_SORT_FIELDS as readonly string[]).includes(field)
    );
  }, [searchParams]);

  const movementSort = useMemo(
    () =>
      hasActiveSort
        ? toSortByOrder(tableSort.sortField, tableSort.sortDir)
        : undefined,
    [hasActiveSort, tableSort.sortDir, tableSort.sortField],
  );

  const {
    movements,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  } = useStockMovementsConnection(
    selectedVenueId,
    movementFilter,
    movementSort,
  );

  const sortLoading = loading && movements.length > 0;

  const { products: productOptionsRaw } = useVenueProducts(
    selectedVenueId,
    { status: ProductStatus.Active, includeAllStatuses: false },
    undefined,
    { first: 100 },
    { skip: !selectedVenueId },
  );

  const productOptions = useMemo(
    () =>
      productOptionsRaw.map((product) => ({
        label: product.sku
          ? `${product.name} (${product.sku})`
          : product.name,
        value: product._id,
      })),
    [productOptionsRaw],
  );

  const hasActiveFilters =
    selectedType !== 'all' ||
    Boolean(productIdFilter) ||
    Boolean(debouncedSearch);

  const clearFilters = useCallback(() => {
    setSelectedType('all');
    setProductIdFilter('');
    setSearchQuery('');
  }, []);

  const refetchAll = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const reportFilter = useMemo((): ProductReportFilterInput | null => {
    if (!selectedVenueId || !dateRange.from || !dateRange.to) return null;

    return {
      venueIds: [selectedVenueId],
      from: dateRange.from,
      to: dateRange.to,
      compareToPrevious: false,
      compareMode: FinanceCompareMode.PreviousPeriod,
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }, [dateRange.from, dateRange.to, selectedVenueId]);

  return {
    selectedVenueId,
    selectedVenue,
    scopeLabel: selectedVenue?.name ?? 'Chọn sân',
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
    selectedType,
    setSelectedType,
    productIdFilter,
    setProductIdFilter,
    searchQuery,
    setSearchQuery,
    productOptions,
    movements: movements as StockMovementNode[],
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetchAll,
    hasActiveFilters,
    clearFilters,
    detailProductId,
    setDetailProductId,
    reportFilter,
    tableSort,
    hasActiveSort,
    sortLoading,
  };
}

export type OwnerStockHistoryPageData = ReturnType<
  typeof useOwnerStockHistoryPageData
>;
