/**
 * Shared GraphQL types for portal.
 * For full generated types, run: pnpm run codegen
 */

export interface PaginationInput {
  page?: number;
  limit?: number;
}

export interface VenueLocation {
  address?: string;
  ward?: string;
  district?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
}

export interface PriceRange {
  minPrice?: number;
  maxPrice?: number;
  currency?: string;
}

export interface VenuePromotionInfo {
  hasActivePromotions: boolean;
  activePromotionCount: number;
  bestDiscountPercent?: number;
  bestDiscountAmount?: number;
  featuredBadge?: { text: string; color: string };
  promotionText?: string;
}

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

export interface HealthStatus {
  status: string;
  database: string;
  timestamp: string;
  uptime?: number;
}
