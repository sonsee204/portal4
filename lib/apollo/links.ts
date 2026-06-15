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

import { HttpLink, type ApolloClient } from '@apollo/client';
import { GraphQLWsLink } from '@apollo/client/link/subscriptions';
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
import { getGraphqlUrl, getGraphqlWsUrl } from './urls';
import {
  getClientAccessToken,
  reconnectWebSocket,
  redirectToLogin,
  registerWsClientDisposer,
  setClientAccessToken,
} from './token';

let wsClientInstance: Client | null = null;
let apolloClientRef: ApolloClient | null = null;

export function setApolloClientRef(client: ApolloClient | null): void {
  apolloClientRef = client;
}

export const httpLink = new HttpLink({
  uri: getGraphqlUrl(),
  credentials: 'include',
  fetchOptions: {
    next: { revalidate: 0 },
  },
});

export const authLink = setContext((_, { headers }) => {
  const token = getClientAccessToken();

  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true',
      'x-client-source': 'portal',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
});

export const errorLink = new ErrorLink(({ error, operation, forward }) => {
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
            setClientAccessToken(result.accessToken);
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
            setClientAccessToken(null);
            if (apolloClientRef) {
              void apolloClientRef.clearStore();
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

export function createWsLink(): GraphQLWsLink {
  if (wsClientInstance) {
    wsClientInstance.dispose();
    wsClientInstance = null;
  }

  wsClientInstance = createClient({
    url: getGraphqlWsUrl(),
    connectionParams: () => ({
      authorization: getClientAccessToken()
        ? `Bearer ${getClientAccessToken()}`
        : '',
      'x-client-source': 'portal',
    }),
  });

  registerWsClientDisposer(() => {
    if (wsClientInstance) {
      wsClientInstance.dispose();
      wsClientInstance = null;
    }
  });

  return new GraphQLWsLink(wsClientInstance);
}
