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

  // Set initial token synchronously for first render — guard to the browser
  // only. This component is also rendered on the server during SSR, where
  // `setClientAccessToken` would mutate a process-global singleton shared
  // across every concurrent request/user, leaking one user's token to others.
  if (accessToken && typeof window !== 'undefined') {
    setClientAccessToken(accessToken);
  }

  return (
    <ApolloProviderClient client={client}>{children}</ApolloProviderClient>
  );
}
