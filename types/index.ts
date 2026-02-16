/**
 * Centralized type exports for the portal.
 *
 * Import from '@/types' for all domain types.
 * Import from '@/types/mock' only for mock-data consumers.
 */

// Auth & roles
export type { UserRole, AuthUser, SessionTokens } from './auth';
export { UserRoleEnum } from './auth';

// User domain
export type { User } from './user';

// API response shapes
export type {
  AdminGetUsersResponse,
  GetUserProfileResponse,
  PaginatedResult,
} from './api';

// Audit logs
export type {
  AuditLog,
  AuditLogList,
  AuditStats,
  AuditCategoryCount,
  AuditFilterInput,
  AuditAction,
  AuditCategory,
  AuditStatus,
} from './audit';
export { AuditActionEnum, AuditCategoryEnum, AuditStatusEnum } from './audit';

// Referral & Growth
export type {
  ReferralCode,
  ReferralTracking,
  ReferralEventType,
  GrowthStats,
  GrowthTrendPoint,
  PartnerLeaderboardItem,
  PartnerLeaderboard,
  ReferralFilterInput,
  CreateReferralCodeInput,
  UpdateReferralCodeInput,
} from './referral';
export { ReferralEventEnum } from './referral';
