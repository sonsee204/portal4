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

// ==================== QUERIES ====================

export const GET_QR_CAMPAIGNS = gql`
  query GetQrCampaigns($filter: QrCampaignFilterInput, $pagination: PaginationInput) {
    getQrCampaigns(filter: $filter, pagination: $pagination) {
      _id
      slug
      name
      description
      location
      isActive
      totalScans
      uniqueDevices
      iosScans
      androidScans
      unknownScans
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_QR_CAMPAIGN = gql`
  query GetQrCampaign($id: ID!) {
    getQrCampaign(id: $id) {
      _id
      slug
      name
      description
      location
      isActive
      totalScans
      uniqueDevices
      iosScans
      androidScans
      unknownScans
      expiresAt
      createdAt
      updatedAt
    }
  }
`;

export const GET_QR_CAMPAIGN_STATS = gql`
  query GetQrCampaignStats($id: ID!, $filter: QrCampaignFilterInput) {
    getQrCampaignStats(id: $id, filter: $filter) {
      totalScans
      uniqueDevices
      iosScans
      androidScans
      unknownScans
      iosPercentage
      androidPercentage
      trend {
        label
        total
        ios
        android
      }
      topCities {
        city
        country
        scans
      }
    }
  }
`;

export const GET_QR_ANALYTICS_SUMMARY = gql`
  query GetQrAnalyticsSummary($filter: QrCampaignFilterInput) {
    getQrAnalyticsSummary(filter: $filter) {
      totalScans
      activeCampaigns
      uniqueDevices
      iosPercentage
      androidPercentage
      trend {
        label
        total
        ios
        android
      }
    }
  }
`;

export const GENERATE_QR_CODE = gql`
  query GenerateQrCode($campaignId: ID!) {
    generateQrCode(campaignId: $campaignId)
  }
`;
