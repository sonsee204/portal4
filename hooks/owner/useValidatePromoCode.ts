/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback } from 'react';
import { useLazyQuery } from '@apollo/client/react';
import { VALIDATE_PROMO_CODE } from '@/graphql/owner/queries';
import type {
  ValidatePromoCodeInput,
  ValidatePromoCodeQuery,
} from '@/graphql/generated';

export function useValidatePromoCode() {
  const [validate, { loading, error }] = useLazyQuery<ValidatePromoCodeQuery>(
    VALIDATE_PROMO_CODE,
    { fetchPolicy: 'network-only' },
  );

  const validateCode = useCallback(
    async (input: ValidatePromoCodeInput) => {
      const result = await validate({ variables: { input } });
      return result.data?.validatePromoCode ?? null;
    },
    [validate],
  );

  return { validateCode, loading, error };
}
