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
import {
  DISCOUNT_CALCULATION_FRAGMENT,
  PROMOTION_CORE_FRAGMENT,
} from './fragments';

export const VALIDATE_PROMO_CODE = gql`
  query ValidatePromoCode($input: ValidatePromoCodeInput!) {
    validatePromoCode(input: $input) {
      isValid
      errorMessage
      promotion {
        ...PromotionCore
      }
      estimatedDiscount
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const CALCULATE_BOOKING_DISCOUNT = gql`
  query CalculateBookingDiscount($input: ApplyPromotionInput!) {
    calculateBookingDiscount(input: $input) {
      ...DiscountCalculation
    }
  }
  ${DISCOUNT_CALCULATION_FRAGMENT}
`;

export const GET_AVAILABLE_PROMOTIONS_FOR_BOOKING = gql`
  query GetAvailablePromotionsForBooking($input: ApplyPromotionInput!) {
    availablePromotionsForBooking(input: $input) {
      autoApplied {
        ...PromotionCore
      }
      codePromotions {
        ...PromotionCore
      }
      preCalculatedDiscount {
        ...DiscountCalculation
      }
      hasPromotions
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
  ${DISCOUNT_CALCULATION_FRAGMENT}
`;

export const CHECK_RECURRING_AVAILABILITY = gql`
  query CheckRecurringAvailability(
    $venueId: ID!
    $startDate: String!
    $durationMonths: Int!
    $slots: [BookedSlotInput!]
    $daySchedules: [DayScheduleInput!]
    $isStaffMode: Boolean
    $excludeDates: [String!]
    $customerId: ID
    $discountCode: String
  ) {
    checkRecurringAvailability(
      venueId: $venueId
      startDate: $startDate
      durationMonths: $durationMonths
      slots: $slots
      daySchedules: $daySchedules
      isStaffMode: $isStaffMode
      excludeDates: $excludeDates
      customerId: $customerId
      discountCode: $discountCode
    ) {
      allAvailable
      allDates
      unavailableDates
      availableDates
      totalSessions
      sessionsPerWeek
      daysOfWeek
      pricePerSession
      totalPrice
      discountPercent
      discountAmount
      finalAmount
      recurringEnabled
      effectiveSessions
      excludedSessionCount
      recurringPromoEligible
      minRecurringPromoSessions
      recurringCategoryDiscount
      autoPromoDiscount
      finalAmountWithPromo
      appliedPromotions {
        promotionId
        name
        category
        discountAmount
        code
        type
        value
      }
      dayPriceBreakdown {
        dayOfWeek
        pricePerSession
        sessionCount
        totalPrice
      }
    }
  }
`;
