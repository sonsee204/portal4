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

import { useCallback, useEffect, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  useDataTableSort,
  type DataTableSortDir,
  type UseDataTableSortOptions,
} from './useDataTableSort';

export interface UseDataTableSortUrlOptions extends UseDataTableSortOptions {
  allowedFields: readonly string[];
  /** Query param names — defaults: sort, dir */
  sortParam?: string;
  dirParam?: string;
  /** When false, skip URL read/write (e.g. nested tabs) */
  syncUrl?: boolean;
}

function parseDir(value: string | null): DataTableSortDir | null {
  if (value === 'asc' || value === 'desc') return value;
  return null;
}

function resolveFieldFromUrl(
  raw: string | null,
  allowedFields: readonly string[],
  fallback: string,
): string {
  if (raw && allowedFields.includes(raw)) return raw;
  return fallback;
}

export function useDataTableSortUrl({
  allowedFields,
  sortParam = 'sort',
  dirParam = 'dir',
  syncUrl = true,
  ...sortOptions
}: UseDataTableSortUrlOptions) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlField = useMemo(
    () =>
      resolveFieldFromUrl(
        searchParams.get(sortParam),
        allowedFields,
        sortOptions.defaultField,
      ),
    [allowedFields, searchParams, sortOptions.defaultField, sortParam],
  );

  const urlDir = useMemo(() => {
    const parsed = parseDir(searchParams.get(dirParam));
    if (parsed) return parsed;
    return sortOptions.defaultDir ?? (urlField === 'name' ? 'asc' : 'desc');
  }, [dirParam, searchParams, sortOptions.defaultDir, urlField]);

  const sort = useDataTableSort({
    ...sortOptions,
    defaultField: urlField,
    defaultDir: urlDir,
  });

  const writeUrl = useCallback(
    (field: string, dir: DataTableSortDir) => {
      if (!syncUrl) return;
      const params = new URLSearchParams(searchParams.toString());
      if (field === sortOptions.defaultField && dir === (sortOptions.defaultDir ?? 'desc')) {
        params.delete(sortParam);
        params.delete(dirParam);
      } else {
        params.set(sortParam, field);
        params.set(dirParam, dir);
      }
      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname, {
        scroll: false,
      });
    },
    [
      dirParam,
      pathname,
      router,
      searchParams,
      sortOptions.defaultDir,
      sortOptions.defaultField,
      sortParam,
      syncUrl,
    ],
  );

  useEffect(() => {
    if (!syncUrl) return;
    if (
      sort.sortField !== urlField ||
      sort.sortDir !== urlDir
    ) {
      sort.setSortField(urlField);
      sort.setSortDir(urlDir);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- sync URL → state once on navigation
  }, [urlField, urlDir, syncUrl]);

  const { sortField, sortDir, setSortField, setSortDir } = sort;

  const handleSort = useCallback(
    (field: string) => {
      const nextField = allowedFields.includes(field)
        ? field
        : sortOptions.defaultField;
      let nextDir: DataTableSortDir;
      if (sortField === nextField) {
        nextDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        nextDir = field === 'name' || field === 'orderCode' || field === 'category' || field === 'status' ? 'asc' : 'desc';
      }
      setSortField(nextField);
      setSortDir(nextDir);
      writeUrl(nextField, nextDir);
    },
    [
      allowedFields,
      sortDir,
      sortField,
      setSortDir,
      setSortField,
      sortOptions.defaultField,
      writeUrl,
    ],
  );

  return {
    ...sort,
    handleSort,
    allowedFields,
  };
}
