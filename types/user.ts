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
  isActive: boolean;
  isSuspended: boolean;
  photoURL?: string;
  accountOrigin?: string;
  lastLoginAt?: string;
  createdAt: string;
}
