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

/** Location shape for user profile */
export interface AuthUserLocation {
  city?: string;
  country?: string;
  displayText?: string;
  coordinates?: { latitude: number; longitude: number };
}

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
  phone?: string;
  userName?: string;
  bio?: string;
  club?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  dateOfBirth?: string | null;
  location?: AuthUserLocation | null;
  portalCapabilities?: import('@/lib/permissions/portal-permissions').PortalCapability[];
}

/**
 * Token pair stored in HttpOnly cookies (server-side only).
 */
export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}
