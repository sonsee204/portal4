'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h1 className="text-xl font-bold text-gray-900">Đã xảy ra lỗi</h1>
      <p className="mt-2 text-center text-gray-600">Vui lòng thử lại sau.</p>
      <button
        className="mt-6 rounded-lg bg-gray-900 px-6 py-2 text-white hover:bg-gray-800"
        onClick={reset}
      >
        Thử lại
      </button>
    </div>
  );
}
