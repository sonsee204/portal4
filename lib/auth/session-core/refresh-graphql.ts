import { isAuthRefreshError, type ClientSource, type RefreshResult } from './types';

const REFRESH_MUTATION = `
  mutation RefreshToken {
    refreshToken {
      accessToken
      refreshToken
      user {
        _id
        role
      }
    }
  }
`;

interface GraphQLRefreshResponse {
  data?: {
    refreshToken: {
      accessToken: string;
      refreshToken: string;
      user: { _id: string; role: string };
    };
  };
  errors?: Array<{ message: string; extensions?: { code?: string } }>;
}

export async function performTokenRefresh(
  graphqlUrl: string,
  refreshToken: string,
  clientSource: ClientSource,
): Promise<RefreshResult> {
  try {
    const response = await fetch(graphqlUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${refreshToken}`,
        'x-client-source': clientSource,
        'Apollo-Require-Preflight': 'true',
      },
      body: JSON.stringify({ query: REFRESH_MUTATION }),
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { kind: 'auth_failure', message: `HTTP ${response.status}` };
      }
      return {
        kind: 'network_failure',
        message: `HTTP ${response.status}`,
      };
    }

    const result = (await response.json()) as GraphQLRefreshResponse;

    if (result.errors?.length) {
      const first = result.errors[0];
      const code = first.extensions?.code;
      if (isAuthRefreshError(code)) {
        return { kind: 'auth_failure', message: first.message };
      }
      return { kind: 'network_failure', message: first.message };
    }

    if (!result.data?.refreshToken) {
      return { kind: 'auth_failure', message: 'No refresh data' };
    }

    const { accessToken, refreshToken: newRefreshToken, user } =
      result.data.refreshToken;

    return {
      kind: 'success',
      accessToken,
      refreshToken: newRefreshToken,
      user,
    };
  } catch (error) {
    return {
      kind: 'network_failure',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
