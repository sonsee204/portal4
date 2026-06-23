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
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { useOwnerDateRange } from '@/components/providers/OwnerDateRangeProvider';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import {
  useVenueCategories,
  useVenueProductReport,
  type ProductReportRowNode,
  type VenueProductReportData,
} from '@/hooks/owner';
import {
  ProductStatus,
  type ProductReportFilterInput,
} from '@/graphql/generated';
import { PRODUCT_STATS_PAGE_SIZE } from './owner-product-stats.constants';

const TABLE_SORT_FIELDS = [
  'revenue',
  'cogs',
  'soldQuantity',
  'grossProfit',
  'revenuePercentage',
  'productName',
  'stockQuantity',
] as const;

export function useOwnerProductStatsPageData() {
  const {
    selectedVenueId,
    selectedVenue,
    financeAllVenues,
  } = useVenueContext();

  const allVenues = financeAllVenues;
  const {
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
    compareMode,
    setCompareMode,
  } = useOwnerDateRange();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [categoryIdFilter, setCategoryIdFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [soldInPeriodOnly, setSoldInPeriodOnly] = useState(false);
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const [tableCursor, setTableCursor] = useState<string | null>(null);
  const [paginationAnchor, setPaginationAnchor] = useState<string | null>(null);
  const [detailProductId, setDetailProductId] = useState<string | null>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchQuery.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchQuery]);

  const filterPaginationKey = useMemo(
    () =>
      JSON.stringify({
        allVenues,
        selectedVenueId,
        from: dateRange.from,
        to: dateRange.to,
        compareMode,
        debouncedSearch,
        categoryIdFilter,
        statusFilter,
        soldInPeriodOnly,
        lowStockOnly,
      }),
    [
      allVenues,
      selectedVenueId,
      dateRange.from,
      dateRange.to,
      compareMode,
      debouncedSearch,
      categoryIdFilter,
      statusFilter,
      soldInPeriodOnly,
      lowStockOnly,
    ],
  );

  const effectiveTableCursor =
    paginationAnchor === filterPaginationKey ? tableCursor : null;

  const tableSort = useDataTableSortUrl({
    allowedFields: TABLE_SORT_FIELDS,
    defaultField: 'revenue',
    defaultDir: 'desc',
    sortParam: 'sort',
    dirParam: 'dir',
  });

  const venueIds = useMemo(() => {
    if (allVenues) return undefined;
    return selectedVenueId ? [selectedVenueId] : undefined;
  }, [allVenues, selectedVenueId]);

  const baseFilter = useMemo((): ProductReportFilterInput | null => {
    if (!dateRange.from || !dateRange.to) return null;
    if (!allVenues && !selectedVenueId) return null;

    return {
      venueIds,
      from: dateRange.from,
      to: dateRange.to,
      compareToPrevious: true,
      compareMode,
      timezone: 'Asia/Ho_Chi_Minh',
      ...(debouncedSearch ? { searchQuery: debouncedSearch } : {}),
      ...(categoryIdFilter ? { categoryId: categoryIdFilter } : {}),
      ...(statusFilter ? { status: statusFilter as ProductStatus } : {}),
      ...(soldInPeriodOnly ? { soldInPeriodOnly: true } : {}),
      ...(lowStockOnly ? { lowStockOnly: true } : {}),
    };
  }, [
    allVenues,
    categoryIdFilter,
    compareMode,
    dateRange.from,
    dateRange.to,
    debouncedSearch,
    lowStockOnly,
    selectedVenueId,
    soldInPeriodOnly,
    statusFilter,
    venueIds,
  ]);

  const reportFilter = useMemo((): ProductReportFilterInput | null => {
    if (!baseFilter) return null;

    return {
      ...baseFilter,
      tablePagination: {
        first: PRODUCT_STATS_PAGE_SIZE,
        ...(effectiveTableCursor ? { after: effectiveTableCursor } : {}),
      },
    };
  }, [baseFilter, effectiveTableCursor]);

  const { report, loading, error, refetch } = useVenueProductReport(reportFilter);

  const categoriesVenueId = allVenues ? null : selectedVenueId;
  const { categories } = useVenueCategories(categoriesVenueId);

  const tableRows = useMemo(
    () => report?.productsTable.edges.map((edge) => edge.node) ?? [],
    [report?.productsTable],
  );

  const sortedTableRows = useMemo(() => {
    const rows = [...tableRows];
    const field = tableSort.sortField;
    const dir = tableSort.sortDir === 'asc' ? 1 : -1;

    rows.sort((a, b) => {
      const left = a[field as keyof ProductReportRowNode];
      const right = b[field as keyof ProductReportRowNode];

      if (typeof left === 'string' && typeof right === 'string') {
        return left.localeCompare(right, 'vi') * dir;
      }

      return ((Number(left) || 0) - (Number(right) || 0)) * dir;
    });

    return rows;
  }, [tableRows, tableSort.sortDir, tableSort.sortField]);

  const scopeLabel = allVenues
    ? 'Tất cả sân'
    : (selectedVenue?.name ?? 'Chọn sân');

  const loadMoreTable = useCallback(() => {
    const endCursor = report?.productsTable.pageInfo.endCursor;
    if (!endCursor || !report?.productsTable.pageInfo.hasNextPage) return;
    setTableCursor(endCursor);
    setPaginationAnchor(filterPaginationKey);
  }, [
    filterPaginationKey,
    report?.productsTable.pageInfo.endCursor,
    report?.productsTable.pageInfo.hasNextPage,
  ]);

  const refetchAll = useCallback(async () => {
    setTableCursor(null);
    setPaginationAnchor(null);
    await refetch();
  }, [refetch]);

  return {
    allVenues,
    selectedVenueId,
    selectedVenue,
    scopeLabel,
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
    compareMode,
    setCompareMode,
    searchQuery,
    setSearchQuery,
    categoryIdFilter,
    setCategoryIdFilter,
    statusFilter,
    setStatusFilter,
    soldInPeriodOnly,
    setSoldInPeriodOnly,
    lowStockOnly,
    setLowStockOnly,
    report,
    reportLoading: loading,
    reportError: error,
    refetchReport: refetchAll,
    baseFilter,
    tableRows: sortedTableRows,
    tableTotalCount: report?.productsTable.totalCount ?? 0,
    tableHasNextPage: report?.productsTable.pageInfo.hasNextPage ?? false,
    tableLoadingMore: loading && Boolean(effectiveTableCursor),
    loadMoreTable,
    tableSort,
    categoryOptions: categories.map((category) => ({
      label: category.name,
      value: category._id,
    })),
    detailProductId,
    setDetailProductId,
  };
}

export type OwnerProductStatsPageData = ReturnType<
  typeof useOwnerProductStatsPageData
> & {
  report: VenueProductReportData | null;
};
