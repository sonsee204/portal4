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
