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

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { EmptyState } from '@/components/molecules/EmptyState';
import { SortableTableHeader } from '@/components/molecules/SortableTableHeader';
import type { DataTableSortDir } from '@/hooks/shared/useDataTableSort';
import {
  ConnectionInfiniteScroll,
  type ConnectionInfiniteScrollProps,
} from '@/components/molecules/ConnectionInfiniteScroll';
import { formatConnectionRange } from '@/components/molecules/ConnectionPager/connection-pager.utils';
import { getInfiniteScrollStatusMessage } from '@/components/molecules/ConnectionInfiniteScroll/connection-infinite-scroll.utils';

/* ------------------------------------------------------------------ */
/* Column Definition                                                   */
/* ------------------------------------------------------------------ */

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  /** Backend sort field when different from column key */
  sortField?: string;
  align?: 'left' | 'center' | 'right';
}

/** Standard actions column — always last, right-aligned. */
export const DATA_TABLE_ACTIONS_COLUMN: DataTableColumn = {
  key: 'actions',
  label: 'Thao tác',
  align: 'right',
};

/** Compact actions column (no header label). */
export const DATA_TABLE_ACTIONS_COLUMN_MINIMAL: DataTableColumn = {
  key: 'actions',
  label: '',
  align: 'right',
};

export const DATA_TABLE_ACTIONS_CELL_CLASS = 'px-4 py-3 text-right';

export const DATA_TABLE_ACTIONS_INNER_CLASS =
  'flex flex-wrap items-center justify-end gap-0.5';

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export interface DataTableProps<T> {
  columns: DataTableColumn[];
  data: T[];
  /** Render custom row. If omitted, falls back to auto-rendering keys */
  renderRow: (row: T, index: number) => React.ReactNode;
  /** Currently sorted column key */
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  onSort?: (key: string) => void;
  emptyTitle?: string;
  emptyDescription?: string;
  /** Keep column headers visible while scrolling the table body */
  stickyHeader?: boolean;
  /** Infinite scroll footer — replaces ConnectionPager at table bottom */
  infiniteScroll?: ConnectionInfiniteScrollProps;
  /** Total items (non-paginated tables). Defaults to data.length when omitted. */
  totalCount?: number | null;
  /** Disable sort headers while refetching */
  sortLoading?: boolean;
  className?: string;
}

function getDataTableCountLabel(
  loadedCount: number,
  totalCount?: number | null,
  hasNextPage?: boolean
): string | null {
  if (loadedCount <= 0 && (totalCount == null || totalCount <= 0)) {
    return null;
  }

  if (hasNextPage) {
    return formatConnectionRange(loadedCount, totalCount);
  }

  if (totalCount != null && totalCount > 0 && loadedCount >= totalCount) {
    return `Hiển thị ${loadedCount} / ${totalCount}`;
  }

  return (
    getInfiniteScrollStatusMessage(loadedCount, totalCount, hasNextPage) || null
  );
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

const STICKY_HEADER_CELL_CLASS =
  'border-surface-border bg-white text-faint sticky top-0 z-10 border-b shadow-sm dark:bg-[var(--surface)]';

export function DataTable<T>({
  columns,
  data,
  renderRow,
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No data',
  emptyDescription,
  stickyHeader = false,
  infiniteScroll,
  totalCount: totalCountProp,
  sortLoading = false,
  className,
}: DataTableProps<T>) {
  const [scrollRoot, setScrollRoot] = useState<HTMLDivElement | null>(null);
  const loadedCount = infiniteScroll?.loadedCount ?? data.length;
  const totalCount =
    infiniteScroll?.totalCount ??
    totalCountProp ??
    (!infiniteScroll ? data.length : null);
  const countLabel = getDataTableCountLabel(
    loadedCount,
    totalCount,
    infiniteScroll?.hasNextPage
  );

  const infiniteScrollFooter = infiniteScroll ? (
    <ConnectionInfiniteScroll
      {...infiniteScroll}
      scrollRoot={stickyHeader ? scrollRoot : infiniteScroll.scrollRoot}
      showStatus={false}
    />
  ) : null;

  const countBar = countLabel ? (
    <p className="text-muted border-surface-border border-t px-4 py-2 text-left text-xs">
      {countLabel}
    </p>
  ) : null;

  const table = (
    <table
      className={cn(
        'w-full text-left text-sm',
        stickyHeader ? 'border-separate border-spacing-0' : 'border-collapse'
      )}
    >
      <thead>
        <tr>
          {columns.map((col) => (
            <th
              key={col.key}
              className={cn(
                'text-faint text-xs font-semibold tracking-wider uppercase',
                col.sortable ? 'p-0' : 'px-4 py-3',
                stickyHeader ? STICKY_HEADER_CELL_CLASS : 'bg-overlay-faint',
                !col.sortable && col.align === 'center' && 'text-center',
                !col.sortable && col.align === 'right' && 'text-right'
              )}
              aria-sort={
                col.sortable && sortKey === (col.sortField ?? col.key)
                  ? sortDir === 'asc'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              {col.sortable ? (
                <SortableTableHeader
                  label={col.label}
                  columnKey={col.key}
                  sortField={col.sortField}
                  sortKey={sortKey}
                  sortDir={sortDir as DataTableSortDir | undefined}
                  onSort={onSort}
                  align={col.align}
                  loading={sortLoading}
                />
              ) : (
                col.label
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{data.map((row, i) => renderRow(row, i))}</tbody>
    </table>
  );

  if (stickyHeader) {
    return (
      <div className="border-surface-border overflow-hidden rounded-lg border">
        <div ref={setScrollRoot} className={cn('overflow-auto', className)}>
          {table}
          {data.length === 0 && (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}
          {infiniteScrollFooter}
        </div>
        {countBar}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">{table}</div>

      {data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
      {infiniteScrollFooter}
      {countBar}
    </div>
  );
}
