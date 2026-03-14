import { gql } from 'graphql-tag';

export const GET_ALL_VENUE_REQUESTS = gql`
  query GetAllVenueRequests(
    $status: VenueRequestStatus
    $pagination: PaginationInput
  ) {
    allVenueRequests(status: $status, pagination: $pagination) {
      requests {
        _id
        requesterId
        name
        description
        sportTypes
        status
        phoneNumber
        email
        coverImageUrl
        images
        rejectionReason
        adminNote
        createdAt
        updatedAt
        reviewedAt
        reviewedBy
        location {
          address
          city
          district
          ward
          latitude
          longitude
        }
        courts {
          name
          sportType
          pricePerHour
          peakPricePerHour
          isIndoor
        }
        requester {
          _id
          displayName
          userName
          photoURL
        }
        reviewedByAdmin {
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

export const GET_VENUE_REQUEST_STATS = gql`
  query GetVenueRequestStats {
    venueRequestStats {
      totalRequests
      pendingRequests
      approvedRequests
      rejectedRequests
    }
  }
`;
