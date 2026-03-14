import { gql } from 'graphql-tag';

export const APPROVE_VENUE_REQUEST = gql`
  mutation ApproveVenueRequest($requestId: ID!, $adminNote: String) {
    approveVenueRequest(requestId: $requestId, adminNote: $adminNote) {
      _id
      status
      reviewedAt
      reviewedBy
      adminNote
    }
  }
`;

export const REJECT_VENUE_REQUEST = gql`
  mutation RejectVenueRequest($requestId: ID!, $rejectionReason: String!) {
    rejectVenueRequest(
      requestId: $requestId
      rejectionReason: $rejectionReason
    ) {
      _id
      status
      rejectionReason
      reviewedAt
      reviewedBy
    }
  }
`;
