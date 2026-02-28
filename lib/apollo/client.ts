'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { Observable } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { ErrorLink } from '@apollo/client/link/error';
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

const link = ApolloLink.from([errorLink, authLink, httpLink]);

export function createApolloClient() {
  return new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: {
        Booking: {
          keyFields: ['_id'],
        },
        Message: {
          keyFields: ['_id'],
        },
        Conversation: {
          keyFields: ['_id'],
        },
        Venue: {
          keyFields: ['_id'],
        },
        Promotion: {
          keyFields: ['_id'],
        },
        User: {
          keyFields: ['_id'],
        },
        Tournament: {
          keyFields: ['_id'],
        },
        TournamentCategory: {
          keyFields: ['_id'],
        },
        TournamentRegistration: {
          keyFields: ['_id'],
        },
        TournamentMatch: {
          keyFields: ['_id'],
        },
        MatchScorecard: {
          keyFields: ['_id'],
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
