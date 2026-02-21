'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ERRORS, COMMON } from '@/lib/strings';

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
      <h2 className="text-heading mt-4 text-lg font-semibold">
        {ERRORS.ERROR_TITLE}
      </h2>
      <p className="text-muted mt-2 max-w-md text-center text-sm">
        {error.message || ERRORS.PAGE_LOAD}
      </p>
      {error.digest && (
        <p className="text-faint mt-1 text-xs">
          {ERRORS.ERROR_CODE_LABEL} {error.digest}
        </p>
      )}
      <div className="mt-6 flex items-center gap-3">
        <Button
          variant="ghost"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/')}
        >
          {ERRORS.BACK_TO_DASHBOARD}
        </Button>
        <Button iconLeft="refresh-outline" onClick={reset}>
          {COMMON.RETRY}
        </Button>
      </div>
    </div>
  );
}
