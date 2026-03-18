import { gql } from 'graphql-tag';

export const GET_CLAIM_REQUESTS = gql`
  query GetClaimRequests(
    $filter: ClaimRequestFilterInput
    $pagination: PaginationInput
  ) {
    claimRequests(filter: $filter, pagination: $pagination) {
      requests {
        _id
        venueId
        userId
        venueName
        venueAddress
        phoneNumber
        email
        notes
        proofDocuments
        status
        rejectionReason
        adminNotes
        createdAt
        updatedAt
        reviewedAt
        reviewedById
        user {
          _id
          displayName
          userName
          photoURL
        }
        venue {
          _id
          name
        }
        reviewer {
          _id
          displayName
        }
      }
      total
      page
      limit
      hasMore
    }
  }
`;

export const GET_CLAIM_REQUEST_STATS = gql`
  query GetClaimRequestStats {
    claimRequestStats {
      total
      pending
      approved
      rejected
      cancelled
      thisWeek
      thisMonth
    }
  }
`;
