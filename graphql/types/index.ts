/**
 * Manual GraphQL type overrides for the portal.
 *
 * Most types are now auto-generated in graphql/generated.ts (run: npm run codegen).
 * Only keep types here that are NOT in generated.ts or need custom shapes
 * (e.g., aggregated response types the backend returns but codegen doesn't produce).
 */

// Re-export commonly used generated types for convenience
export type {
  PaginationInput,
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
