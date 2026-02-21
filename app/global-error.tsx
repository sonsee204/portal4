'use client';

import { useEffect } from 'react';
import { ERRORS, COMMON } from '@/lib/strings';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[GlobalError]', error);
  }, [error]);

  return (
    <html lang="vi">
      <body className="bg-bg flex min-h-screen items-center justify-center px-4 font-sans antialiased">
        <div className="text-center">
          <h1 className="text-heading text-2xl font-bold">
            {ERRORS.GLOBAL_ERROR_TITLE}
          </h1>
          <p className="text-muted mt-3 text-sm">
            {ERRORS.GLOBAL_ERROR_MESSAGE}
          </p>
          {error.digest && (
            <p className="text-faint mt-2 text-xs">
              {ERRORS.ERROR_CODE_LABEL} {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary/90 text-heading mt-6 rounded-lg px-6 py-2.5 text-sm font-medium transition-colors"
          >
            {COMMON.RETRY}
          </button>
        </div>
      </body>
    </html>
  );
}
