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
