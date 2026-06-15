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

import type { ReactNode, RefObject } from 'react';
import { cn } from '@/lib/utils';

interface PrintPreviewFrameProps {
  children: ReactNode;
  zoom?: number;
  className?: string;
  printRef?: RefObject<HTMLDivElement | null>;
}

export function PrintPreviewFrame({
  children,
  zoom = 1,
  className,
  printRef,
}: PrintPreviewFrameProps) {
  return (
    <div className="no-print overflow-x-auto rounded-xl border border-white/10 bg-black/20 p-4">
      <div
        className={cn(
          'print-preview-paper print-preview-scaler mx-auto origin-top rounded-lg p-6',
          className
        )}
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          width: zoom !== 1 ? `${100 / zoom}%` : undefined,
          maxWidth: '900px',
        }}
      >
        <div ref={printRef}>{children}</div>
      </div>
    </div>
  );
}

interface PrintDocumentShellProps {
  children: ReactNode;
  isDraft?: boolean;
  orientation?: 'portrait' | 'landscape';
  className?: string;
}

export function PrintDocumentShell({
  children,
  isDraft = false,
  orientation = 'portrait',
  className,
}: PrintDocumentShellProps) {
  return (
    <div
      id="print-root"
      className={cn(
        'print-document-root relative',
        orientation === 'landscape' && 'landscape-page',
        className
      )}
    >
      {isDraft ? (
        <div className="print-draft-watermark" aria-hidden>
          BẢN NHÁP
        </div>
      ) : null}
      {children}
    </div>
  );
}
