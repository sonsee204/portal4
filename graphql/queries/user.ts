import { gql } from 'graphql-tag';

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
