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

import { ApolloClient, ApolloLink, InMemoryCache, split } from '@apollo/client';
import { getMainDefinition } from '@apollo/client/utilities';
import { apolloTypePolicies } from './cache-type-policies';
import {
  authLink,
  createWsLink,
  errorLink,
  httpLink,
  setApolloClientRef,
} from './links';

export {
  getClientAccessToken,
  reconnectWebSocket,
  setClientAccessToken,
} from './token';

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

  const apolloClient = new ApolloClient({
    link,
    cache: new InMemoryCache({
      typePolicies: apolloTypePolicies,
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

  setApolloClientRef(apolloClient);
  return apolloClient;
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
