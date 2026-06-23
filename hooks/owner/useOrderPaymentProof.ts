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
import type { ApolloCache } from '@apollo/client';
import { useMutation } from '@apollo/client/react';
import {
  REMOVE_PAYMENT_PROOF_IMAGE,
  UPLOAD_PAYMENT_PROOF,
} from '@/graphql/owner/mutations';
import type {
  RemovePaymentProofImageMutation,
  RemovePaymentProofImageMutationVariables,
  UploadPaymentProofMutation,
  UploadPaymentProofMutationVariables,
} from '@/graphql/generated';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { GET_ORDER } from '@/graphql/owner/queries';
import type { GetOrderQuery } from '@/graphql/generated';

const LIST_REFETCH_QUERIES = [
  'VenueOrdersConnection',
  'OrdersPendingRefundConnection',
] as const;

function updateOrderPaymentProofCache(
  cache: ApolloCache,
  order: { _id: string; paymentProofImages?: Array<string> | null },
  orderId: string,
) {
  const proofImages = order.paymentProofImages ?? [];

  const cacheId = cache.identify({ __typename: 'Order', _id: order._id });
  if (cacheId) {
    cache.modify({
      id: cacheId,
      fields: {
        paymentProofImages() {
          return proofImages;
        },
      },
    });
  }

  try {
    const existing = cache.readQuery<GetOrderQuery>({
      query: GET_ORDER,
      variables: { orderId },
    });
    if (existing?.order) {
      cache.writeQuery<GetOrderQuery>({
        query: GET_ORDER,
        variables: { orderId },
        data: {
          order: {
            ...existing.order,
            paymentProofImages: proofImages,
          },
        },
      });
    }
  } catch {
    // GetOrder not in cache for this orderId
  }
}

export function useOrderPaymentProof() {
  const [uploadMutation, { loading: uploading }] = useMutation<
    UploadPaymentProofMutation,
    UploadPaymentProofMutationVariables
  >(
    UPLOAD_PAYMENT_PROOF,
    createMutationOptions(
      'UploadPaymentProof',
      'Đã tải lên ảnh minh chứng thanh toán',
    ),
  );

  const [removeMutation, { loading: removing }] = useMutation<
    RemovePaymentProofImageMutation,
    RemovePaymentProofImageMutationVariables
  >(
    REMOVE_PAYMENT_PROOF_IMAGE,
    createMutationOptions(
      'RemovePaymentProofImage',
      'Đã xóa ảnh minh chứng thanh toán',
    ),
  );

  const uploadPaymentProof = useCallback(
    async (orderId: string, base64Image: string) => {
      const result = await uploadMutation({
        variables: { input: { orderId, base64Image } },
        update(cache, { data }) {
          const updated = data?.uploadPaymentProof;
          if (updated) updateOrderPaymentProofCache(cache, updated, orderId);
        },
        refetchQueries: [...LIST_REFETCH_QUERIES],
        awaitRefetchQueries: false,
      });
      return result.data?.uploadPaymentProof ?? null;
    },
    [uploadMutation],
  );

  const removePaymentProofImage = useCallback(
    async (orderId: string, imageUrl: string) => {
      const result = await removeMutation({
        variables: { orderId, imageUrl },
        update(cache, { data }) {
          const updated = data?.removePaymentProofImage;
          if (updated) updateOrderPaymentProofCache(cache, updated, orderId);
        },
        refetchQueries: [...LIST_REFETCH_QUERIES],
        awaitRefetchQueries: false,
      });
      return result.data?.removePaymentProofImage ?? null;
    },
    [removeMutation],
  );

  return {
    uploadPaymentProof,
    removePaymentProofImage,
    uploading,
    removing,
    isBusy: uploading || removing,
  };
}
