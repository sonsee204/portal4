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
import { useQuery } from '@apollo/client/react';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { toFinanceSortVariables, toSortByOrder } from '@/hooks/shared/useDataTableSort';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import {
  useFinanceTransactions,
  useOwnerFinancePortfolio,
  useOwnerOperationsReport,
  useVenueExpenses,
  useVenueFinanceReport,
} from '@/hooks/owner';
import {
  BookingScheduleType,
  FinanceCompareMode,
  FinanceGranularity,
  FinanceOrderTypeCategory,
  PaymentMethod,
  type VenuePromotionsConnectionQuery,
} from '@/graphql/generated';
import { VENUE_PROMOTIONS_FOR_FILTER } from '@/graphql/owner/finance/queries';
import type { DateRangePreset } from '@/lib/finance/stat-card-trend';
import { resolveDateRangePreset } from '@/lib/finance/stat-card-trend';
import {
  FINANCE_PAGE_SIZE,
  type OwnerFinancePageTab,
} from './owner-finance-page.constants';

const TRANSACTION_SORT_FIELDS = [
  'completedAt',
  'orderCode',
  'grossAmount',
  'netAmount',
  'profitAmount',
] as const;

const EXPENSE_SORT_FIELDS = ['date', 'amount'] as const;

export function useOwnerFinancePageData(pageTab: OwnerFinancePageTab) {
  const {
    selectedVenueId,
    selectedVenue,
    venues,
    setSelectedVenueId,
    financeAllVenues,
    setFinanceAllVenues,
  } = useVenueContext();
  const allVenues = financeAllVenues;
  const [datePreset, setDatePreset] = useState<DateRangePreset>('month');
  const [dateRange, setDateRange] = useState(() =>
    resolveDateRangePreset('month'),
  );
  const [compareMode, setCompareMode] = useState<FinanceCompareMode>(
    FinanceCompareMode.PreviousPeriod,
  );
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
  const [scheduleTypeFilter, setScheduleTypeFilter] = useState('');
  const [promotionIdFilter, setPromotionIdFilter] = useState('');

  const transactionSort = useDataTableSortUrl({
    allowedFields: TRANSACTION_SORT_FIELDS,
    defaultField: 'completedAt',
    defaultDir: 'desc',
    syncUrl: pageTab === 'finance',
  });

  const expenseSort = useDataTableSortUrl({
    allowedFields: EXPENSE_SORT_FIELDS,
    defaultField: 'date',
    defaultDir: 'desc',
    sortParam: 'expSort',
    dirParam: 'expDir',
    syncUrl: pageTab === 'finance',
  });

  const transactionSortInput = useMemo(
    () => toFinanceSortVariables(transactionSort.sortField, transactionSort.sortDir),
    [transactionSort.sortField, transactionSort.sortDir],
  );

  const expenseSortInput = useMemo(
    () => toSortByOrder(expenseSort.sortField, expenseSort.sortDir),
    [expenseSort.sortField, expenseSort.sortDir],
  );

  const venueIds = useMemo(() => {
    if (allVenues) return undefined;
    return selectedVenueId ? [selectedVenueId] : undefined;
  }, [allVenues, selectedVenueId]);

  const financeFilter = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null;
    if (!allVenues && !selectedVenueId) return null;

    return {
      venueIds,
      from: dateRange.from,
      to: dateRange.to,
      granularity: FinanceGranularity.Day,
      compareToPrevious: true,
      compareMode,
      timezone: 'Asia/Ho_Chi_Minh',
      ...(orderTypeFilter
        ? {
          orderTypeCategory: orderTypeFilter as FinanceOrderTypeCategory,
        }
        : {}),
      ...(paymentMethodFilter
        ? { paymentMethod: paymentMethodFilter as PaymentMethod }
        : {}),
      ...(scheduleTypeFilter
        ? { scheduleType: scheduleTypeFilter as BookingScheduleType }
        : {}),
      ...(promotionIdFilter ? { promotionId: promotionIdFilter } : {}),
    };
  }, [
    allVenues,
    compareMode,
    dateRange.from,
    dateRange.to,
    orderTypeFilter,
    paymentMethodFilter,
    promotionIdFilter,
    scheduleTypeFilter,
    selectedVenueId,
    venueIds,
  ]);

  const portfolioFilter = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null;
    if (!allVenues && !selectedVenueId) return null;

    return {
      ...(allVenues || !selectedVenueId
        ? {}
        : { venueIds: [selectedVenueId] }),
      from: dateRange.from,
      to: dateRange.to,
      granularity: FinanceGranularity.Day,
      compareToPrevious: true,
      compareMode,
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }, [
    allVenues,
    compareMode,
    dateRange.from,
    dateRange.to,
    selectedVenueId,
  ]);

  const operationsFilter = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return null;
    if (!allVenues && !selectedVenueId) return null;

    return {
      ...(allVenues || !selectedVenueId
        ? {}
        : { venueIds: [selectedVenueId] }),
      from: dateRange.from,
      to: dateRange.to,
      timezone: 'Asia/Ho_Chi_Minh',
      ...(scheduleTypeFilter
        ? { scheduleType: scheduleTypeFilter as BookingScheduleType }
        : {}),
      ...(promotionIdFilter ? { promotionId: promotionIdFilter } : {}),
    };
  }, [
    allVenues,
    dateRange.from,
    dateRange.to,
    promotionIdFilter,
    scheduleTypeFilter,
    selectedVenueId,
  ]);

  const { data: promotionsData } = useQuery<VenuePromotionsConnectionQuery>(
    VENUE_PROMOTIONS_FOR_FILTER,
    {
      variables: {
        venueId: selectedVenueId ?? '',
        pagination: { first: 50 },
      },
      skip: !selectedVenueId || allVenues,
    },
  );

  const promotionFilterOptions = useMemo(() => {
    const edges = promotionsData?.venuePromotionsConnection?.edges ?? [];
    return [
      { label: 'Tất cả khuyến mãi', value: '' },
      ...edges.map(({ node }) => ({
        label: node.code ? `${node.name} (${node.code})` : node.name,
        value: node._id,
      })),
    ];
  }, [promotionsData]);

  const transactionFilter = useMemo(() => {
    if (!financeFilter) return null;
    return {
      venueIds: financeFilter.venueIds,
      from: financeFilter.from,
      to: financeFilter.to,
      timezone: financeFilter.timezone,
      ...(orderTypeFilter
        ? {
          orderTypeCategory: orderTypeFilter as FinanceOrderTypeCategory,
        }
        : {}),
      ...(paymentMethodFilter
        ? { paymentMethod: paymentMethodFilter as PaymentMethod }
        : {}),
    };
  }, [financeFilter, orderTypeFilter, paymentMethodFilter]);

  const expenseFilter = useMemo(() => {
    if (!selectedVenueId || allVenues) return null;
    return {
      venueId: selectedVenueId,
      from: dateRange.from,
      to: dateRange.to,
    };
  }, [allVenues, dateRange.from, dateRange.to, selectedVenueId]);

  const loadSingleVenueOverviewDetail =
    pageTab === 'portfolio' && !allVenues && !!selectedVenueId;

  const {
    report,
    loading: reportLoading,
    error: reportError,
    refetch: refetchReport,
  } = useVenueFinanceReport(financeFilter, {
    skip: pageTab !== 'finance' && !loadSingleVenueOverviewDetail,
  });

  const {
    portfolio,
    loading: portfolioLoading,
    error: portfolioError,
    refetch: refetchPortfolio,
  } = useOwnerFinancePortfolio(portfolioFilter, {
    skip: pageTab !== 'portfolio',
  });

  const {
    operations,
    loading: operationsLoading,
    error: operationsError,
    refetch: refetchOperations,
  } = useOwnerOperationsReport(operationsFilter, {
    skip: pageTab !== 'operations' && !loadSingleVenueOverviewDetail,
  });

  const {
    transactions,
    totalCount: transactionCount,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
    loadMore: loadMoreTransactions,
    hasNextPage: hasMoreTransactions,
    isLoadingMore: isLoadingMoreTransactions,
  } = useFinanceTransactions(
    transactionFilter,
    transactionSortInput,
    { limit: FINANCE_PAGE_SIZE },
    { skip: pageTab !== 'finance' },
  );

  const {
    expenses,
    totalCount: expenseCount,
    loading: expensesLoading,
    error: expensesError,
    refetch: refetchExpenses,
    loadMore: loadMoreExpenses,
    hasNextPage: hasMoreExpenses,
    isLoadingMore: isLoadingMoreExpenses,
  } = useVenueExpenses(
    expenseFilter,
    expenseSortInput,
    { limit: FINANCE_PAGE_SIZE },
    { skip: allVenues || pageTab !== 'finance' },
  );

  return {
    venues,
    selectedVenue,
    selectedVenueId,
    setSelectedVenueId,
    pageTab,
    allVenues,
    setFinanceAllVenues,
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
    compareMode,
    setCompareMode,
    orderTypeFilter,
    setOrderTypeFilter,
    paymentMethodFilter,
    setPaymentMethodFilter,
    scheduleTypeFilter,
    setScheduleTypeFilter,
    promotionIdFilter,
    setPromotionIdFilter,
    promotionFilterOptions,
    report,
    reportLoading,
    reportError,
    refetchReport,
    portfolio,
    portfolioLoading,
    portfolioError,
    refetchPortfolio,
    operations,
    operationsLoading,
    operationsError,
    refetchOperations,
    transactions,
    transactionCount,
    transactionsLoading,
    transactionsError,
    refetchTransactions,
    loadMoreTransactions,
    hasMoreTransactions,
    isLoadingMoreTransactions,
    expenses,
    expenseCount,
    expensesLoading,
    expensesError,
    refetchExpenses,
    loadMoreExpenses,
    hasMoreExpenses,
    isLoadingMoreExpenses,
    sortField: transactionSort.sortField,
    sortDir: transactionSort.sortDir,
    handleSort: transactionSort.handleSort,
    transactionSortLoading:
      transactionsLoading && transactions.length > 0,
    expenseSortField: expenseSort.sortField,
    expenseSortDir: expenseSort.sortDir,
    handleExpenseSort: expenseSort.handleSort,
    expenseSortLoading: expensesLoading && expenses.length > 0,
    financeFilter,
  };
}

export type OwnerFinancePageData = ReturnType<typeof useOwnerFinancePageData>;
