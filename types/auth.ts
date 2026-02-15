import { UserRole as UserRoleEnum } from '@/graphql/generated';

/**
 * User role string literal union, derived from the generated GraphQL enum.
 * Using template literal type ensures backward compatibility with existing
 * string comparisons (e.g., role === 'ADMIN') while staying in sync with
 * the backend schema.
 */
export type UserRole = `${UserRoleEnum}`;

/**
 * Re-export the enum itself for consumers that want enum members
 * (e.g., UserRoleEnum.Admin instead of 'ADMIN').
 */
export { UserRoleEnum };

/**
 * Authenticated user shape -- subset of the full User entity,
 * returned by the Me query and stored in the auth Zustand store.
 */
export interface AuthUser {
  _id: string;
  email: string;
  fullName: string;
  displayName: string;
  role: UserRole;
  photoURL?: string;
}

/**
 * Token pair stored in HttpOnly cookies (server-side only).
 */
export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}
