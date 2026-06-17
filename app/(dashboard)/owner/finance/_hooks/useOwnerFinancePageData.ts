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
  type VenuePromotionsForFilterQuery,
} from '@/graphql/generated';
import { VENUE_PROMOTIONS_FOR_FILTER } from '@/graphql/owner/finance/queries';
import type { DateRangePreset } from '@/lib/finance/stat-card-trend';
import { resolveDateRangePreset } from '@/lib/finance/stat-card-trend';
import {
  FINANCE_PAGE_SIZE,
  type OwnerFinancePageTab,
} from './owner-finance-page.constants';

export function useOwnerFinancePageData() {
  const {
    selectedVenueId,
    selectedVenue,
    venues,
    setSelectedVenueId,
  } = useVenueContext();
  const [pageTab, setPageTab] = useState<OwnerFinancePageTab>('portfolio');
  const [allVenues, setAllVenues] = useState(false);
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
  const [sortField, setSortField] = useState('completedAt');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

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
    return {
      from: dateRange.from,
      to: dateRange.to,
      granularity: FinanceGranularity.Day,
      compareToPrevious: true,
      compareMode,
      timezone: 'Asia/Ho_Chi_Minh',
    };
  }, [compareMode, dateRange.from, dateRange.to]);

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

  const { data: promotionsData } = useQuery<VenuePromotionsForFilterQuery>(
    VENUE_PROMOTIONS_FOR_FILTER,
    {
      variables: { venueId: selectedVenueId ?? '' },
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

  const {
    report,
    loading: reportLoading,
    error: reportError,
    refetch: refetchReport,
  } = useVenueFinanceReport(financeFilter, {
    skip: pageTab !== 'finance',
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
    skip: pageTab !== 'operations',
  });

  const {
    transactions,
    totalCount: transactionCount,
    loading: transactionsLoading,
    error: transactionsError,
    refetch: refetchTransactions,
    loadMore: loadMoreTransactions,
    hasNextPage: hasMoreTransactions,
  } = useFinanceTransactions(
    transactionFilter,
    { field: sortField, order: sortDir },
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
  } = useVenueExpenses(
    expenseFilter,
    { limit: FINANCE_PAGE_SIZE },
    { skip: allVenues || pageTab !== 'finance' },
  );

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortDir('desc');
  };

  return {
    venues,
    selectedVenue,
    selectedVenueId,
    setSelectedVenueId,
    pageTab,
    setPageTab,
    allVenues,
    setAllVenues,
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
    expenses,
    expenseCount,
    expensesLoading,
    expensesError,
    refetchExpenses,
    loadMoreExpenses,
    hasMoreExpenses,
    sortField,
    sortDir,
    handleSort,
    financeFilter,
  };
}

export type OwnerFinancePageData = ReturnType<typeof useOwnerFinancePageData>;
