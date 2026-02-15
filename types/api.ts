import type { User } from './user';

/**
 * Generic paginated result wrapper.
 */
export interface PaginatedResult<T> {
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
  items: T[];
}

/**
 * Response shape for the adminGetUsers query.
 */
export interface AdminGetUsersResponse {
  adminGetUsers: {
    users: User[];
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

/**
 * Response shape for the getUserProfile query.
 */
export interface GetUserProfileResponse {
  getUserProfile: User;
}
