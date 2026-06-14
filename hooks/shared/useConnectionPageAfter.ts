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

import { useCallback, useEffect, useRef, useState } from 'react';

type PageInfoSlice = {
  endCursor?: string | null;
  hasNextPage: boolean;
};

/**
 * Resolves Relay `after` cursor for numbered admin pages while preserving
 * existing `{ page, limit }` UI state. Caches endCursor per page boundary.
 */
export function useConnectionPageAfter(options: {
  page: number;
  first: number;
  resetKey: string;
  prefetchPage: (
    after: string | null,
    first: number,
  ) => Promise<PageInfoSlice>;
}) {
  const cursorsRef = useRef<Map<number, string | null>>(new Map([[0, null]]));
  const [after, setAfter] = useState<string | null>(null);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    cursorsRef.current = new Map([[0, null]]);
  }, [options.resetKey]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const { page, first, prefetchPage } = options;
      if (page <= 1) {
        setAfter(null);
        setResolving(false);
        return;
      }

      setResolving(true);
      try {
        let currentPage = 1;
        while (currentPage < page) {
          if (cursorsRef.current.has(currentPage)) {
            currentPage += 1;
            continue;
          }

          const startAfter = cursorsRef.current.get(currentPage - 1) ?? null;
          const info = await prefetchPage(startAfter, first);
          cursorsRef.current.set(currentPage, info.endCursor ?? null);
          currentPage += 1;
          if (!info.hasNextPage) break;
        }

        if (!cancelled) {
          setAfter(cursorsRef.current.get(page - 1) ?? null);
        }
      } finally {
        if (!cancelled) setResolving(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [options.page, options.first, options.resetKey, options.prefetchPage]);

  const rememberEndCursor = useCallback(
    (pageNum: number, endCursor?: string | null) => {
      cursorsRef.current.set(pageNum, endCursor ?? null);
    },
    [],
  );

  return { after, resolving, rememberEndCursor, first: options.first };
}
