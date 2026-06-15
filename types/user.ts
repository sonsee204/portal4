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

import type { UserRole } from './auth';

/**
 * Full user from the API.
 * Used by getUserProfile, adminGetUsers, and any page that displays user data.
 * Single source of truth -- replaces UserProfileData, UserData, PortalUser.
 */
export interface User {
  _id: string;
  email: string;
  phone?: string;
  fullName: string;
  displayName: string;
  userName: string;
  role: UserRole;
  isOwner?: boolean;
  isActive: boolean;
  isSuspended: boolean;
  photoURL?: string;
  accountOrigin?: string;
  lastLoginAt?: string;
  createdAt: string;
  portalCapabilities?: import('@/lib/permissions/portal-permissions').PortalCapability[];
}
