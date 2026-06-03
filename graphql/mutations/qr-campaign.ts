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

// ==================== MUTATIONS ====================

export const CREATE_QR_CAMPAIGN = gql`
  mutation CreateQrCampaign($input: CreateQrCampaignInput!) {
    createQrCampaign(input: $input) {
      _id
      slug
      name
      description
      location
      isActive
      totalScans
      expiresAt
      createdAt
    }
  }
`;

export const UPDATE_QR_CAMPAIGN = gql`
  mutation UpdateQrCampaign($id: ID!, $input: UpdateQrCampaignInput!) {
    updateQrCampaign(id: $id, input: $input) {
      _id
      slug
      name
      description
      location
      isActive
      expiresAt
      updatedAt
    }
  }
`;

export const TOGGLE_QR_CAMPAIGN = gql`
  mutation ToggleQrCampaign($id: ID!, $isActive: Boolean!) {
    toggleQrCampaign(id: $id, isActive: $isActive) {
      _id
      isActive
      updatedAt
    }
  }
`;
