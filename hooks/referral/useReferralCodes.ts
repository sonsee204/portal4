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
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_REFERRAL_CODES } from '@/graphql/referral/queries';
import {
  CREATE_REFERRAL_CODE,
  TOGGLE_REFERRAL_CODE,
} from '@/graphql/referral/mutations';
import { formatMutationError } from '@/hooks/shared';
import { showSuccess, showError } from '@/lib/toast';
import { GROWTH } from '@/lib/strings';
import type { ReferralCode, CreateReferralCodeInput } from '@/types';

export function useReferralCodes() {
  const { data, loading, refetch } = useQuery<{
    getReferralCodes: ReferralCode[];
  }>(GET_REFERRAL_CODES, {
    fetchPolicy: 'cache-and-network',
  });

  return {
    codes: data?.getReferralCodes ?? [],
    loading,
    refetch,
  };
}

export function useCreateReferralCode(options?: {
  onSuccess?: () => void;
}) {
  const [mutation, { loading }] = useMutation<{
    createReferralCode: ReferralCode;
  }>(CREATE_REFERRAL_CODE, {
    onCompleted: () => {
      showSuccess(GROWTH.REFERRAL.SUCCESS_CREATE);
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('[Create referral code]', error);
      showError(formatMutationError(error));
    },
  });

  const createCode = useCallback(
    (input: CreateReferralCodeInput) => {
      void mutation({ variables: { input } });
    },
    [mutation],
  );

  return { createCode, loading };
}

export function useToggleReferralCode(options?: {
  onSuccess?: () => void;
}) {
  const [mutation] = useMutation<{
    toggleReferralCode: ReferralCode;
  }>(TOGGLE_REFERRAL_CODE, {
    onCompleted: () => {
      showSuccess(GROWTH.REFERRAL.SUCCESS_TOGGLE);
      options?.onSuccess?.();
    },
    onError: (error) => {
      console.error('[Toggle referral code]', error);
      showError(formatMutationError(error));
    },
  });

  const toggleCode = useCallback(
    (id: string, isActive: boolean) => {
      void mutation({ variables: { id, isActive: !isActive } });
    },
    [mutation],
  );

  return { toggleCode };
}
