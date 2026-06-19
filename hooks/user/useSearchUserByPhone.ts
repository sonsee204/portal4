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
import { SEARCH_USER_BY_PHONE } from '@/graphql/user/queries';
import type { SearchUserByPhoneQuery } from '@/graphql/generated';
import { PHONE_REGEX } from '@/lib/validation/constants';

export type UserPhoneLookupResult = NonNullable<
  SearchUserByPhoneQuery['searchUserByPhone']
>;

export function useSearchUserByPhone() {
  const [runSearch, { loading, error }] = useLazyQuery<SearchUserByPhoneQuery>(
    SEARCH_USER_BY_PHONE,
    { fetchPolicy: 'network-only' }
  );

  const searchUserByPhone = useCallback(
    async (phone: string): Promise<UserPhoneLookupResult | null> => {
      const cleaned = phone.replace(/\s/g, '');
      if (!PHONE_REGEX.test(cleaned)) {
        return null;
      }

      const result = await runSearch({ variables: { phone: cleaned } });
      return result.data?.searchUserByPhone ?? null;
    },
    [runSearch]
  );

  return { searchUserByPhone, loading, error };
}
