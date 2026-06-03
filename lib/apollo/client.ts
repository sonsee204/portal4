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

'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
  split,
} from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
import { getMainDefinition } from '@apollo/client/utilities';
import { Observable } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
import { createClient } from 'graphql-ws';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { formatGraphQLError } from '@/lib/errors/format-graphql-error';
import { showError } from '@/lib/toast';
import { ERRORS } from '@/lib/strings';

const getGraphqlUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_GRAPHQL_URL;
  if (url) return url;
  if (typeof window === 'undefined') {
    return process.env.NODE_ENV === 'development'
      ? 'http://localhost:4000/graphql'
      : '/graphql';
  }
  return '/graphql';
};

const getGraphqlWsUrl = (): string => {
  const explicit = process.env.NEXT_PUBLIC_GRAPHQL_WS_URL;
  if (explicit) return explicit;

  const httpUrl = getGraphqlUrl();
  if (httpUrl.startsWith('http://') || httpUrl.startsWith('https://')) {
    return httpUrl.replace(/^http/, 'ws');
  }
  // Relative /graphql - derive from current origin (client-side only)
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${httpUrl}`;
  }
  return 'ws://localhost:4000/graphql';
};

/**
 * Token storage for client-side Apollo Client.
 * The token is injected from a server component via the AuthProvider.
 */
let _accessToken: string | null = null;

export function setClientAccessToken(token: string | null) {
  _accessToken = token;
}

export function getClientAccessToken(): string | null {
  return _accessToken;
}

const httpLink = new HttpLink({
  uri: getGraphqlUrl(),
  credentials: 'include', // Send cookies with requests
  fetchOptions: {
    next: { revalidate: 0 },
  },
});

/**
 * Auth link: inject access token and client source header
 */
const authLink = setContext((_, { headers }) => {
  const token = _accessToken;

  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true',
      'x-client-source': 'portal',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

/**
 * Error link: handle 401 errors by refreshing token.
 * Apollo Client v4 uses { error, operation, forward } instead of
 * { graphQLErrors, networkError }.
 */
const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const hasAuthError = error.errors.some(
      (err) =>
        err.extensions?.code === 'UNAUTHENTICATED' ||
        err.message.includes('Unauthorized') ||
        err.message.includes('Token'),
    );

    if (hasAuthError) {
      // Attempt token refresh via API route
      return new Observable((observer) => {
        fetch('/api/auth/refresh', { method: 'POST', credentials: 'include' })
          .then((res) => res.json() as Promise<{ accessToken?: string }>)
          .then((data) => {
            if (data.accessToken) {
              _accessToken = data.accessToken;

              // Retry the failed operation with new token
              const oldHeaders = operation.getContext().headers as Record<
                string,
                string
              >;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${data.accessToken}`,
                },
              });

              forward(operation).subscribe(observer);
            } else {
              // Refresh failed -- clear client state and redirect to login
              _accessToken = null;
              if (client) {
                void client.clearStore();
              }
              if (typeof window !== 'undefined') {
                window.location.href = '/login';
              }
              observer.error(error);
            }
          })
          .catch(() => {
            _accessToken = null;
            if (client) {
              void client.clearStore();
            }
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
            observer.error(error);
          });
      });
    }

    const nonAuthErrors = error.errors.filter(
      (err) => err.extensions?.code !== 'UNAUTHENTICATED',
    );
    if (nonAuthErrors.length > 0) {
      showError(formatGraphQLError(error));
    }
  } else {
    // Network or other error
    console.error('[Network error]:', error);
    if (typeof window !== 'undefined') {
      showError(ERRORS.NETWORK);
    }
  }
});

function createWsLink(): GraphQLWsLink {
  return new GraphQLWsLink(
    createClient({
      url: getGraphqlWsUrl(),
      connectionParams: () => ({
        authorization: _accessToken ? `Bearer ${_accessToken}` : '',
        'x-client-source': 'portal',
      }),
    }),
  );
}

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
 * Relay-style merge for cursor connections. Edges are deduplicated by
 * `cursor` (or `node.__ref` as fallback) so refetch + paginate combinations
 * never produce duplicate rows.
 */
function relayMergeFn(
  existing: ConnectionShape | undefined,
  incoming: ConnectionShape,
): ConnectionShape {
  if (!existing) return incoming;
  const existingEdges = existing.edges ?? [];
  const incomingEdges = incoming.edges ?? [];

  const seen = new Set<string>();
  for (const edge of existingEdges) {
    const key = edge.cursor ?? edge.node?.__ref;
    if (key) seen.add(key);
  }
  const merged = [
    ...existingEdges,
    ...incomingEdges.filter((edge) => {
      const key = edge.cursor ?? edge.node?.__ref;
      return key ? !seen.has(key) : true;
    }),
  ];

  return {
    ...incoming,
    edges: merged,
  };
}

export function createApolloClient() {
  const httpChain = ApolloLink.from([errorLink, authLink, httpLink]);

  const link =
    typeof window === 'undefined'
      ? httpChain
      : split(
        ({ query }) => {
          const def = getMainDefinition(query);
          return (
            def.kind === 'OperationDefinition' &&
            def.operation === 'subscription'
          );
        },
        createWsLink(),
        httpChain,
      );

  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
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
        OrderItem: { keyFields: ['_id'] },
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

            // ── Cursor connections (Relay-style) — admin pages adopt these
            // first because they show very long lists. Older offset queries
            // remain registered above so callers can migrate gradually.
            postsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
            myBookingsConnection: { keyArgs: ['filter'], merge: relayMergeFn },
            venueBookingsConnection: {
              keyArgs: ['venueId', 'filter'],
              merge: relayMergeFn,
            },
            pickupGamesConnection: { keyArgs: ['filter'], merge: relayMergeFn },
            getNotificationsConnection: {
              keyArgs: ['filter'],
              merge: relayMergeFn,
            },
            nearbyVenuesConnection: {
              keyArgs: ['latitude', 'longitude', 'radiusKm', 'filter'],
              merge: relayMergeFn,
            },
          },
        },
      },
    }),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'cache-and-network',
        errorPolicy: 'all',
      },
      query: {
        fetchPolicy: 'network-only',
        errorPolicy: 'all',
      },
      mutate: {
        errorPolicy: 'all',
      },
    },
  });
}

let client: ReturnType<typeof createApolloClient> | null = null;

export function getApolloClient() {
  if (typeof window === 'undefined') {
    return createApolloClient();
  }
  if (!client) {
    client = createApolloClient();
  }
  return client;
}
