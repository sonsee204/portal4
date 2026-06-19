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
import { IonIcon } from '@/components/atoms/IonIcon';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useInfiniteScrollTrigger } from '@/hooks/shared/useInfiniteScrollTrigger';
import { cn } from '@/lib/utils';
import {
  getInfiniteScrollStatusMessage,
  shouldShowInfiniteScrollFooter,
} from './connection-infinite-scroll.utils';

export interface ConnectionInfiniteScrollProps {
  hasNextPage: boolean;
  onLoadMore: () => void;
  loading?: boolean;
  loadingMore?: boolean;
  loadedCount?: number;
  totalCount?: number | null;
  error?: Error | null;
  onRetry?: () => void;
  className?: string;
  scrollRoot?: Element | null;
  /** Hide loaded/total status text (e.g. when DataTable shows count above). */
  showStatus?: boolean;
}

export function ConnectionInfiniteScroll({
  hasNextPage,
  onLoadMore,
  loading = false,
  loadingMore = false,
  loadedCount = 0,
  totalCount,
  error = null,
  onRetry,
  className,
  scrollRoot = null,
  showStatus = true,
}: ConnectionInfiniteScrollProps) {
  const bindSentinel = useInfiniteScrollTrigger({
    enabled: hasNextPage && !loading && !loadingMore && !error,
    onIntersect: onLoadMore,
    scrollRoot,
  });

  if (
    !shouldShowInfiniteScrollFooter(
      loadedCount,
      hasNextPage,
      loading,
      loadingMore
    )
  ) {
    return null;
  }

  const statusMessage = getInfiniteScrollStatusMessage(
    loadedCount,
    totalCount,
    hasNextPage
  );

  const hasFooterContent =
    loadingMore ||
    error != null ||
    (showStatus && Boolean(statusMessage)) ||
    (hasNextPage && !error);

  if (!hasFooterContent) {
    return null;
  }

  return (
    <div
      className={cn(
        'border-surface-border flex flex-col items-center gap-2 border-t px-4 py-4',
        className
      )}
      aria-live="polite"
    >
      {loadingMore ? (
        <div className="flex w-full max-w-xs flex-col items-center gap-2">
          <div className="flex w-full items-center justify-center gap-2">
            <IonIcon
              name="sync-outline"
              size="sm"
              className="text-primary animate-spin"
            />
            <span className="text-muted text-sm">Đang tải thêm...</span>
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-2 w-[80%] rounded-full" />
        </div>
      ) : null}

      {error ? (
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-muted text-sm">Không tải được thêm dữ liệu.</p>
          {onRetry ? (
            <Button variant="ghost" size="sm" onClick={onRetry}>
              Thử lại
            </Button>
          ) : null}
        </div>
      ) : null}

      {!loadingMore && !error && showStatus && statusMessage ? (
        <p className="text-muted text-xs">{statusMessage}</p>
      ) : null}

      {hasNextPage && !error ? (
        <div ref={bindSentinel} className="h-px w-full shrink-0" aria-hidden />
      ) : null}
    </div>
  );
}
