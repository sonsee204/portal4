'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  /** Total number of items */
  totalItems?: number;
  /** Items per page */
  pageSize?: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  className,
}: PaginationProps) {
  // Generate visible page numbers (show max 5 around current)
  const pages: (number | 'ellipsis')[] = [];
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (pages[pages.length - 1] !== 'ellipsis') {
      pages.push('ellipsis');
    }
  }

  const from = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : null;
  const to =
    totalItems && pageSize
      ? Math.min(currentPage * pageSize, totalItems)
      : null;

  return (
    <div
      className={cn(
        'border-surface-border flex items-center justify-between border-t px-6 py-4',
        className
      )}
    >
      {/* Info text */}
      {totalItems != null && (
        <p className="text-sm text-slate-400">
          Showing <span className="font-medium text-white">{from}</span> to{' '}
          <span className="font-medium text-white">{to}</span> of{' '}
          <span className="font-medium text-white">{totalItems}</span> results
        </p>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-surface-border hover:bg-surface-hover flex h-8 w-8 items-center justify-center rounded-lg border text-slate-400 transition-colors hover:text-white disabled:opacity-40"
        >
          <IonIcon name="chevron-back-outline" size="sm" />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="px-1 text-slate-500">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
                p === currentPage
                  ? 'bg-primary text-white'
                  : 'border-surface-border hover:bg-surface-hover border text-slate-400 hover:text-white'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-surface-border hover:bg-surface-hover flex h-8 w-8 items-center justify-center rounded-lg border text-slate-400 transition-colors hover:text-white disabled:opacity-40"
        >
          <IonIcon name="chevron-forward-outline" size="sm" />
        </button>
      </div>
    </div>
  );
}
