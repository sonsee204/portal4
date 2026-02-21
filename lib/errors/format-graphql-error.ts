import type { ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';
import { ERRORS } from '@/lib/strings';

const ERROR_CODE_MAP: Record<string, string> = {
  UNAUTHENTICATED: ERRORS.GQL_UNAUTHENTICATED,
  FORBIDDEN: ERRORS.GQL_FORBIDDEN,
  BAD_USER_INPUT: ERRORS.GQL_BAD_INPUT,
  INTERNAL_SERVER_ERROR: ERRORS.GQL_INTERNAL,
  NOT_FOUND: ERRORS.GQL_NOT_FOUND,
  CONFLICT: ERRORS.GQL_CONFLICT,
};

const FALLBACK_MESSAGE = ERRORS.GENERIC;

/**
 * Extract the first user-friendly error message from an Apollo error.
 *
 * Priority:
 * 1. CombinedGraphQLErrors -> mapped message by error code (extensions.code)
 * 2. Original backend error message (if readable)
 * 3. Error message property
 * 4. Fallback generic message
 */
export function formatGraphQLError(error: ErrorLike): string {
  // CombinedGraphQLErrors: contains .errors array from GraphQL response
  if (CombinedGraphQLErrors.is(error)) {
    const firstError = error.errors[0];
    if (firstError) {
      const code = firstError.extensions?.code as string | undefined;

      // Try mapped message by code
      if (code && ERROR_CODE_MAP[code]) {
        return ERROR_CODE_MAP[code];
      }

      // Use backend message if it looks user-friendly
      if (firstError.message && !firstError.message.startsWith('Cannot ')) {
        return firstError.message;
      }
    }
  }

  // Fallback to the error's own message if present
  if (error.message && !error.message.startsWith('Cannot ')) {
    return error.message;
  }

  return FALLBACK_MESSAGE;
}

/**
 * Check if an error is an authentication error
 */
export function isAuthError(error: ErrorLike): boolean {
  if (!CombinedGraphQLErrors.is(error)) return false;

  return error.errors.some(
    (err) =>
      err.extensions?.code === 'UNAUTHENTICATED' ||
      err.message.includes('Unauthorized') ||
      err.message.includes('Token'),
  );
}
