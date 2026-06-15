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

export const CREATE_REFERRAL_CODE = gql`
  mutation CreateReferralCode($input: CreateReferralCodeInput!) {
    createReferralCode(input: $input) {
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
    }
  }
`;

export const TOGGLE_REFERRAL_CODE = gql`
  mutation ToggleReferralCode($id: ID!, $isActive: Boolean!) {
    toggleReferralCode(id: $id, isActive: $isActive) {
      _id
      code
      isActive
      updatedAt
    }
  }
`;
