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

export const GET_GROWTH_STATS = gql`
  query GetGrowthStats($filter: ReferralFilterInput) {
    getGrowthStats(filter: $filter) {
      totalNewUsers
      partnerReferred
      partnerPercentage
      activationRate
      totalRevenue
      trend {
        label
        organic
        partner
      }
    }
  }
`;

export const GET_PARTNER_LEADERBOARD = gql`
  query GetPartnerLeaderboard($filter: ReferralFilterInput) {
    getPartnerLeaderboard(filter: $filter) {
      items {
        partnerId
        partnerName
        avatarUrl
        role
        referralCode
        totalSignups
        activationRate
        totalRevenue
        trend
      }
      totalCodes
    }
  }
`;

export const GET_REFERRAL_CODES = gql`
  query GetReferralCodes($filter: ReferralFilterInput) {
    getReferralCodes(filter: $filter) {
      _id
      code
      ownerId
      ownerName
      ownerRole
      isActive
      maxUses
      currentUses
      totalSignups
      totalActiveUsers
      totalRevenue
      expiresAt
      createdAt
      updatedAt
    }
  }
`;
