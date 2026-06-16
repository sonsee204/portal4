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

import { gql } from 'graphql-tag';

const FINANCE_PNL_METRIC_FIELDS = gql`
  fragment FinancePnlMetricFields on FinancePnlMetric {
    value
    previousValue
    changePercent
  }
`;

export const VENUE_FINANCE_REPORT = gql`
  ${FINANCE_PNL_METRIC_FIELDS}
  query VenueFinanceReport($filter: FinanceFilterInput!) {
    venueFinanceReport(filter: $filter) {
      period {
        from
        to
        previousFrom
        previousTo
        timezone
      }
      pendingBookingRevenue
      totalOrders
      completedOrders
      averageOrderValue
      completionRate
      pnl {
        grossRevenue {
          ...FinancePnlMetricFields
        }
        collected {
          ...FinancePnlMetricFields
        }
        outstanding {
          ...FinancePnlMetricFields
        }
        refunds {
          ...FinancePnlMetricFields
        }
        netRevenue {
          ...FinancePnlMetricFields
        }
        cogs {
          ...FinancePnlMetricFields
        }
        grossProfit {
          ...FinancePnlMetricFields
        }
        operatingExpenses {
          ...FinancePnlMetricFields
        }
        netProfit {
          ...FinancePnlMetricFields
        }
        netMarginPercent {
          ...FinancePnlMetricFields
        }
      }
      byStatus {
        label
        key
        revenue
        count
        percentage
      }
      byPaymentMethod {
        label
        key
        revenue
        count
        percentage
      }
      byOrderType {
        label
        key
        revenue
        count
        percentage
      }
      byCourt {
        label
        key
        revenue
        count
        percentage
      }
      expenseByCategory {
        label
        key
        revenue
        count
        percentage
      }
      trend {
        label
        revenue
        netProfit
        expenses
        previousRevenue
      }
    }
  }
`;

export const VENUE_FINANCE_TRANSACTIONS_CONNECTION = gql`
  query VenueFinanceTransactionsConnection(
    $filter: FinanceTransactionFilterInput!
    $sort: FinanceTransactionSortInput
    $pagination: CursorPageInput
  ) {
    venueFinanceTransactionsConnection(
      filter: $filter
      sort: $sort
      pagination: $pagination
    ) {
      totalCount
      edges {
        cursor
        node {
          orderId
          orderCode
          venueId
          venueName
          createdAt
          completedAt
          paidAt
          orderType
          status
          paymentStatus
          paymentMethod
          courtLabel
          customerName
          grossAmount
          paidAmount
          refundAmount
          netAmount
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const VENUE_EXPENSES_CONNECTION = gql`
  query VenueExpensesConnection(
    $filter: ExpenseFilterInput!
    $pagination: CursorPageInput
  ) {
    venueExpensesConnection(filter: $filter, pagination: $pagination) {
      totalCount
      edges {
        cursor
        node {
          _id
          venueId
          category
          amount
          date
          note
          paymentMethod
          isRecurring
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const CREATE_VENUE_EXPENSE = gql`
  mutation CreateVenueExpense($input: CreateVenueExpenseInput!) {
    createVenueExpense(input: $input) {
      _id
      category
      amount
      date
      note
      paymentMethod
      isRecurring
    }
  }
`;

export const UPDATE_VENUE_EXPENSE = gql`
  mutation UpdateVenueExpense($input: UpdateVenueExpenseInput!) {
    updateVenueExpense(input: $input) {
      _id
      category
      amount
      date
      note
      paymentMethod
      isRecurring
    }
  }
`;

export const DELETE_VENUE_EXPENSE = gql`
  mutation DeleteVenueExpense($expenseId: ID!) {
    deleteVenueExpense(expenseId: $expenseId)
  }
`;
