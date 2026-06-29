/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import Image from 'next/image';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

interface OrderPaymentProofGridProps {
  images: string[];
  canEdit: boolean;
  canUploadMore: boolean;
  isBusy: boolean;
  maxImages: number;
  compact?: boolean;
  onImagePress: (index: number) => void;
  onRemoveImage: (url: string) => void;
  onAddImage: () => void;
}

export function OrderPaymentProofGrid({
  images,
  canEdit,
  canUploadMore,
  isBusy,
  maxImages,
  compact,
  onImagePress,
  onRemoveImage,
  onAddImage,
}: OrderPaymentProofGridProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <IonIcon
          name="checkmark-circle-outline"
          size="sm"
          className="text-emerald-400"
        />
        <span className="text-xs font-medium text-emerald-400">
          {images.length} ảnh đã tải lên
        </span>
        <span className="text-muted text-xs">(tối đa {maxImages})</span>
      </div>

      <div
        className={cn(
          'grid gap-2',
          compact ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-4'
        )}
      >
        {images.map((url, index) => (
          <div key={url} className="group relative aspect-square">
            <button
              type="button"
              onClick={() => onImagePress(index)}
              className="border-surface-border relative h-full w-full overflow-hidden rounded-lg border"
            >
              <Image
                src={url}
                alt={`Minh chứng thanh toán ${index + 1}`}
                fill
                className="object-cover transition-opacity group-hover:opacity-90"
                unoptimized
              />
              <span className="absolute right-1.5 bottom-1.5 flex h-6 w-6 items-center justify-center rounded-md bg-black/50">
                <IonIcon
                  name="expand-outline"
                  size="xs"
                  className="text-white"
                />
              </span>
            </button>

            {canEdit && (
              <button
                type="button"
                disabled={isBusy}
                onClick={() => onRemoveImage(url)}
                className="bg-danger absolute -top-1.5 -right-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full text-white shadow disabled:opacity-60"
                aria-label="Xóa ảnh"
              >
                <IonIcon name="close" size="xs" />
              </button>
            )}
          </div>
        ))}

        {canUploadMore && (
          <button
            type="button"
            disabled={isBusy}
            onClick={onAddImage}
            className={cn(
              'border-primary/30 bg-primary/5 text-primary hover:border-primary/50 hover:bg-primary/10 flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors disabled:opacity-60'
            )}
          >
            {isBusy ? (
              <IonIcon name="hourglass-outline" size="md" />
            ) : (
              <>
                <IonIcon name="add-outline" size="md" />
                <span className="text-xs font-medium">Thêm ảnh</span>
              </>
            )}
          </button>
        )}
      </div>

      <p className="bg-primary/5 text-muted rounded-lg px-3 py-2 text-xs">
        Nhấn vào ảnh để xem phóng to. Ảnh minh chứng giúp xác nhận thanh toán
        nhanh hơn.
      </p>
    </div>
  );
}
