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

export const GET_MY_VENUES_STATS = gql`
  query GetMyVenuesStats {
    myVenuesStats {
      totalVenues
      todayBookings
      totalRevenue
    }
  }
`;

export const MY_VENUES_CONNECTION = gql`
  query MyVenuesConnection($pagination: CursorPageInput) {
    myVenuesConnection(pagination: $pagination) {
      edges {
        cursor
        node {
          _id
          name
          status
          courtCount
          location {
            address
            city
          }
          isOwner
          isStaff
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_BOOKINGS_CONNECTION = gql`
  query VenueBookingsConnection(
    $venueId: ID!
    $filter: BookingFilterInput
    $pagination: CursorPageInput
  ) {
    venueBookingsConnection(
      venueId: $venueId
      filter: $filter
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          date
          status
          totalPrice
          finalAmount
          slots {
            courtName
            startTime
            endTime
          }
          customer {
            displayName
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;

export const VENUE_REVENUE_STATS = gql`
  query VenueRevenueStats($venueId: ID!, $period: String) {
    venueRevenueStats(venueId: $venueId, period: $period) {
      period
      startDate
      endDate
      growthPercentage
      bookingRevenue {
        collectedRevenue
        expectedRevenue
      }
    }
  }
`;

export const BOOKING_STATS = gql`
  query BookingStats($venueId: ID!, $fromDate: String, $toDate: String) {
    bookingStats(venueId: $venueId, fromDate: $fromDate, toDate: $toDate) {
      totalBookings
      confirmedBookings
      cancelledBookings
      todayBookings
    }
  }
`;

export const VENUE_ANALYTICS = gql`
  query VenueAnalytics($venueId: ID!, $period: String) {
    venueAnalytics(venueId: $venueId, period: $period) {
      period
      summary {
        totalBookings
        totalRevenue
        averageBookingValue
        revenueChangePercent
      }
      revenueTrend {
        label
        value
      }
    }
  }
`;
