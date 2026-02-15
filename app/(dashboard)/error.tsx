'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('[DashboardError]', error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
        <IonIcon name="warning-outline" size="lg" className="text-red-400" />
      </div>
      <h2 className="mt-4 text-lg font-semibold text-heading">Đã xảy ra lỗi</h2>
      <p className="mt-2 max-w-md text-center text-sm text-muted">
        {error.message || 'Không thể tải trang này. Vui lòng thử lại.'}
      </p>
      {error.digest && (
        <p className="mt-1 text-xs text-faint">Mã lỗi: {error.digest}</p>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="ghost"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/')}
        >
          Về Dashboard
        </Button>
        <Button iconLeft="refresh-outline" onClick={reset}>
          Thử lại
        </Button>
      </div>
    </div>
  );
}
