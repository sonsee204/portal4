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
import { UPDATE_CONTACT_INQUIRY_STATUS } from '@/graphql/mutations/contact';
import type { ContactInquiry, UpdateInquiryStatusInput } from '@/types';

export function useUpdateInquiryStatus() {
  const [mutation, { loading }] = useMutation<{
    updateContactInquiryStatus: ContactInquiry;
  }>(UPDATE_CONTACT_INQUIRY_STATUS);

  const updateStatus = useCallback(
    async (id: string, input: UpdateInquiryStatusInput) => {
      const result = await mutation({ variables: { id, input } });
      return result.data?.updateContactInquiryStatus;
    },
    [mutation],
  );

  return { updateStatus, loading };
}
