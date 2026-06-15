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
 * Upload avatar image and update user photoURL.
 */
export const UPLOAD_AVATAR = gql`
  mutation UploadAvatar($input: UploadAvatarInput!) {
    uploadAvatar(input: $input) {
      key
      url
      user {
        _id
        photoURL
      }
    }
  }
`;

/**
 * Update current user profile.
 * Returns the updated User with all profile fields.
 */
export const UPDATE_PROFILE = gql`
  mutation UpdateProfile($input: UpdateProfileInput!) {
    updateProfile(input: $input) {
      _id
      email
      phone
      fullName
      displayName
      userName
      role
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
