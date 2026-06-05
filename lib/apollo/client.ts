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
import { createClient, type Client } from 'graphql-ws';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import {
  isUnauthenticatedGraphQLError,
  refreshViaApiRoute,
} from '@/lib/auth/session-core';
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
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${protocol}//${window.location.host}${httpUrl}`;
  }
  return 'ws://localhost:4000/graphql';
};

let _accessToken: string | null = null;
let wsClientInstance: Client | null = null;

export function setClientAccessToken(token: string | null) {
  _accessToken = token;
}

export function getClientAccessToken(): string | null {
  return _accessToken;
}

export function reconnectWebSocket(): void {
  if (wsClientInstance) {
    wsClientInstance.dispose();
    wsClientInstance = null;
  }
}

function redirectToLogin(): void {
  if (typeof window === 'undefined') return;
  const redirect = encodeURIComponent(
    `${window.location.pathname}${window.location.search}`,
  );
  window.location.href = `/login?redirect=${redirect}`;
}

const httpLink = new HttpLink({
  uri: getGraphqlUrl(),
  credentials: 'include',
  fetchOptions: {
    next: { revalidate: 0 },
  },
});

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

const errorLink = new ErrorLink(({ error, operation, forward }) => {
  if (CombinedGraphQLErrors.is(error)) {
    const hasAuthError = error.errors.some((err) =>
      isUnauthenticatedGraphQLError(
        err.extensions?.code as string | undefined,
        err.message,
      ),
    );

    if (hasAuthError) {
      return new Observable((observer) => {
        void refreshViaApiRoute().then((result) => {
          if (result.status === 'success') {
            _accessToken = result.accessToken;
            reconnectWebSocket();

            const oldHeaders = operation.getContext().headers as Record<
              string,
              string
            >;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${result.accessToken}`,
              },
            });

            forward(operation).subscribe(observer);
            return;
          }

          if (result.status === 'auth_failed') {
            _accessToken = null;
            if (client) {
              void client.clearStore();
            }
            redirectToLogin();
            observer.error(error);
            return;
          }

          showError(ERRORS.NETWORK);
          observer.error(error);
        });
      });
    }

    const nonAuthErrors = error.errors.filter(
      (err) =>
        !isUnauthenticatedGraphQLError(
          err.extensions?.code as string | undefined,
          err.message,
        ),
    );
    if (nonAuthErrors.length > 0) {
      showError(formatGraphQLError(error));
    }
  } else {
    console.error('[Network error]:', error);
    if (typeof window !== 'undefined') {
      showError(ERRORS.NETWORK);
    }
  }
});

function createWsLink(): GraphQLWsLink {
  wsClientInstance = createClient({
    url: getGraphqlWsUrl(),
    connectionParams: () => ({
      authorization: _accessToken ? `Bearer ${_accessToken}` : '',
      'x-client-source': 'portal',
    }),
  });

  return new GraphQLWsLink(wsClientInstance);
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
        Booking: { keyFields: ['_id'] },
        Message: { keyFields: ['_id'] },
        Conversation: { keyFields: ['_id'] },
        Venue: { keyFields: ['_id'] },
        Promotion: { keyFields: ['_id'] },
        User: { keyFields: ['_id'] },
        Tournament: { keyFields: ['_id'] },
        TournamentCategory: { keyFields: ['_id'] },
        TournamentRegistration: { keyFields: ['_id'] },
        TournamentMatch: { keyFields: ['_id'] },
        MatchScorecard: { keyFields: ['_id'] },
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
