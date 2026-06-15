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

export const MY_SESSIONS = gql`
  query MySessions {
    mySessions {
      id
      deviceName
      platform
      ipAddress
      loginLocation
      clientSource
      lastUsedAt
      createdAt
      isCurrent
      deviceInfo {
        deviceId
        deviceName
        platform
        osVersion
        appVersion
      }
    }
  }
`;

export const REVOKE_SESSION = gql`
  mutation RevokeSession($sessionId: ID!) {
    revokeSession(sessionId: $sessionId)
  }
`;

export const REVOKE_OTHER_SESSIONS = gql`
  mutation RevokeOtherSessions {
    revokeOtherSessions
  }
`;
