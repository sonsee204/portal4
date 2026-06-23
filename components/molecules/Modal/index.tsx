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

import { useEffect } from 'react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'max-w-md',
  md: 'max-w-2xl',
  lg: 'max-w-4xl',
  xl: 'max-w-6xl',
};

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  size = 'lg',
  className,
}: ModalProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={cn(
          'border-surface-border relative w-full overflow-hidden rounded-2xl border bg-white shadow-2xl',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {title && (
          <div className="border-surface-border flex items-center justify-between border-b px-6 py-4">
            <h2 className="text-heading text-lg font-bold">{title}</h2>
            <button
              onClick={onClose}
              className="hover:bg-surface-hover text-muted hover:text-heading rounded-lg p-1 transition-colors"
            >
              <IonIcon name="close-outline" size="md" />
            </button>
          </div>
        )}

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="border-surface-border flex flex-wrap items-center justify-end gap-2 border-t px-6 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
