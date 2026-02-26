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
  className?: string;
}

/* ------------------------------------------------------------------ */
/* Component                                                           */
/* ------------------------------------------------------------------ */

export function DataTable<T>({
  columns,
  data,
  renderRow,
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No data',
  emptyDescription,
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-overlay-faint">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'text-faint px-4 py-3 text-xs font-semibold tracking-wider uppercase',
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
      </div>

      {data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
