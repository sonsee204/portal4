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
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';

interface OrderPaymentProofLightboxProps {
  images: string[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function OrderPaymentProofLightbox({
  images,
  index,
  onClose,
  onNavigate,
}: OrderPaymentProofLightboxProps) {
  if (index == null || !images[index]) return null;

  const hasPrev = index > 0;
  const hasNext = index < images.length - 1;

  return (
    <Modal open onClose={onClose} title="Minh chứng thanh toán" size="lg">
      <div className="relative flex min-h-[50vh] items-center justify-center">
        <div className="relative h-[min(60vh,480px)] w-full max-w-2xl">
          <Image
            src={images[index]}
            alt={`Minh chứng thanh toán ${index + 1}`}
            fill
            className="object-contain"
            unoptimized
          />
        </div>

        {images.length > 1 && (
          <>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasPrev}
              onClick={() => onNavigate(index - 1)}
              className="absolute top-1/2 left-0 -translate-y-1/2"
              aria-label="Ảnh trước"
            >
              <IonIcon name="chevron-back" size="md" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={!hasNext}
              onClick={() => onNavigate(index + 1)}
              className="absolute top-1/2 right-0 -translate-y-1/2"
              aria-label="Ảnh sau"
            >
              <IonIcon name="chevron-forward" size="md" />
            </Button>
          </>
        )}
      </div>

      {images.length > 1 && (
        <p className="text-muted mt-2 text-center text-xs">
          {index + 1} / {images.length}
        </p>
      )}
    </Modal>
  );
}
