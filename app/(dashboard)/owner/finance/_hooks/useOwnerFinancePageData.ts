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
import {
  useFinanceTransactions,
  useVenueExpenses,
  useVenueFinanceReport,
} from '@/hooks/owner';
import {
  FinanceGranularity,
  OrderType,
  PaymentMethod,
} from '@/graphql/generated';
import type { DateRangePreset } from '@/lib/finance/stat-card-trend';
import { resolveDateRangePreset } from '@/lib/finance/stat-card-trend';
import { FINANCE_PAGE_SIZE } from './owner-finance-page.constants';

export function useOwnerFinancePageData() {
  const { selectedVenueId, selectedVenue, venues } = useVenueContext();
  const [allVenues, setAllVenues] = useState(false);
  const [datePreset, setDatePreset] = useState<DateRangePreset>('month');
  const [dateRange, setDateRange] = useState(() =>
    resolveDateRangePreset('month'),
  );
  const [orderTypeFilter, setOrderTypeFilter] = useState('');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('');
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
      timezone: 'Asia/Ho_Chi_Minh',
      ...(orderTypeFilter
        ? { orderType: orderTypeFilter as OrderType }
        : {}),
      ...(paymentMethodFilter
        ? { paymentMethod: paymentMethodFilter as PaymentMethod }
        : {}),
    };
  }, [
    allVenues,
    dateRange.from,
    dateRange.to,
    orderTypeFilter,
    paymentMethodFilter,
    selectedVenueId,
    venueIds,
  ]);

  const transactionFilter = useMemo(() => {
    if (!financeFilter) return null;
    return {
      venueIds: financeFilter.venueIds,
      from: financeFilter.from,
      to: financeFilter.to,
      timezone: financeFilter.timezone,
      ...(orderTypeFilter
        ? { orderType: orderTypeFilter as OrderType }
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
  } = useVenueFinanceReport(financeFilter);

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
    { skip: allVenues },
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
    allVenues,
    setAllVenues,
    datePreset,
    setDatePreset,
    dateRange,
    setDateRange,
    orderTypeFilter,
    setOrderTypeFilter,
    paymentMethodFilter,
    setPaymentMethodFilter,
    report,
    reportLoading,
    reportError,
    refetchReport,
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
