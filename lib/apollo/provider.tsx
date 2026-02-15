'use client';

import { useEffect } from 'react';
import { ApolloProvider as ApolloProviderClient } from '@apollo/client/react';
import { getApolloClient, setClientAccessToken } from './client';

interface ApolloProviderProps {
  children: React.ReactNode;
  /** Access token passed from server component */
  accessToken?: string | null;
}

export function ApolloProvider({ children, accessToken }: ApolloProviderProps) {
  const client = getApolloClient();

  // Inject access token from server into the client
  useEffect(() => {
    if (accessToken) {
      setClientAccessToken(accessToken);
    }
  }, [accessToken]);

  // Set initial token synchronously for first render
  if (accessToken) {
    setClientAccessToken(accessToken);
  }

  return (
    <ApolloProviderClient client={client}>{children}</ApolloProviderClient>
  );
}
