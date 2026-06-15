/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { gql } from 'graphql-tag';

export const GRANT_PORTAL_CAPABILITY = gql`
  mutation GrantPortalCapability($input: GrantPortalCapabilityInput!) {
    grantPortalCapability(input: $input) {
      _id
      userId
      capability
      reason
      enabled
      grantedAt
    }
  }
`;

export const REVOKE_PORTAL_CAPABILITY = gql`
  mutation RevokePortalCapability($id: ID!) {
    revokePortalCapability(id: $id) {
      _id
      enabled
      revokedAt
    }
  }
`;
