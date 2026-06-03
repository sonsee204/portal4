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

import { gql } from '@apollo/client';

export const CAMPAIGN_FRAGMENT = gql`
  fragment CampaignFields on PickupGameCampaign {
    _id
    name
    description
    hostId
    venueIds
    sportTypes
    targetSkillLevels
    gameIds
    startDate
    endDate
    isActive
    goals {
      targetCheckIns
      targetUniqueUsers
      targetFillRate
    }
    createdAt
    updatedAt
  }
`;

export const GET_MY_CAMPAIGNS = gql`
  query MyCampaigns($isActive: Boolean) {
    myCampaigns(isActive: $isActive) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const GET_CAMPAIGN = gql`
  query PickupGameCampaign($campaignId: ID!) {
    pickupGameCampaign(campaignId: $campaignId) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const GET_CAMPAIGN_STATS = gql`
  query CampaignStats($campaignId: ID!) {
    campaignStats(campaignId: $campaignId) {
      totalGames
      totalSlots
      totalCheckIns
      uniqueParticipants
      avgFillRate
      returnRate
      avgCheckInDeltaMinutes
      qrScanCount
      manualCount
      bulkCount
      checkInsByGame {
        gameId
        gameName
        sportType
        date
        venueName
        maxSlots
        checkIns
        fillRate
        qrScanCount
        manualCount
        bulkCount
      }
      checkInsByDate {
        date
        count
      }
      topParticipants {
        userId
        displayName
        avatarUrl
        gamesJoined
        gamesCheckedIn
        attendanceRate
      }
    }
  }
`;
