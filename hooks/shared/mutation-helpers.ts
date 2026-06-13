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

import type { ErrorLike } from '@apollo/client';
import { formatGraphQLError } from '@/lib/errors/format-graphql-error';
import { showSuccess, showError } from '@/lib/toast';
import { ERRORS } from '@/lib/strings';

const FALLBACK_MESSAGE = ERRORS.GENERIC;

/**
 * Safely extract a user-friendly message from an unknown error.
 * Bridges the gap between `catch (err: unknown)` and `formatGraphQLError(ErrorLike)`.
 */
export function formatMutationError(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return formatGraphQLError(error as ErrorLike);
  }
  if (error instanceof Error) {
    return error.message;
  }
  return FALLBACK_MESSAGE;
}

/**
 * Standard Apollo `useMutation` options with toast feedback.
 * Use for mutations where a single success message is sufficient.
 *
 * @example
 * ```ts
 * useMutation(CREATE_CODE, createMutationOptions(
 *   'Create referral code',
 *   'Tạo mã giới thiệu thành công',
 * ));
 * ```
 */
export function createMutationOptions(
  operationName: string,
  successMessage?: string,
) {
  return {
    onCompleted: () => {
      if (successMessage) showSuccess(successMessage);
    },
    onError: (error: Error) => {
      console.error(`[${operationName}]`, error);
      showError(formatMutationError(error));
    },
  };
}

/**
 * Silent mutation options -- logs error but does not show success toast.
 * Use for background mutations (e.g., toggle, like/unlike).
 */
export function createSilentMutationOptions(operationName: string) {
  return {
    onError: (error: Error) => {
      console.error(`[${operationName}]`, error);
      showError(formatMutationError(error));
    },
  };
}

/** Mutations that must throw/reject on GraphQL errors (overrides client default `errorPolicy: 'all'`). */
export const strictMutationErrorPolicy = { errorPolicy: 'none' as const };
