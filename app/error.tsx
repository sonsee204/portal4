'use client';

import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';

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
      <h1 className="text-xl font-bold text-white">Đã xảy ra lỗi</h1>
      <p className="mt-2 text-center text-slate-400">Vui lòng thử lại sau.</p>
      <Button className="mt-6" onClick={reset}>
        Thử lại
      </Button>
    </div>
  );
}
