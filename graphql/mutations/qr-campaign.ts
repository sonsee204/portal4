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
