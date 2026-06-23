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

export const CREATE_STAFF_RECURRING_BOOKING = gql`
  mutation CreateStaffRecurringBooking(
    $input: CreateStaffRecurringBookingInput!
  ) {
    createStaffRecurringBooking(input: $input) {
      booking {
        _id
        date
        status
        finalAmount
        isRecurring
        discount
        discountCode
        isManualPrice
        manualFinalAmount
        recurringConfig {
          totalSessions
          endDate
          durationMonths
          frequency
        }
        slots {
          courtId
          courtName
          startTime
          endTime
          price
        }
        customer {
          _id
          displayName
          phone
        }
      }
      order {
        _id
        orderCode
        status
        totalAmount
      }
    }
  }
`;
