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

import { useCallback } from 'react';
import { useMutation } from '@apollo/client/react';
import { MOVE_PRODUCTS_TO_VENUE } from '@/graphql/owner/mutations';
import type {
  MoveProductsToVenueMutation,
  TransferProductsInput,
} from '@/graphql/generated';
import {
  createSilentMutationOptions,
  formatMutationError,
} from '@/hooks/shared/mutation-helpers';
import { showError, showSuccess } from '@/lib/toast';

const PRODUCT_MUTATION_REFETCH_QUERIES = [
  'VenueProductsConnection',
  'ProductStats',
  'LowStockProducts',
  'StockMovementsConnection',
] as const;

export function useMoveProductsToVenue() {
  const [moveProductsMutation, { loading: transferring }] = useMutation<
    MoveProductsToVenueMutation,
    { input: TransferProductsInput }
  >(MOVE_PRODUCTS_TO_VENUE, createSilentMutationOptions('MoveProductsToVenue'));

  const moveProducts = useCallback(
    async (input: TransferProductsInput) => {
      try {
        const result = await moveProductsMutation({
          variables: { input },
          refetchQueries: [...PRODUCT_MUTATION_REFETCH_QUERIES],
        });

        const payload = result.data?.moveProductsToVenue;
        if (!payload) {
          return undefined;
        }

        const failedCount = payload.failed?.length ?? 0;
        if (payload.success > 0 && failedCount === 0) {
          showSuccess(`Đã lưu chuyển ${payload.success} sản phẩm`);
        } else if (payload.success > 0 && failedCount > 0) {
          showSuccess(
            `Đã lưu chuyển ${payload.success} sản phẩm. ${failedCount} sản phẩm thất bại.`,
          );
        } else {
          showError('Không thể lưu chuyển sản phẩm. Vui lòng thử lại.');
        }

        return payload;
      } catch (error) {
        showError(formatMutationError(error));
        throw error;
      }
    },
    [moveProductsMutation],
  );

  return { moveProducts, transferring };
}
