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

const DEFAULT_ROOT_MARGIN = '240px';

export interface UseInfiniteScrollTriggerOptions {
  enabled: boolean;
  onIntersect: () => void;
  rootMargin?: string;
  scrollRoot?: Element | null;
}

function parseRootMarginPx(rootMargin: string): number {
  const match = rootMargin.match(/(-?\d+(?:\.\d+)?)px/);
  return match ? Number.parseFloat(match[1]) : 240;
}

function isSentinelNearScrollEnd(
  sentinel: HTMLElement,
  scrollRoot: Element | null,
  rootMargin: string,
): boolean {
  const margin = parseRootMarginPx(rootMargin);

  if (scrollRoot instanceof HTMLElement) {
    const distanceFromBottom =
      scrollRoot.scrollHeight - scrollRoot.scrollTop - scrollRoot.clientHeight;
    return distanceFromBottom <= margin;
  }

  const rect = sentinel.getBoundingClientRect();
  const viewportBottom =
    window.innerHeight || document.documentElement.clientHeight;
  return rect.top <= viewportBottom + margin;
}

function tryIntersect(
  sentinel: HTMLElement | null,
  scrollRoot: Element | null,
  rootMargin: string,
  enabled: boolean,
  onIntersect: () => void,
): void {
  if (!enabled || !sentinel) return;
  if (!isSentinelNearScrollEnd(sentinel, scrollRoot, rootMargin)) return;
  onIntersect();
}

/**
 * Fires `onIntersect` when the sentinel is near the scroll end.
 * Observer stays connected across fetchMore; `enabled` gates calls only.
 * Re-checks after each load so staying at the table bottom can chain pages.
 */
export function useInfiniteScrollTrigger({
  enabled,
  onIntersect,
  rootMargin = DEFAULT_ROOT_MARGIN,
  scrollRoot = null,
}: UseInfiniteScrollTriggerOptions) {
  const sentinelNodeRef = useRef<HTMLDivElement | null>(null);
  const [sentinelVersion, setSentinelVersion] = useState(0);
  const onIntersectRef = useRef(onIntersect);
  const enabledRef = useRef(enabled);
  const wasEnabledRef = useRef(enabled);

  const bindSentinel = useCallback((node: HTMLDivElement | null) => {
    sentinelNodeRef.current = node;
    setSentinelVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    onIntersectRef.current = onIntersect;
  }, [onIntersect]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  useEffect(() => {
    const sentinel = sentinelNodeRef.current;
    if (!sentinel) return;

    const handleIntersect = () => {
      tryIntersect(
        sentinelNodeRef.current,
        scrollRoot,
        rootMargin,
        enabledRef.current,
        () => onIntersectRef.current(),
      );
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          handleIntersect();
        }
      },
      {
        root: scrollRoot,
        rootMargin,
        threshold: 0,
      },
    );

    observer.observe(sentinel);

    const scrollTarget = scrollRoot ?? window;
    scrollTarget.addEventListener('scroll', handleIntersect, { passive: true });

    return () => {
      observer.disconnect();
      scrollTarget.removeEventListener('scroll', handleIntersect);
    };
  }, [rootMargin, scrollRoot, sentinelVersion]);

  useEffect(() => {
    const becameEnabled = enabled && !wasEnabledRef.current;
    wasEnabledRef.current = enabled;
    if (!becameEnabled) return;

    const frame = requestAnimationFrame(() => {
      tryIntersect(
        sentinelNodeRef.current,
        scrollRoot,
        rootMargin,
        enabledRef.current,
        () => onIntersectRef.current(),
      );
    });

    return () => cancelAnimationFrame(frame);
  }, [enabled, rootMargin, scrollRoot]);

  return bindSentinel;
}
