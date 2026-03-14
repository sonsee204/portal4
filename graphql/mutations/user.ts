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
