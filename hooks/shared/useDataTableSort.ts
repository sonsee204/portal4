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

import { useCallback, useState } from 'react';

export type DataTableSortDir = 'asc' | 'desc';

const ASC_DEFAULT_FIELDS = new Set([
  'name',
  'orderCode',
  'fullName',
  'venueName',
  'category',
  'status',
]);

function defaultDirForField(field: string): DataTableSortDir {
  return ASC_DEFAULT_FIELDS.has(field) ? 'asc' : 'desc';
}

export interface UseDataTableSortOptions {
  defaultField: string;
  defaultDir?: DataTableSortDir;
}

export function useDataTableSort({
  defaultField,
  defaultDir,
}: UseDataTableSortOptions) {
  const [sortField, setSortField] = useState(defaultField);
  const [sortDir, setSortDir] = useState<DataTableSortDir>(
    defaultDir ?? defaultDirForField(defaultField),
  );

  const handleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDir((current) => (current === 'asc' ? 'desc' : 'asc'));
        return;
      }
      setSortField(field);
      setSortDir(defaultDirForField(field));
    },
    [sortField],
  );

  const resetSort = useCallback(() => {
    setSortField(defaultField);
    setSortDir(defaultDir ?? defaultDirForField(defaultField));
  }, [defaultDir, defaultField]);

  return {
    sortField,
    sortDir,
    handleSort,
    resetSort,
    setSortField,
    setSortDir,
  };
}

export function toSortByOrder(
  sortField: string,
  sortDir: DataTableSortDir,
): { sortBy: string; sortOrder: DataTableSortDir } {
  return { sortBy: sortField, sortOrder: sortDir };
}

export function toFinanceSortVariables(
  sortField: string,
  sortDir: DataTableSortDir,
): { field: string; order: DataTableSortDir } {
  return { field: sortField, order: sortDir };
}

export function sortClientRows<T>(
  rows: readonly T[],
  sortField: string,
  sortDir: DataTableSortDir,
  getValue: (row: T, field: string) => string | number | null | undefined,
): T[] {
  const sorted = [...rows];
  sorted.sort((left, right) => {
    const a = getValue(left, sortField);
    const b = getValue(right, sortField);
    if (a == null && b == null) return 0;
    if (a == null) return 1;
    if (b == null) return -1;
    const cmp =
      typeof a === 'number' && typeof b === 'number'
        ? a - b
        : String(a).localeCompare(String(b), 'vi', { numeric: true });
    return sortDir === 'asc' ? cmp : -cmp;
  });
  return sorted;
}
