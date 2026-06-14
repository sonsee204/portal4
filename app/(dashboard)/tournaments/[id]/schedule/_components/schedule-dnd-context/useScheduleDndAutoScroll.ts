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

import { useEffect, type MutableRefObject } from 'react';

export function useScheduleDndAutoScroll(
  enabled: boolean,
  draggingMatchIdRef: MutableRefObject<string | null>,
  pointerRef: MutableRefObject<{ x: number; y: number }>,
) {
  useEffect(() => {
    if (!enabled) return;
    const onPointerMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };

      if (!draggingMatchIdRef.current) return;

      const scrollers = document.querySelectorAll<HTMLElement>(
        '[data-schedule-timeline-scroll]',
      );
      for (const el of scrollers) {
        const rect = el.getBoundingClientRect();
        const edge = 48;
        if (e.clientY < rect.top + edge) {
          el.scrollTop -= 12;
        } else if (e.clientY > rect.bottom - edge) {
          el.scrollTop += 12;
        }
      }
    };
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', onPointerMove);
  }, [enabled, draggingMatchIdRef, pointerRef]);
}
