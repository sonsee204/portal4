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

export const ADMIN_GET_USERS = gql`
  query AdminGetUsers(
    $role: UserRole
    $isActive: Boolean
    $isSuspended: Boolean
    $searchQuery: String
    $pagination: CursorPageInput
    $sort: CursorSortInput
  ) {
    adminUsersConnection(
      role: $role
      isActive: $isActive
      isSuspended: $isSuspended
      searchQuery: $searchQuery
      pagination: $pagination
      sort: $sort
    ) {
      edges {
        cursor
        node {
          _id
          email
          phone
          fullName
          displayName
          userName
          role
          isOwner
          isActive
          isSuspended
          photoURL
          accountOrigin
          lastLoginAt
          createdAt
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

export const ADMIN_GET_SYSTEM_STATS = gql`
  query AdminGetSystemStats {
    adminGetSystemStats {
      totalUsers
      activeUsers
      suspendedUsers
      totalVenues
      activeVenues
      pendingVenues
      totalBookings
      totalRevenue
    }
  }
`;

export const ADMIN_GET_USER_BOOKINGS = gql`
  query AdminGetUserBookings(
    $userId: ID!
    $statuses: [String!]
    $pagination: CursorPageInput
  ) {
    adminUserBookingsConnection(
      userId: $userId
      statuses: $statuses
      pagination: $pagination
    ) {
      edges {
        cursor
        node {
          _id
          venueName
          venueAddress
          date
          timeSlots
          status
          totalPrice
          courtName
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;
