import { gql } from 'graphql-tag';

// ==================== QUERIES ====================

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

export const GET_REFERRAL_CODE_DETAIL = gql`
  query GetReferralCodeDetail($id: ID!) {
    getReferralCodeDetail(id: $id) {
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
      metadata
      createdAt
      updatedAt
    }
  }
`;

// ==================== MUTATIONS ====================

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

export const UPDATE_REFERRAL_CODE = gql`
  mutation UpdateReferralCode($id: ID!, $input: UpdateReferralCodeInput!) {
    updateReferralCode(id: $id, input: $input) {
      _id
      code
      ownerName
      ownerRole
      maxUses
      expiresAt
      updatedAt
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
