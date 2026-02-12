'use client';

import {
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

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

const httpLink = new HttpLink({
  uri: getGraphqlUrl(),
  headers: {
    'Apollo-Require-Preflight': 'true',
  },
  fetchOptions: {
    next: { revalidate: 0 },
  },
});

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      'Apollo-Require-Preflight': 'true',
    },
  };
});

const link = ApolloLink.from([authLink, httpLink]);

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
