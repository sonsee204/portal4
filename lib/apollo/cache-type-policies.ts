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

import type { TypePolicies } from '@apollo/client';

/**
 * Generic merge for legacy offset-paginated queries that return a payload of
 * the shape `{ items: TItem[], total, ... }`. Mirrors the `makeOffsetMerge`
 * helper in mobile so cache behaviour stays in lock-step across clients.
 */
function makeOffsetMerge<TItem extends { __ref?: string }>(itemsKey: string) {
  return function merge(
    existing: { [k: string]: unknown } | undefined,
    incoming: { [k: string]: unknown },
  ) {
    if (!existing) return incoming;
    const existingItems = (existing[itemsKey] ?? []) as TItem[];
    const incomingItems = (incoming[itemsKey] ?? []) as TItem[];

    const seen = new Set(
      existingItems.map((item) => item.__ref).filter(Boolean) as string[],
    );
    const merged = [
      ...existingItems,
      ...incomingItems.filter(
        (item) => !!item.__ref && !seen.has(item.__ref!),
      ),
    ];

    return { ...incoming, [itemsKey]: merged };
  };
}

interface ConnectionEdge {
  readonly cursor?: string;
  readonly node?: { __ref?: string };
}

interface ConnectionShape {
  readonly edges?: ConnectionEdge[];
  readonly pageInfo?: unknown;
  readonly [k: string]: unknown;
}

/**
 * Relay-style merge for cursor connections. Tracks cursors and node refs
 * separately so sort changes (new cursors, same Booking ref) never duplicate rows.
 */
function relayMergeFn(
  existing: ConnectionShape | undefined,
  incoming: ConnectionShape,
): ConnectionShape {
  if (!existing) return incoming;
  const existingEdges = existing.edges ?? [];
  const incomingEdges = incoming.edges ?? [];

  const seenCursors = new Set<string>();
  const seenRefs = new Set<string>();
  for (const edge of existingEdges) {
    if (edge.cursor) seenCursors.add(edge.cursor);
    if (edge.node?.__ref) seenRefs.add(edge.node.__ref);
  }

  const merged = [...existingEdges];
  for (const edge of incomingEdges) {
    const cursor = edge.cursor;
    const ref = edge.node?.__ref;
    if (cursor && seenCursors.has(cursor)) continue;
    if (ref && seenRefs.has(ref)) continue;
    merged.push(edge);
    if (cursor) seenCursors.add(cursor);
    if (ref) seenRefs.add(ref);
  }

  return {
    ...incoming,
    edges: merged,
  };
}

export const apolloTypePolicies: TypePolicies = {
  // ── Normalisation parity with mobile (apollo.config.ts) ──────────
  // Backend uses `_id` as the canonical identifier on every entity.
  User: { keyFields: ['_id'] },
  Post: { keyFields: ['_id'] },
  PostComment: { keyFields: ['_id'] },
  PostBookmark: { keyFields: ['_id'] },
  Booking: { keyFields: ['_id'] },
  Message: { keyFields: ['_id'] },
  Conversation: { keyFields: ['_id'] },
  Venue: { keyFields: ['_id'] },
  Court: { keyFields: ['_id'] },
  Order: { keyFields: ['_id'] },
  Product: { keyFields: ['_id'] },
  Promotion: { keyFields: ['_id'] },
  PickupGame: { keyFields: ['_id'] },
  Notification: { keyFields: ['_id'] },
  Group: { keyFields: ['_id'] },
  GroupMember: { keyFields: ['_id'] },
  GroupInvite: { keyFields: ['_id'] },
  PickupGameParticipant: { keyFields: ['_id'] },
  PickupGameTemplate: { keyFields: ['_id'] },
  GameInvite: { keyFields: ['_id'] },
  Pass: { keyFields: ['_id'] },
  StaffInvitation: { keyFields: ['_id'] },
  Sport: { keyFields: ['_id'] },
  LegalDocument: { keyFields: ['_id'] },
  Tournament: { keyFields: ['_id'] },
  TournamentCategory: { keyFields: ['_id'] },
  TournamentRegistration: { keyFields: ['_id'] },
  TournamentMatch: { keyFields: ['_id'] },
  MatchScorecard: { keyFields: ['_id'] },

  // ── Embedded sub-objects (no _id) ───────────────────────────────
  VenueLocation: { keyFields: false },
  VenueAmenity: { keyFields: false },
  PriceRange: { keyFields: false },
  OperatingHours: { keyFields: false },
  GeoPoint: { keyFields: false },
  VenueOrderTypeConfig: { keyFields: false },
  VenueMarginThresholds: { keyFields: false },
  Reaction: { keyFields: false },
  ReadReceipt: { keyFields: false },
  BookingSlot: { keyFields: false },
  OrderItem: { keyFields: false },
  RecurringConfig: { keyFields: false },
  GameLocation: { keyFields: false },
  GameSlot: { keyFields: false },
  NotificationData: { keyFields: false },
  PromotionRule: { keyFields: false },
  PriceCalculation: { keyFields: false },

  // ── Pagination parity ────────────────────────────────────────────
  Query: {
    fields: {
      // Posts
      getPosts: { keyArgs: ['filter'], merge: makeOffsetMerge('posts') },
      getUserPosts: {
        keyArgs: ['userId'],
        merge: makeOffsetMerge('posts'),
      },
      getMyPosts: { keyArgs: false, merge: makeOffsetMerge('posts') },
      getPostComments: {
        keyArgs: ['postId'],
        merge: makeOffsetMerge('comments'),
      },
      getCommentReplies: {
        keyArgs: ['postId', 'commentId'],
        merge: makeOffsetMerge('comments'),
      },
      getPostLikers: {
        keyArgs: ['postId'],
        merge: makeOffsetMerge('users'),
      },

      // Bookings
      myBookings: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('bookings'),
      },
      venueBookings: {
        keyArgs: ['venueId', 'filter'],
        merge: makeOffsetMerge('bookings'),
      },
      myHoldBookings: {
        keyArgs: false,
        merge: makeOffsetMerge('bookings'),
      },
      myRecurringBookings: {
        keyArgs: false,
        merge: makeOffsetMerge('bookings'),
      },

      // Venues
      nearbyVenues: {
        keyArgs: ['latitude', 'longitude', 'radiusKm', 'filter'],
        merge: makeOffsetMerge('venues'),
      },
      myVenues: { keyArgs: false, merge: makeOffsetMerge('venues') },
      staffedVenues: {
        keyArgs: false,
        merge: makeOffsetMerge('venues'),
      },
      favoriteVenues: {
        keyArgs: false,
        merge: makeOffsetMerge('venues'),
      },

      // Pickup games
      pickupGames: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('games'),
      },
      myHostedGames: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('games'),
      },
      myJoinedGames: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('games'),
      },

      // Notifications
      getNotifications: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('notifications'),
      },

      // Orders
      myOrders: {
        keyArgs: ['filter'],
        merge: makeOffsetMerge('orders'),
      },
      venueOrders: {
        keyArgs: ['venueId', 'filter'],
        merge: makeOffsetMerge('orders'),
      },

      // Products / Promotions
      venueProducts: {
        keyArgs: ['venueId', 'filter'],
        merge: makeOffsetMerge('products'),
      },
      venuePromotions: {
        keyArgs: ['venueId', 'filter'],
        merge: makeOffsetMerge('promotions'),
      },

      // ── Cursor connections (Relay-style)
      postsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      myBookingsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      venueBookingsConnection: {
        keyArgs: ['venueId', 'filter', 'sort'],
        merge: relayMergeFn,
      },
      pickupGamesConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      notificationsConnection: {
        keyArgs: ['filter'],
        merge: relayMergeFn,
      },
      nearbyVenuesConnection: {
        keyArgs: ['latitude', 'longitude', 'radiusKm', 'filter'],
        merge: relayMergeFn,
      },
      auditLogsConnection: { keyArgs: ['filter', 'sort'], merge: relayMergeFn },
      contactInquiriesConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      adminUsersConnection: {
        keyArgs: ['role', 'isActive', 'isSuspended', 'searchQuery', 'sort'],
        merge: relayMergeFn,
      },
      adminAllBookingsConnection: {
        keyArgs: ['statuses', 'fromDate', 'toDate'],
        merge: relayMergeFn,
      },
      adminUserBookingsConnection: {
        keyArgs: ['userId', 'statuses'],
        merge: relayMergeFn,
      },
      getPostReportsForAdminConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
      getUserReportsForAdminConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
      messageReportsConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
      claimRequestsConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
      allVenueRequestsConnection: {
        keyArgs: ['status', 'sort'],
        merge: relayMergeFn,
      },
      qrCampaignsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      myTournamentsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
      tournamentRegistrationsConnection: {
        keyArgs: ['tournamentId', 'filter'],
        merge: relayMergeFn,
      },
      tournamentMatchesConnection: {
        keyArgs: ['tournamentId', 'filter'],
        merge: relayMergeFn,
      },
      otpTestPhonesConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
      otpTestUserGrantsConnection: {
        keyArgs: ['filter', 'sort'],
        merge: relayMergeFn,
      },
    },
  },
};
