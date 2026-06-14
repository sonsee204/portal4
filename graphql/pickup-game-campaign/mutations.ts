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
import { CAMPAIGN_FRAGMENT } from '@/graphql/pickup-game-campaign/fragments';

export const CREATE_PICKUP_GAME_CAMPAIGN = gql`
  mutation CreatePickupGameCampaign($input: CreatePickupGameCampaignInput!) {
    createPickupGameCampaign(input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const UPDATE_PICKUP_GAME_CAMPAIGN = gql`
  mutation UpdatePickupGameCampaign(
    $campaignId: ID!
    $input: UpdatePickupGameCampaignInput!
  ) {
    updatePickupGameCampaign(campaignId: $campaignId, input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const ADD_GAMES_TO_CAMPAIGN = gql`
  mutation AddGamesToCampaign($input: AddGamesToCampaignInput!) {
    addGamesToCampaign(input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;

export const REMOVE_GAMES_FROM_CAMPAIGN = gql`
  mutation RemoveGamesFromCampaign($input: RemoveGamesFromCampaignInput!) {
    removeGamesFromCampaign(input: $input) {
      ...CampaignFields
    }
  }
  ${CAMPAIGN_FRAGMENT}
`;
