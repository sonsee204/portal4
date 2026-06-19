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
import { Skeleton } from '@/components/atoms/Skeleton';
import { cn } from '@/lib/utils';

/** @deprecated Use `ConnectionInfiniteScroll` from `@/components/molecules/ConnectionInfiniteScroll` instead. */
export interface ConnectionLoadMoreProps {
  hasNextPage: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  loadedCount?: number;
  totalCount?: number | null;
  className?: string;
}

/** @deprecated Use `ConnectionInfiniteScroll` from `@/components/molecules/ConnectionInfiniteScroll` instead. */
export function ConnectionLoadMore({
  hasNextPage,
  onLoadMore,
  loading = false,
  loadedCount,
  totalCount,
  className,
}: ConnectionLoadMoreProps) {
  if (!hasNextPage && !loading) return null;

  return (
    <div className={cn('flex flex-col items-center gap-2 py-4', className)}>
      {loadedCount != null && totalCount != null && totalCount > 0 ? (
        <p className="text-muted text-xs">
          Đã tải {Math.min(loadedCount, totalCount)} / {totalCount}
        </p>
      ) : null}
      {loading ? (
        <Skeleton className="h-10 w-40 rounded-lg" />
      ) : (
        <Button
          variant="secondary"
          size="sm"
          iconRight="chevron-down-outline"
          onClick={onLoadMore}
        >
          Xem thêm
        </Button>
      )}
    </div>
  );
}
