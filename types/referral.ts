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
 * Referral & Growth types for the portal.
 * Mirrors the backend ReferralCode, ReferralTracking entities and DTO types.
 */

// ==================== Enums ====================

export enum ReferralEventEnum {
  SIGNUP = 'SIGNUP',
  FIRST_ORDER = 'FIRST_ORDER',
  REVENUE = 'REVENUE',
}

export type ReferralEventType = `${ReferralEventEnum}`;

// ==================== Entity Types ====================

export interface ReferralCode {
  _id: string;
  code: string;
  ownerId: string;
  ownerName: string;
  ownerRole?: string;
  isActive: boolean;
  maxUses?: number;
  currentUses: number;
  totalSignups: number;
  totalActiveUsers: number;
  totalRevenue: number;
  expiresAt?: string;
  metadata?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReferralTracking {
  _id: string;
  referralCodeId: string;
  referralCode: string;
  referrerId: string;
  refereeId: string;
  event: ReferralEventType;
  orderId?: string;
  amount?: number;
  createdAt: string;
  updatedAt: string;
}

// ==================== Growth Stats ====================

export interface GrowthTrendPoint {
  label: string;
  organic: number;
  partner: number;
}

export interface GrowthStats {
  totalNewUsers: number;
  partnerReferred: number;
  partnerPercentage: number;
  activationRate: number;
  totalRevenue: number;
  trend: GrowthTrendPoint[];
}

// ==================== Partner Leaderboard ====================

export interface PartnerLeaderboardItem {
  partnerId: string;
  partnerName: string;
  avatarUrl?: string;
  role?: string;
  referralCode: string;
  totalSignups: number;
  activationRate: number;
  totalRevenue: number;
  trend: string;
}

export interface PartnerLeaderboard {
  items: PartnerLeaderboardItem[];
  totalCodes: number;
}

// ==================== Filter Input ====================

export interface ReferralFilterInput {
  from?: string;
  to?: string;
  search?: string;
}

// ==================== Mutation Inputs ====================

export interface CreateReferralCodeInput {
  code: string;
  ownerId: string;
  ownerName: string;
  ownerRole?: string;
  maxUses?: number;
  expiresAt?: string;
}

export interface UpdateReferralCodeInput {
  ownerName?: string;
  ownerRole?: string;
  maxUses?: number;
  expiresAt?: string;
}
