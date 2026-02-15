import type { ErrorLike } from '@apollo/client';
import { CombinedGraphQLErrors } from '@apollo/client/errors';

/**
 * Known GraphQL error codes and their user-friendly Vietnamese messages
 */
const ERROR_CODE_MAP: Record<string, string> = {
  UNAUTHENTICATED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  FORBIDDEN: 'Bạn không có quyền thực hiện thao tác này.',
  BAD_USER_INPUT: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  INTERNAL_SERVER_ERROR: 'Lỗi hệ thống. Vui lòng thử lại sau.',
  NOT_FOUND: 'Không tìm thấy dữ liệu yêu cầu.',
  CONFLICT: 'Dữ liệu bị trùng. Vui lòng kiểm tra lại.',
};

const FALLBACK_MESSAGE = 'Đã xảy ra lỗi. Vui lòng thử lại.';

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
