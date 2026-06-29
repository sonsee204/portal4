/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useRef, useState, type ChangeEvent } from 'react';
import { useOrderPaymentProof } from '@/hooks/owner/useOrderPaymentProof';
import {
  MAX_PAYMENT_PROOF_IMAGES,
  PAYMENT_PROOF_ACCEPT,
  remainingProofSlots,
  requiresPaymentProof,
} from '@/lib/owner/payment-proof';
import {
  ImageUploadValidationError,
  prepareImageForUpload,
} from '@/lib/upload/prepare-image-for-upload';
import { showError } from '@/lib/toast';

export interface OrderPaymentProofSectionProps {
  orderId: string;
  paymentMethod?: string | null;
  paymentProofImages?: string[] | null;
  canEdit?: boolean;
  compact?: boolean;
  onImagesChange?: () => void;
}

export function useOrderPaymentProofSection({
  orderId,
  paymentMethod,
  paymentProofImages = [],
  canEdit = true,
  onImagesChange,
}: OrderPaymentProofSectionProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const { uploadPaymentProof, removePaymentProofImage, isBusy } =
    useOrderPaymentProof();

  const [overrideImages, setOverrideImages] = useState<string[] | null>(null);
  const images = overrideImages ?? paymentProofImages ?? [];
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const requiresProof = requiresPaymentProof(paymentMethod);
  const canUploadMore =
    canEdit && images.length < MAX_PAYMENT_PROOF_IMAGES && !isBusy;
  const slotsLeft = remainingProofSlots(images.length);

  const processFiles = useCallback(
    async (fileList: FileList | File[]) => {
      if (!canUploadMore) return;

      const files = Array.from(fileList).slice(0, slotsLeft);
      if (files.length === 0) {
        showError(`Chỉ có thể tải lên tối đa ${MAX_PAYMENT_PROOF_IMAGES} ảnh.`);
        return;
      }

      for (const file of files) {
        try {
          const base64Image = await prepareImageForUpload(file);
          const updatedOrder = await uploadPaymentProof(orderId, base64Image);
          if (updatedOrder?.paymentProofImages) {
            setOverrideImages(updatedOrder.paymentProofImages);
          }
        } catch (error) {
          if (error instanceof ImageUploadValidationError) {
            showError(error.message);
          }
          break;
        }
      }

      onImagesChange?.();
    },
    [
      canUploadMore,
      slotsLeft,
      uploadPaymentProof,
      orderId,
      onImagesChange,
    ],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files?.length) void processFiles(files);
      event.target.value = '';
    },
    [processFiles],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      setIsDragOver(false);
      if (!canUploadMore) return;
      const files = event.dataTransfer.files;
      if (files.length) void processFiles(files);
    },
    [canUploadMore, processFiles],
  );

  const handleRemoveConfirm = useCallback(async () => {
    if (!deleteTarget) return;
    const updatedOrder = await removePaymentProofImage(orderId, deleteTarget);
    if (updatedOrder?.paymentProofImages) {
      setOverrideImages(updatedOrder.paymentProofImages);
    }
    setDeleteTarget(null);
    onImagesChange?.();
  }, [deleteTarget, removePaymentProofImage, orderId, onImagesChange]);

  const openFilePicker = useCallback(() => {
    if (canUploadMore) fileRef.current?.click();
  }, [canUploadMore]);

  return {
    fileRef,
    images,
    requiresProof,
    canUploadMore,
    canEdit,
    isBusy,
    isDragOver,
    setIsDragOver,
    lightboxIndex,
    setLightboxIndex,
    deleteTarget,
    setDeleteTarget,
    handleFileChange,
    handleDrop,
    handleRemoveConfirm,
    openFilePicker,
    accept: PAYMENT_PROOF_ACCEPT,
    maxImages: MAX_PAYMENT_PROOF_IMAGES,
  };
}
