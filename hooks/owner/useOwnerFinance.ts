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

import { useMutation, useQuery } from '@apollo/client/react';
import {
  CREATE_VENUE_EXPENSE,
  DELETE_VENUE_EXPENSE,
  UPDATE_VENUE_EXPENSE,
  VENUE_EXPENSES_CONNECTION,
  VENUE_FINANCE_REPORT,
  VENUE_FINANCE_TRANSACTIONS_CONNECTION,
} from '@/graphql/owner/finance';
import { strictMutationErrorPolicy } from '@/hooks/shared/mutation-helpers';
import type {
  CreateVenueExpenseInput,
  CreateVenueExpenseMutation,
  CreateVenueExpenseMutationVariables,
  DeleteVenueExpenseMutation,
  DeleteVenueExpenseMutationVariables,
  ExpenseFilterInput,
  FinanceFilterInput,
  FinanceTransactionFilterInput,
  FinanceTransactionSortInput,
  UpdateVenueExpenseInput,
  UpdateVenueExpenseMutation,
  UpdateVenueExpenseMutationVariables,
  VenueExpensesConnectionQuery,
  VenueFinanceReportQuery,
  VenueFinanceTransactionsConnectionQuery,
} from '@/graphql/generated';
import {
  connectionNodes,
  mergeConnectionEdges,
  resolveConnectionFirst,
  useConnectionLoadMore,
  type LegacyPagePagination,
} from '@/hooks/shared/useCursorConnection';

export type FinanceReport = NonNullable<
  VenueFinanceReportQuery['venueFinanceReport']
>;
export type FinanceTransactionNode = NonNullable<
  VenueFinanceTransactionsConnectionQuery['venueFinanceTransactionsConnection']
>['edges'][number]['node'];
export type VenueExpenseNode = NonNullable<
  VenueExpensesConnectionQuery['venueExpensesConnection']
>['edges'][number]['node'];

export function useVenueFinanceReport(
  filter: FinanceFilterInput | null,
  options?: { skip?: boolean },
) {
  const { data, loading, error, refetch } = useQuery<VenueFinanceReportQuery>(
    VENUE_FINANCE_REPORT,
    {
      variables: { filter: filter! },
      skip: !filter || options?.skip,
      fetchPolicy: 'cache-and-network',
    },
  );

  return {
    report: data?.venueFinanceReport ?? null,
    loading,
    error,
    refetch,
  };
}

export function useFinanceTransactions(
  filter: FinanceTransactionFilterInput | null,
  sort?: FinanceTransactionSortInput,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueFinanceTransactionsConnectionQuery>(
      VENUE_FINANCE_TRANSACTIONS_CONNECTION,
      {
        variables: {
          filter: filter!,
          sort,
          pagination: { first },
        },
        skip: !filter || options?.skip,
        fetchPolicy: 'cache-and-network',
      },
    );

  const connection = data?.venueFinanceTransactionsConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      filter: filter!,
      sort,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueFinanceTransactionsConnection: {
        ...next.venueFinanceTransactionsConnection!,
        edges: mergeConnectionEdges(
          prev.venueFinanceTransactionsConnection?.edges ?? [],
          next.venueFinanceTransactionsConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    transactions: (connectionNodes(connection?.edges) ??
      []) as FinanceTransactionNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useVenueExpenses(
  filter: ExpenseFilterInput | null,
  pagination?: LegacyPagePagination,
  options?: { skip?: boolean },
) {
  const first = resolveConnectionFirst(pagination);
  const { data, loading, error, refetch, fetchMore } =
    useQuery<VenueExpensesConnectionQuery>(VENUE_EXPENSES_CONNECTION, {
      variables: {
        filter: filter!,
        pagination: { first },
      },
      skip: !filter?.venueId || options?.skip,
      fetchPolicy: 'cache-and-network',
    });

  const connection = data?.venueExpensesConnection;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  const { loadMore } = useConnectionLoadMore({
    data,
    hasNextPage,
    endCursor: connection?.pageInfo?.endCursor,
    fetchMore,
    buildVariables: (after) => ({
      filter: filter!,
      pagination: { first, after },
    }),
    mergeResults: (prev, next) => ({
      ...next,
      venueExpensesConnection: {
        ...next.venueExpensesConnection!,
        edges: mergeConnectionEdges(
          prev.venueExpensesConnection?.edges ?? [],
          next.venueExpensesConnection?.edges ?? [],
        ),
      },
    }),
  });

  return {
    expenses: (connectionNodes(connection?.edges) ?? []) as VenueExpenseNode[],
    totalCount: connection?.totalCount ?? 0,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  };
}

export function useExpenseMutations() {
  const [createMutation, createState] = useMutation<
    CreateVenueExpenseMutation,
    CreateVenueExpenseMutationVariables
  >(CREATE_VENUE_EXPENSE, {
    refetchQueries: ['VenueFinanceReport', 'VenueExpensesConnection'],
    ...strictMutationErrorPolicy,
  });

  const [updateMutation, updateState] = useMutation<
    UpdateVenueExpenseMutation,
    UpdateVenueExpenseMutationVariables
  >(UPDATE_VENUE_EXPENSE, {
    refetchQueries: ['VenueFinanceReport', 'VenueExpensesConnection'],
    ...strictMutationErrorPolicy,
  });

  const [deleteMutation, deleteState] = useMutation<
    DeleteVenueExpenseMutation,
    DeleteVenueExpenseMutationVariables
  >(DELETE_VENUE_EXPENSE, {
    refetchQueries: ['VenueFinanceReport', 'VenueExpensesConnection'],
    ...strictMutationErrorPolicy,
  });

  return {
    createExpense: (input: CreateVenueExpenseInput) =>
      createMutation({ variables: { input } }),
    updateExpense: (input: UpdateVenueExpenseInput) =>
      updateMutation({ variables: { input } }),
    deleteExpense: (expenseId: string) =>
      deleteMutation({ variables: { expenseId } }),
    creating: createState.loading,
    updating: updateState.loading,
    deleting: deleteState.loading,
  };
}
