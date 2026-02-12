'use client';

import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import { EmptyState } from '@/components/molecules/EmptyState';

/* ------------------------------------------------------------------ */
/* Column Definition                                                   */
/* ------------------------------------------------------------------ */

export interface DataTableColumn<T> {
  key: string;
  header: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  render: (row: T, index: number) => React.ReactNode;
}

/* ------------------------------------------------------------------ */
/* Props                                                               */
/* ------------------------------------------------------------------ */

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
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
  sortKey,
  sortDir,
  onSort,
  emptyTitle = 'No data',
  emptyDescription,
  className,
}: DataTableProps<T>) {
  return (
    <div
      className={cn(
        'glass-panel border-surface-border overflow-hidden rounded-xl border',
        className
      )}
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-white/5">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    'px-6 py-4 text-xs font-semibold tracking-wider text-slate-400 uppercase',
                    col.align === 'center' && 'text-center',
                    col.align === 'right' && 'text-right'
                  )}
                >
                  {col.sortable ? (
                    <button
                      type="button"
                      className="inline-flex items-center gap-1 transition-colors hover:text-white"
                      onClick={() => onSort?.(col.key)}
                    >
                      {col.header}
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
                    col.header
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-surface-border divide-y">
            {data.map((row, i) => (
              <tr
                key={i}
                className="group transition-colors hover:bg-white/[0.03]"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-6 py-4',
                      col.align === 'center' && 'text-center',
                      col.align === 'right' && 'text-right'
                    )}
                  >
                    {col.render(row, i)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.length === 0 && (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      )}
    </div>
  );
}
