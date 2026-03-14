import { gql } from 'graphql-tag';

export const REVIEW_CLAIM_REQUEST = gql`
  mutation ReviewClaimRequest($input: ReviewClaimRequestInput!) {
    reviewClaimRequest(input: $input) {
      _id
      status
      rejectionReason
      adminNotes
      reviewedAt
      reviewedById
    }
  }
`;
