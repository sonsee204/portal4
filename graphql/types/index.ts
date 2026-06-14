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
 * Manual GraphQL type overrides for the portal.
 *
 * Most types are now auto-generated in graphql/generated.ts (run: npm run codegen).
 * Only keep types here that are NOT in generated.ts or need custom shapes
 * (e.g., aggregated response types the backend returns but codegen doesn't produce).
 */

// Re-export commonly used generated types for convenience
export type {
  CursorPageInput,
  HealthStatus,
  VenueLocation,
  PriceRange,
  VenuePromotionInfo,
} from '../generated';

// Import for local interface usage
import type {
  VenueLocation,
  PriceRange,
  VenuePromotionInfo,
} from '../generated';

/**
 * VenueListItem -- custom aggregated shape returned by searchVenues / getVenues.
 * Not auto-generated because the backend resolver builds it dynamically.
 */
export interface VenueListItem {
  _id: string;
  name: string;
  description?: string;
  sportTypes?: string[];
  coverImageUrl?: string;
  images?: string[];
  averageRating?: number;
  totalReviews?: number;
  isOpen?: boolean;
  location?: VenueLocation;
  priceRange?: PriceRange;
  promotionInfo?: VenuePromotionInfo;
  distanceKm?: number;
}

export interface VenueListResult {
  venues: VenueListItem[];
  total: number;
  hasMore: boolean;
  page: number;
  limit: number;
}

// ==================== PICKUP GAME CAMPAIGN ====================

export interface CampaignGoals {
  targetCheckIns?: number;
  targetUniqueUsers?: number;
  targetFillRate?: number;
}

export interface PickupGameCampaign {
  _id: string;
  name: string;
  description?: string;
  hostId: string;
  venueIds: string[];
  sportTypes: string[];
  targetSkillLevels: string[];
  gameIds: string[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  goals?: CampaignGoals;
  createdAt: string;
  updatedAt: string;
}

export interface CheckInByDate {
  date: string;
  count: number;
}

export interface CheckInByGame {
  gameId: string;
  gameName: string;
  sportType?: string;
  date?: string;
  venueName?: string;
  maxSlots: number;
  checkIns: number;
  fillRate: number;
  qrScanCount: number;
  manualCount: number;
  bulkCount: number;
}

export interface TopCampaignParticipant {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  gamesJoined: number;
  gamesCheckedIn: number;
  attendanceRate: number;
}

export interface CampaignStats {
  totalGames: number;
  totalSlots: number;
  totalCheckIns: number;
  uniqueParticipants: number;
  avgFillRate: number;
  returnRate: number;
  avgCheckInDeltaMinutes?: number;
  qrScanCount: number;
  manualCount: number;
  bulkCount: number;
  checkInsByGame: CheckInByGame[];
  checkInsByDate: CheckInByDate[];
  topParticipants: TopCampaignParticipant[];
}

export interface CreatePickupGameCampaignInput {
  name: string;
  description?: string;
  venueIds?: string[];
  sportTypes?: string[];
  targetSkillLevels?: string[];
  gameIds?: string[];
  startDate?: string;
  endDate?: string;
  goals?: CampaignGoals;
}

export interface UpdatePickupGameCampaignInput
  extends Partial<CreatePickupGameCampaignInput> {
  isActive?: boolean;
}
