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

export const GET_CLAIM_REQUESTS = gql`
  query GetClaimRequests(
    $filter: ClaimRequestFilterInput
    $pagination: CursorPageInput
  ) {
    claimRequestsConnection(filter: $filter, pagination: $pagination) {
      edges {
        cursor
        node {
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
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
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
