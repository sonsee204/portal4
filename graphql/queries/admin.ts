import { gql } from 'graphql-tag';

export const ADMIN_GET_USERS = gql`
  query AdminGetUsers(
    $role: UserRole
    $isActive: Boolean
    $isSuspended: Boolean
    $searchQuery: String
    $pagination: PaginationInput
  ) {
    adminGetUsers(
      role: $role
      isActive: $isActive
      isSuspended: $isSuspended
      searchQuery: $searchQuery
      pagination: $pagination
    ) {
      users {
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
      total
      page
      limit
      hasMore
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
