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

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';

/** @deprecated Use `ConnectionInfiniteScroll` from `@/components/molecules/ConnectionInfiniteScroll` instead. */
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

/** @deprecated Use `ConnectionInfiniteScroll` from `@/components/molecules/ConnectionInfiniteScroll` instead. */
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
        <p className="text-muted text-sm">
          Showing <span className="text-heading font-medium">{from}</span> to{' '}
          <span className="text-heading font-medium">{to}</span> of{' '}
          <span className="text-heading font-medium">{totalItems}</span> results
        </p>
      )}

      {/* Page buttons */}
      <div className="flex items-center gap-1">
        <button
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="border-surface-border hover:bg-surface-hover text-muted hover:text-heading flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
        >
          <IonIcon name="chevron-back-outline" size="sm" />
        </button>

        {pages.map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`e${i}`} className="text-faint px-1">
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
                  : 'border-surface-border hover:bg-surface-hover text-muted hover:text-heading border'
              )}
            >
              {p}
            </button>
          )
        )}

        <button
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="border-surface-border hover:bg-surface-hover text-muted hover:text-heading flex h-8 w-8 items-center justify-center rounded-lg border transition-colors disabled:opacity-40"
        >
          <IonIcon name="chevron-forward-outline" size="sm" />
        </button>
      </div>
    </div>
  );
}
