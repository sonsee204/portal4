export type ClientSource = 'web-app' | 'portal' | 'mobile';

export interface SessionTokens {
  accessToken: string;
  refreshToken: string;
}

export interface RefreshTokenUser {
  _id: string;
  role: string;
}

export interface RefreshSuccess {
  kind: 'success';
  accessToken: string;
  refreshToken: string;
  user: RefreshTokenUser;
}

export interface RefreshAuthFailure {
  kind: 'auth_failure';
  message?: string;
}

export interface RefreshNetworkFailure {
  kind: 'network_failure';
  message?: string;
}

export type RefreshResult =
  | RefreshSuccess
  | RefreshAuthFailure
  | RefreshNetworkFailure;

export function isAuthRefreshError(code: string | undefined): boolean {
  return (
    code === 'UNAUTHENTICATED' ||
    code === 'INVALID_REFRESH_TOKEN' ||
    code === 'TOKEN_EXPIRED' ||
    code === 'INVALID_TOKEN'
  );
}

export function isUnauthenticatedGraphQLError(
  code: string | undefined,
  message: string,
): boolean {
  return (
    code === 'UNAUTHENTICATED' ||
    message.includes('Token đã hết hạn') ||
    message.includes('jwt expired')
  );
}
