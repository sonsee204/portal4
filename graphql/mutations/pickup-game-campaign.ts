import { gql } from '@apollo/client';
import { CAMPAIGN_FRAGMENT } from '../queries/pickup-game-campaign';

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
