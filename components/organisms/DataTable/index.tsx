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
import { EmptyState } from '@/components/molecules/EmptyState';

/* ------------------------------------------------------------------ */
/* Column Definition                                                   */
/* ------------------------------------------------------------------ */

export interface DataTableColumn {
  key: string;
  label: string;
  sortable?: boolean;
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
  className?: string;
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
  className,
}: DataTableProps<T>) {
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
                'text-faint px-4 py-3 text-xs font-semibold tracking-wider uppercase',
                stickyHeader ? STICKY_HEADER_CELL_CLASS : 'bg-overlay-faint',
                col.align === 'center' && 'text-center',
                col.align === 'right' && 'text-right'
              )}
            >
              {col.sortable ? (
                <button
                  type="button"
                  className="hover:text-heading inline-flex items-center gap-1 transition-colors"
                  onClick={() => onSort?.(col.key)}
                >
                  {col.label}
                  <IonIcon
                    name={
                      sortKey === col.key
                        ? sortDir === 'asc'
                          ? 'caret-up-outline'
                          : 'caret-down-outline'
                        : 'swap-vertical-outline'
                    }
                    size="xs"
                  />
                </button>
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
      <div
        className={cn(
          'border-surface-border overflow-auto rounded-lg border',
          className
        )}
      >
        {table}
        {data.length === 0 && (
          <EmptyState title={emptyTitle} description={emptyDescription} />
        )}
      </div>
    );
  }

  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">{table}</div>

      {data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
