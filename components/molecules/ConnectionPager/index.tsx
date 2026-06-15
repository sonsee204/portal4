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

import { Button } from '@/components/atoms/Button';
import { cn } from '@/lib/utils';
import { formatConnectionRange } from './connection-pager.utils';

export interface ConnectionPagerProps {
  loadedCount: number;
  totalCount?: number | null;
  hasNextPage: boolean;
  hasPreviousPage?: boolean;
  onNext?: () => void;
  onPrevious?: () => void;
  loading?: boolean;
  className?: string;
}

export function ConnectionPager({
  loadedCount,
  totalCount,
  hasNextPage,
  hasPreviousPage = false,
  onNext,
  onPrevious,
  loading = false,
  className,
}: ConnectionPagerProps) {
  if (loadedCount <= 0 && !hasNextPage) return null;

  return (
    <div
      className={cn(
        'border-surface-border bg-surface flex flex-col items-center justify-between gap-3 rounded-xl border px-4 py-3 sm:flex-row',
        className,
      )}
    >
      <p className="text-muted text-sm">{formatConnectionRange(loadedCount, totalCount)}</p>
      <div className="flex items-center gap-2">
        {onPrevious ? (
          <Button
            variant="ghost"
            size="sm"
            iconLeft="chevron-back-outline"
            disabled={!hasPreviousPage || loading}
            onClick={onPrevious}
          >
            Trước
          </Button>
        ) : null}
        {onNext ? (
          <Button
            variant="secondary"
            size="sm"
            iconRight="chevron-forward-outline"
            disabled={!hasNextPage || loading}
            onClick={onNext}
          >
            Tiếp
          </Button>
        ) : null}
      </div>
    </div>
  );
}
