/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { gql } from 'graphql-tag';

export const PORTAL_CAPABILITY_GRANTS_CONNECTION = gql`
  query PortalCapabilityGrantsConnection(
    $pagination: CursorPageInput
    $filter: PortalCapabilityGrantFilterInput
  ) {
    portalCapabilityGrantsConnection(pagination: $pagination, filter: $filter) {
      edges {
        node {
          _id
          userId
          userDisplayName
          userRole
          capability
          reason
          enabled
          grantedAt
          revokedAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
      totalCount
    }
  }
`;
