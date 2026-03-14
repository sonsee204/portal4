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

export const ADMIN_GET_ALL_BOOKINGS = gql`
  query AdminGetAllBookings(
    $statuses: [String!]
    $fromDate: String
    $toDate: String
    $pagination: PaginationInput
  ) {
    adminGetAllBookings(
      statuses: $statuses
      fromDate: $fromDate
      toDate: $toDate
      pagination: $pagination
    ) {
      bookings {
        _id
        venueName
        venueAddress
        date
        timeSlots
        status
        totalPrice
        courtName
      }
      customerNamesJson
      total
      page
      limit
      hasMore
    }
  }
`;

export const ADMIN_GET_USER_BOOKINGS = gql`
  query AdminGetUserBookings(
    $userId: ID!
    $statuses: [String!]
    $pagination: PaginationInput
  ) {
    adminGetUserBookings(
      userId: $userId
      statuses: $statuses
      pagination: $pagination
    ) {
      bookings {
        _id
        venueName
        venueAddress
        date
        timeSlots
        status
        totalPrice
        courtName
      }
      total
      page
      limit
      hasMore
    }
  }
`;
