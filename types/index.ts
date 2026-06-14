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

/**
 * Centralized type exports for the portal.
 *
 * Import from '@/types' for all domain types.
 */

// Auth & roles
export type { UserRole, AuthUser, AuthUserLocation, SessionTokens } from './auth';
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

// QR Campaigns & Analytics
export type {
  QrCampaign,
  QrCampaignStats,
  QrAnalyticsSummary,
  QrScanTrendPoint,
  QrTopCity,
  QrCampaignFilterInput,
  CreateQrCampaignInput,
  UpdateQrCampaignInput,
  RecordQrScanInput,
} from './qr-campaign';
export { QrRedirectTarget } from './qr-campaign';

// Contact Inquiries
export type {
  ContactInquiry,
  ContactInquiryList,
  ContactInquiryStats,
  ContactInquiryFilterInput,
  UpdateInquiryStatusInput,
} from './contact';
export { ContactSubjectEnum, InquiryStatusEnum } from './contact';
