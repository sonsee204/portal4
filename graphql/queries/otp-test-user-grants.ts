import { gql } from 'graphql-tag';

export const GET_OTP_TEST_USER_GRANTS = gql`
  query GetOtpTestUserGrants(
    $pagination: PaginationInput
    $filter: OtpTestUserGrantFilterInput
  ) {
    otpTestUserGrants(pagination: $pagination, filter: $filter) {
      items {
        _id
        userId
        userDisplayName
        userRole
        phone
        testCode
        reason
        enabled
        allowedPurposes
        expiresAt
        createdAt
        updatedAt
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export const CREATE_OTP_TEST_USER_GRANT = gql`
  mutation CreateOtpTestUserGrant($input: CreateOtpTestUserGrantInput!) {
    createOtpTestUserGrant(input: $input) {
      _id
      userId
      userDisplayName
      userRole
      phone
      testCode
      reason
      enabled
      allowedPurposes
      expiresAt
      createdAt
    }
  }
`;

export const REVOKE_OTP_TEST_USER_GRANT = gql`
  mutation RevokeOtpTestUserGrant($id: ID!) {
    revokeOtpTestUserGrant(id: $id) {
      _id
      enabled
      revokedAt
      updatedAt
    }
  }
`;
