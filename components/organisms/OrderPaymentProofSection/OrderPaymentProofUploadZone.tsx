/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';

interface OrderPaymentProofUploadZoneProps {
  compact?: boolean;
  isBusy: boolean;
  isDragOver: boolean;
  canUploadMore: boolean;
  onDragOver: (event: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: React.DragEvent) => void;
  onClick: () => void;
}

export function OrderPaymentProofUploadZone({
  compact,
  isBusy,
  isDragOver,
  canUploadMore,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick,
}: OrderPaymentProofUploadZoneProps) {
  return (
    <div
      role="button"
      tabIndex={canUploadMore ? 0 : -1}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          onClick();
        }
      }}
      onClick={onClick}
      onDragOver={(event) => {
        event.preventDefault();
        if (canUploadMore) onDragOver(event);
      }}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      className={cn(
        'border-surface-border group relative flex cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed transition-colors',
        compact ? 'min-h-[120px]' : 'min-h-[160px]',
        canUploadMore && 'hover:border-primary/40 hover:bg-primary/5',
        isDragOver && 'border-primary/60 bg-primary/10',
        !canUploadMore && 'cursor-not-allowed opacity-60'
      )}
    >
      <div className="flex flex-col items-center gap-2 p-6 text-center">
        {isBusy ? (
          <>
            <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-2xl">
              <IonIcon name="hourglass-outline" size="md" />
            </div>
            <p className="text-heading text-sm font-medium">
              Đang tải ảnh lên...
            </p>
          </>
        ) : (
          <>
            <div className="bg-overlay-faint text-faint group-hover:bg-primary/10 group-hover:text-primary flex h-12 w-12 items-center justify-center rounded-2xl transition-colors">
              <IonIcon name="cloud-upload-outline" size="md" />
            </div>
            <div>
              <p className="text-heading text-sm font-medium">
                Kéo thả hoặc nhấn để tải ảnh lên
              </p>
              <p className="text-muted mt-1 text-xs">
                JPEG, PNG, WebP — tối đa 10MB mỗi ảnh
              </p>
            </div>
            {!compact && (
              <Button
                type="button"
                size="sm"
                className="mt-1"
                disabled={!canUploadMore}
              >
                Tải lên ảnh
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
