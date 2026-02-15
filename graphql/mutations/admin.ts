import { gql } from 'graphql-tag';

export const ADMIN_CREATE_USER = gql`
  mutation AdminCreateUser($input: AdminCreateUserInput!) {
    adminCreateUser(input: $input) {
      _id
      email
      phone
      fullName
      displayName
      userName
      role
      isActive
      accountOrigin
      createdAt
    }
  }
`;

export const ADMIN_SUSPEND_USER = gql`
  mutation AdminSuspendUser($userId: ID!, $reason: String) {
    adminSuspendUser(userId: $userId, reason: $reason) {
      _id
      isActive
      isSuspended
      suspendedAt
      suspensionReason
    }
  }
`;

export const ADMIN_UNSUSPEND_USER = gql`
  mutation AdminUnsuspendUser($userId: ID!) {
    adminUnsuspendUser(userId: $userId) {
      _id
      isActive
      isSuspended
    }
  }
`;

export const ADMIN_CHANGE_USER_ROLE = gql`
  mutation AdminChangeUserRole($userId: ID!, $role: UserRole!) {
    adminChangeUserRole(userId: $userId, role: $role) {
      _id
      role
    }
  }
`;
