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

/**
 * Current authenticated user (Me).
 * Used for profile edit form and auth store sync.
 */
export const ME_QUERY = gql`
  query Me {
    me {
      _id
      email
      phone
      fullName
      displayName
      userName
      role
      isOwner
      portalCapabilities
      hasVenuePortalAccess
      photoURL
      bio
      club
      gender
      dateOfBirth
      location {
        city
        country
        displayText
        coordinates {
          latitude
          longitude
        }
      }
    }
  }
`;

export const SEARCH_USER_BY_PHONE = gql`
  query SearchUserByPhone($phone: String!) {
    searchUserByPhone(phone: $phone) {
      _id
      fullName
      displayName
      phone
      email
      photoURL
    }
  }
`;

export const GET_USER_PROFILE = gql`
  query GetUserProfile($userId: String!) {
    getUserProfile(userId: $userId) {
      _id
      email
      phone
      fullName
      displayName
      userName
      role
      isOwner
      portalCapabilities
      isActive
      isSuspended
      photoURL
      accountOrigin
      lastLoginAt
      createdAt
    }
  }
`;
