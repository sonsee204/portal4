'use client';

import type { ErrorLike } from '@apollo/client';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Skeleton } from '@/components/atoms/Skeleton';
import { formatGraphQLError } from '@/lib/errors/format-graphql-error';

interface QueryStateProps {
  /** Whether the query is currently loading */
  loading: boolean;
  /** Apollo error from useQuery */
  error?: ErrorLike;
  /** Whether the data set is empty (after loading) */
  empty?: boolean;
  /** Callback to retry the query */
  onRetry?: () => void;
  /** Custom message for the empty state */
  emptyMessage?: string;
  /** Custom message for the empty state icon */
  emptyIcon?: string;
  /** Number of skeleton rows to show while loading */
  skeletonCount?: number;
  /** Content to render when data is available */
  children: React.ReactNode;
}

/**
 * Reusable component to handle loading, error, and empty states for useQuery results.
 * Renders children only when data is available and not empty.
 */
export function QueryState({
  loading,
  error,
  empty,
  onRetry,
  emptyMessage = 'Không có dữ liệu',
  emptyIcon = 'file-tray-outline',
  skeletonCount = 5,
  children,
}: QueryStateProps) {
  // Loading state
  if (loading && !error) {
    return (
      <div className="space-y-3">
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 py-16">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-500/10">
          <IonIcon
            name="alert-circle-outline"
            size="md"
            className="text-red-400"
          />
        </div>
        <p className="mt-3 text-sm font-medium text-red-400">Đã xảy ra lỗi</p>
        <p className="text-muted mt-1 max-w-sm text-center text-xs">
          {formatGraphQLError(error)}
        </p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            className="mt-4"
            onClick={onRetry}
          >
            Thử lại
          </Button>
        )}
      </div>
    );
  }

  // Empty state
  if (empty) {
    return (
      <div className="border-surface-border flex flex-col items-center justify-center rounded-xl border border-dashed py-16">
        <div className="bg-surface-hover flex h-12 w-12 items-center justify-center rounded-full">
          <IonIcon name={emptyIcon} size="md" className="text-muted" />
        </div>
        <p className="text-muted mt-3 text-sm">{emptyMessage}</p>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            className="mt-3"
            onClick={onRetry}
          >
            Tải lại
          </Button>
        )}
      </div>
    );
  }

  // Data available
  return <>{children}</>;
}
