'use client';

import { useEffect } from 'react';
import { Button } from '@/components/atoms/Button';
import { ERRORS, COMMON } from '@/lib/strings';

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
      <h1 className="text-heading text-xl font-bold">{ERRORS.ERROR_TITLE}</h1>
      <p className="text-muted mt-2 text-center">{ERRORS.GENERIC}</p>
      <Button className="mt-6" onClick={reset}>
        {COMMON.RETRY}
      </Button>
    </div>
  );
}
