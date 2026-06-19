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

export const PROMOTION_CORE_FRAGMENT = gql`
  fragment PromotionCore on Promotion {
    _id
    venueId
    name
    description
    type
    value
    maxDiscountAmount
    scope
    courtIds
    sportTypes
    category
    trigger
    code
    startDate
    endDate
    status
    priority
    minBookingAmount
    applyLevel
    applicableTimeRanges {
      startTime
      endTime
    }
    isStackable
    showOnVenueCard
    showAsBanner
    badgeText
    badgeColor
    bannerImageUrl
    usageCount
    totalUsageLimit
    perUserLimit
    createdAt
    updatedAt
  }
`;

const PROMOTION_USER_BRIEF_FRAGMENT = gql`
  fragment PromotionUserBrief on User {
    _id
    fullName
    displayName
    userName
  }
`;

export const PROMOTION_DETAIL_EXTRA_FRAGMENT = gql`
  fragment PromotionDetailExtra on Promotion {
    shortDescription
    productCategoryIds
    displayOrder
    createdBy
    createdByUser {
      ...PromotionUserBrief
    }
    reviewedBy
    reviewedByUser {
      ...PromotionUserBrief
    }
    reviewedAt
    rejectionReason
    stackingRules {
      canStack
      maxStackDiscountPercent
      maxStackDiscountAmount
      stackableWithIds
      stackableWithCategories
    }
    isWithinDateRange
    isUsageLimitReached
    remainingUsage
  }
  ${PROMOTION_USER_BRIEF_FRAGMENT}
`;
