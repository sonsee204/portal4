'use client';

import { useEffect } from 'react';

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
          <h1 className="text-2xl font-bold text-heading">
            Đã xảy ra lỗi nghiêm trọng
          </h1>
          <p className="mt-3 text-sm text-muted">
            Hệ thống gặp sự cố không mong muốn. Vui lòng thử lại.
          </p>
          {error.digest && (
            <p className="mt-2 text-xs text-faint">
              Mã lỗi: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="bg-primary hover:bg-primary/90 mt-6 rounded-lg px-6 py-2.5 text-sm font-medium text-heading transition-colors"
          >
            Thử lại
          </button>
        </div>
      </body>
    </html>
  );
}
