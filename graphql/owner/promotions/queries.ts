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
  PROMOTION_CORE_FRAGMENT,
  PROMOTION_DETAIL_EXTRA_FRAGMENT,
} from './fragments';

export const VENUE_PROMOTIONS_CONNECTION = gql`
  query VenuePromotionsConnection(
    $venueId: ID!
    $filter: PromotionFilterInput
    $pagination: CursorPageInput
    $sort: PromotionSortInput
  ) {
    venuePromotionsConnection(
      venueId: $venueId
      filter: $filter
      pagination: $pagination
      sort: $sort
    ) {
      edges {
        cursor
        node {
          ...PromotionCore
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
`;

export const GET_PROMOTION = gql`
  query GetPromotion($id: ID!) {
    promotion(id: $id) {
      ...PromotionCore
      ...PromotionDetailExtra
    }
  }
  ${PROMOTION_CORE_FRAGMENT}
  ${PROMOTION_DETAIL_EXTRA_FRAGMENT}
`;

export const GET_PROMOTION_STATS = gql`
  query GetPromotionStats($venueId: ID!) {
    promotionStats(venueId: $venueId) {
      total
      active
      pendingApproval
      draft
      paused
      expired
      cancelled
      totalUsage
      totalDiscountGiven
    }
  }
`;

export const VALIDATE_ORDER_PROMO_CODE = gql`
  query ValidateOrderPromoCode($input: ValidateOrderPromoCodeInput!) {
    validateOrderPromoCode(input: $input) {
      isValid
      errorMessage
      estimatedDiscount
      promotion {
        _id
        code
        name
        type
        value
        maxDiscountAmount
      }
    }
  }
`;
