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

export const GET_OTP_TEST_USER_GRANTS = gql`
  query GetOtpTestUserGrants(
    $pagination: CursorPageInput
    $filter: OtpTestUserGrantFilterInput
    $sort: CursorSortInput
  ) {
    otpTestUserGrantsConnection(
      pagination: $pagination
      filter: $filter
      sort: $sort
    ) {
      edges {
        cursor
        node {
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
