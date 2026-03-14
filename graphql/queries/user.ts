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
      isActive
      isSuspended
      photoURL
      accountOrigin
      lastLoginAt
      createdAt
    }
  }
`;
