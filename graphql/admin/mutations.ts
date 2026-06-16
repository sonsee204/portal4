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

export const ADMIN_PROVISION_PLAYER = gql`
  mutation AdminProvisionPlayer($input: AdminProvisionPlayerInput!) {
    adminProvisionPlayer(input: $input) {
      user {
        _id
        fullName
        phone
        email
        userName
        role
        accountOrigin
        createdBy
        phoneVerified
        createdAt
      }
      generatedPassword
      loginInstructions
    }
  }
`;

export const ADMIN_RESET_USER_PASSWORD = gql`
  mutation AdminResetUserPassword($input: AdminResetUserPasswordInput!) {
    adminResetUserPassword(input: $input) {
      success
      generatedPassword
      message
    }
  }
`;

export const ADMIN_CHANGE_USER_ROLE = gql`
  mutation AdminChangeUserRole($userId: ID!, $role: UserRole!) {
    adminChangeUserRole(userId: $userId, role: $role) {
      _id
      role
      fullName
      email
      phone
      isOwner
    }
  }
`;
