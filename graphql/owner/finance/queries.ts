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

export { VENUE_PROMOTIONS_CONNECTION as VENUE_PROMOTIONS_FOR_FILTER } from '../promotions/queries';

const FINANCE_PNL_METRIC_FIELDS = gql`
  fragment FinancePnlMetricFields on FinancePnlMetric {
    value
    previousValue
    changePercent
  }
`;

const FINANCE_PNL_RATE_METRIC_FIELDS = gql`
  fragment FinancePnlRateMetricFields on FinancePnlRateMetric {
    value
    previousValue
    changePercent
  }
`;

const FINANCE_PERIOD_FIELDS = gql`
  fragment FinancePeriodFields on FinancePeriodInfo {
    from
    to
    previousFrom
    previousTo
    timezone
  }
`;

const FINANCE_BREAKDOWN_ITEM_FIELDS = gql`
  fragment FinanceBreakdownItemFields on FinanceBreakdownItem {
    label
    key
    revenue
    count
    percentage
  }
`;

export const VENUE_FINANCE_PORTFOLIO = gql`
  ${FINANCE_PNL_METRIC_FIELDS}
  ${FINANCE_PNL_RATE_METRIC_FIELDS}
  query VenueFinancePortfolio($filter: FinanceFilterInput!) {
    venueFinancePortfolio(filter: $filter) {
      totalVenues
      venues {
        venueId
        venueName
        grossRevenue {
          ...FinancePnlMetricFields
        }
        netProfit {
          ...FinancePnlMetricFields
        }
        netMarginPercent {
          ...FinancePnlRateMetricFields
        }
        grossProfit {
          ...FinancePnlMetricFields
        }
        netRevenue {
          ...FinancePnlMetricFields
        }
        completedOrders
      }
    }
  }
`;

export const VENUE_OPERATIONS_REPORT = gql`
  ${FINANCE_PERIOD_FIELDS}
  ${FINANCE_BREAKDOWN_ITEM_FIELDS}
  query VenueOperationsReport($filter: OperationsFilterInput!) {
    venueOperationsReport(filter: $filter) {
      period {
        ...FinancePeriodFields
      }
      totalBookings
      courtRevenue
      unpaidAmount
      occupancy {
        availableSlots
        occupiedSlots
        occupancyRate
      }
      byScheduleType {
        ...FinanceBreakdownItemFields
      }
      byPromotion {
        ...FinanceBreakdownItemFields
      }
      heatMapData {
        hour
        day
        intensity
        bookings
      }
      scheduleCoverageTrend {
        date
        label
        revenue
        bookingCount
        occupiedSlots
        availableSlots
        occupancyRate
        previousRevenue
        previousOccupancyRate
      }
    }
  }
`;
