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

import { useCallback, useRef } from 'react';

import { CURSOR_PAGE_MAX, DEFAULT_CONNECTION_FIRST } from '@/lib/constants/pagination';

export interface CursorPageInput {
  first?: number | undefined;
  after?: string | null | undefined;
}

/** Legacy offset call sites — map page/limit to cursor `first`. */
export type LegacyPagePagination = {
  first?: number;
  after?: string | null;
  page?: number;
  limit?: number;
};

export function connectionNodes<T>(
  edges: Array<{ node: T }> | null | undefined,
): T[] {
  return edges?.map((e) => e.node) ?? [];
}

export function mergeConnectionEdges<TNode>(
  prevEdges: Array<{ cursor: string; node: TNode }>,
  nextEdges: Array<{ cursor: string; node: TNode }>,
): Array<{ cursor: string; node: TNode }> {
  return [...prevEdges, ...nextEdges];
}

export function resolveConnectionFirst(
  pagination?: LegacyPagePagination,
  defaultFirst = DEFAULT_CONNECTION_FIRST,
): number {
  const requested =
    pagination?.first != null
      ? pagination.first
      : pagination?.limit != null
        ? pagination.limit
        : defaultFirst;
  return Math.min(requested, CURSOR_PAGE_MAX);
}

export function totalPagesFromCount(totalCount: number, pageSize: number): number {
  if (pageSize <= 0) return 1;
  return Math.max(1, Math.ceil(totalCount / pageSize));
}

export function useConnectionLoadMore<TData>(config: {
  data: TData | undefined;
  hasNextPage: boolean;
  endCursor: string | null | undefined;
  fetchMore: (options: {
    variables: Record<string, unknown>;
    updateQuery: (
      prev: TData,
      ctx: { fetchMoreResult?: TData },
    ) => TData;
  }) => Promise<unknown>;
  buildVariables: (after: string) => Record<string, unknown>;
  mergeResults: (prev: TData, next: TData) => TData;
}) {
  const isLoadingMoreRef = useRef(false);
  const { hasNextPage, endCursor, fetchMore, buildVariables, mergeResults } =
    config;

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !endCursor || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    try {
      await fetchMore({
        variables: buildVariables(endCursor),
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return mergeResults(prev, fetchMoreResult);
        },
      });
    } finally {
      isLoadingMoreRef.current = false;
    }
  }, [hasNextPage, endCursor, fetchMore, buildVariables, mergeResults]);

  return { loadMore, isLoadingMore: isLoadingMoreRef };
}

const FETCH_ALL_PAGES_ABSOLUTE_MAX = 500;

/** Fetch all pages via repeated client.query until hasNextPage is false. */
export async function fetchAllConnectionPages<TNode>(config: {
  fetchPage: (after?: string | null) => Promise<{
    edges: Array<{ cursor: string; node: TNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  }>;
  /** Optional cap — e.g. ceil(totalCount / pageSize) + 1 once totalCount is known. */
  getMaxPages?: () => number;
}): Promise<TNode[]> {
  const all: TNode[] = [];
  let after: string | null | undefined;
  let hasNextPage = true;
  let pageIndex = 0;
  const seenEndCursors = new Set<string>();

  while (hasNextPage) {
    pageIndex += 1;
    const maxPages = config.getMaxPages?.() ?? FETCH_ALL_PAGES_ABSOLUTE_MAX;
    if (pageIndex > maxPages) break;

    const requestAfter = after ?? null;
    const page = await config.fetchPage(requestAfter);
    const nodes = connectionNodes(page.edges);
    if (nodes.length === 0) break;

    hasNextPage = page.pageInfo.hasNextPage;
    const nextCursor = page.pageInfo.endCursor ?? null;

    if (requestAfter !== null && nextCursor === requestAfter) break;

    all.push(...nodes);

    if (!hasNextPage) break;
    if (!nextCursor) break;
    if (seenEndCursors.has(nextCursor)) break;
    seenEndCursors.add(nextCursor);
    after = nextCursor;
  }

  return all;
}
