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
import { useLazyQuery } from '@apollo/client/react';
import { VALIDATE_ORDER_PROMO_CODE } from '@/graphql/owner/queries';
import type {
  ValidateOrderPromoCodeInput,
  ValidateOrderPromoCodeQuery,
} from '@/graphql/generated';

export function useValidateOrderPromoCode() {
  const [validate, { loading, error }] = useLazyQuery<ValidateOrderPromoCodeQuery>(
    VALIDATE_ORDER_PROMO_CODE,
    { fetchPolicy: 'network-only' },
  );

  const validateCode = useCallback(
    async (input: ValidateOrderPromoCodeInput) => {
      const result = await validate({ variables: { input } });
      return result.data?.validateOrderPromoCode ?? null;
    },
    [validate],
  );

  return { validateCode, loading, error };
}
