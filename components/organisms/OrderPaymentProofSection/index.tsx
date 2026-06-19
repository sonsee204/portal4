/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { VenueAction } from '@/graphql/generated';
import { OrderPaymentProofGrid } from './OrderPaymentProofGrid';
import { OrderPaymentProofLightbox } from './OrderPaymentProofLightbox';
import { OrderPaymentProofUploadZone } from './OrderPaymentProofUploadZone';
import {
  useOrderPaymentProofSection,
  type OrderPaymentProofSectionProps,
} from './useOrderPaymentProofSection';

export function OrderPaymentProofSection(props: OrderPaymentProofSectionProps) {
  const { compact } = props;
  const {
    fileRef,
    images,
    requiresProof,
    canUploadMore,
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
    accept,
    maxImages,
  } = useOrderPaymentProofSection(props);

  if (!requiresProof) return null;

  const readOnlyContent =
    images.length > 0 ? (
      <OrderPaymentProofGrid
        images={images}
        canEdit={false}
        canUploadMore={false}
        isBusy={false}
        maxImages={maxImages}
        compact={compact}
        onImagePress={setLightboxIndex}
        onRemoveImage={() => undefined}
        onAddImage={() => undefined}
      />
    ) : (
      <p className="text-muted text-xs">Chưa có ảnh minh chứng thanh toán.</p>
    );

  const editContent = (
    <>
      <input
        ref={fileRef}
        type="file"
        accept={accept}
        multiple
        className="hidden"
        disabled={!canUploadMore}
        onChange={handleFileChange}
      />

      {images.length === 0 ? (
        <OrderPaymentProofUploadZone
          compact={compact}
          isBusy={isBusy}
          isDragOver={isDragOver}
          canUploadMore={canUploadMore}
          onDragOver={() => setIsDragOver(true)}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={handleDrop}
          onClick={openFilePicker}
        />
      ) : (
        <OrderPaymentProofGrid
          images={images}
          canEdit
          canUploadMore={canUploadMore}
          isBusy={isBusy}
          maxImages={maxImages}
          compact={compact}
          onImagePress={setLightboxIndex}
          onRemoveImage={setDeleteTarget}
          onAddImage={openFilePicker}
        />
      )}
    </>
  );

  return (
    <section className="space-y-2">
      <h3 className="text-heading text-sm font-semibold">
        Minh chứng thanh toán
      </h3>

      <VenueActionGate
        action={VenueAction.CreateOrder}
        fallback={readOnlyContent}
      >
        {editContent}
      </VenueActionGate>

      <OrderPaymentProofLightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />

      <ConfirmDialog
        open={deleteTarget != null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => void handleRemoveConfirm()}
        title="Xóa ảnh minh chứng"
        description="Bạn có chắc muốn xóa ảnh minh chứng thanh toán này?"
        confirmLabel="Xóa"
        variant="danger"
        loading={isBusy}
      />
    </section>
  );
}
