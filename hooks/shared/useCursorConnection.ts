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

import { useCallback, useRef, useState } from 'react';

import { CURSOR_PAGE_MAX, DEFAULT_CONNECTION_FIRST } from '@/lib/constants/pagination';

export interface CursorPageInput {
  first?: number | undefined;
  after?: string | null | undefined;
}

export type FetchAllConnectionPagesStoppedReason =
  | 'complete'
  | 'cursor_stuck'
  | 'max_pages'
  | 'empty_page';

export interface FetchAllConnectionPagesResult<TNode> {
  nodes: TNode[];
  stoppedReason: FetchAllConnectionPagesStoppedReason;
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
  const loadingMoreRef = useRef(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const { hasNextPage, endCursor, fetchMore, buildVariables, mergeResults } =
    config;

  const loadMore = useCallback(async () => {
    if (!hasNextPage || !endCursor || loadingMoreRef.current) return;
    loadingMoreRef.current = true;
    setIsLoadingMore(true);
    try {
      await fetchMore({
        variables: buildVariables(endCursor),
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return mergeResults(prev, fetchMoreResult);
        },
      });
    } finally {
      loadingMoreRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasNextPage, endCursor, fetchMore, buildVariables, mergeResults]);

  return { loadMore, isLoadingMore };
}

const FETCH_ALL_PAGES_ABSOLUTE_MAX = 500;

function resolveExpectedTotal(config: {
  expectedTotal?: number;
  getExpectedTotal?: () => number | undefined;
}): number | undefined {
  if (config.expectedTotal != null) return config.expectedTotal;
  return config.getExpectedTotal?.();
}

/** Fetch all pages via repeated client.query until hasNextPage is false. */
export async function fetchAllConnectionPages<TNode>(config: {
  fetchPage: (after?: string | null) => Promise<{
    edges: Array<{ cursor: string; node: TNode }>;
    pageInfo: { hasNextPage: boolean; endCursor?: string | null };
  }>;
  /** Optional cap — e.g. ceil(totalCount / pageSize) + 1 once totalCount is known. */
  getMaxPages?: () => number;
  expectedTotal?: number;
  getExpectedTotal?: () => number | undefined;
}): Promise<FetchAllConnectionPagesResult<TNode>> {
  const all: TNode[] = [];
  let after: string | null | undefined;
  let hasNextPage = true;
  let pageIndex = 0;
  const seenEndCursors = new Set<string>();
  let stoppedReason: FetchAllConnectionPagesStoppedReason = 'complete';

  const needsMore = () => {
    const expected = resolveExpectedTotal(config);
    return expected != null && all.length < expected;
  };

  while (hasNextPage || needsMore()) {
    pageIndex += 1;
    const maxPages = config.getMaxPages?.() ?? FETCH_ALL_PAGES_ABSOLUTE_MAX;
    if (pageIndex > maxPages) {
      stoppedReason = 'max_pages';
      break;
    }

    const requestAfter = after ?? null;
    const page = await config.fetchPage(requestAfter);
    const nodes = connectionNodes(page.edges);
    if (nodes.length === 0) {
      stoppedReason = 'empty_page';
      break;
    }

    hasNextPage = page.pageInfo.hasNextPage;
    const nextCursor = page.pageInfo.endCursor ?? null;

    if (requestAfter !== null && nextCursor === requestAfter) {
      stoppedReason = 'cursor_stuck';
      break;
    }

    all.push(...nodes);

    const expected = resolveExpectedTotal(config);
    const reachedExpected =
      expected == null || all.length >= expected;

    if (reachedExpected && !hasNextPage) {
      stoppedReason = 'complete';
      break;
    }

    if (!nextCursor) {
      stoppedReason = needsMore() ? 'cursor_stuck' : 'complete';
      break;
    }

    if (seenEndCursors.has(nextCursor)) {
      stoppedReason = 'cursor_stuck';
      break;
    }
    seenEndCursors.add(nextCursor);
    after = nextCursor;

    if (!hasNextPage && !reachedExpected) {
      continue;
    }

    if (!hasNextPage) {
      stoppedReason = 'complete';
      break;
    }
  }

  if (stoppedReason === 'complete' && needsMore()) {
    stoppedReason = 'cursor_stuck';
  }

  return { nodes: all, stoppedReason };
}
