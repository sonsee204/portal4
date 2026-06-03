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
import { Button } from '@/components/atoms/Button';
import { ERRORS, COMMON } from '@/lib/strings';

/** Bật trên production để debug: NEXT_PUBLIC_DEBUG_ERROR_DISPLAY=true */
const SHOW_ERROR_DETAILS =
  process.env.NODE_ENV === 'development' ||
  process.env.NEXT_PUBLIC_DEBUG_ERROR_DISPLAY === 'true';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Portal Error]', error?.message, error?.digest, error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-heading text-xl font-bold">{ERRORS.ERROR_TITLE}</h1>
      <p className="text-muted mt-2 text-center">{ERRORS.GENERIC}</p>
      {SHOW_ERROR_DETAILS && error?.message && (
        <pre className="text-faint mt-3 max-h-32 max-w-lg overflow-auto break-words rounded bg-black/20 p-3 text-left text-xs">
          {error.message}
        </pre>
      )}
      <Button className="mt-6" onClick={reset}>
        {COMMON.RETRY}
      </Button>
    </div>
  );
}
