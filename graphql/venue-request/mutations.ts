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
