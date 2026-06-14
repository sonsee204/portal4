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

import type { MutableRefObject } from 'react';
import type { DragPointerEvent } from './types';

export function syncPointerFromDragEvent(
  pointerRef: MutableRefObject<{ x: number; y: number }>,
  event: DragPointerEvent,
) {
  const native = event.nativeEvent;
  if (
    native &&
    'clientX' in native &&
    'clientY' in native &&
    typeof native.clientX === 'number' &&
    typeof native.clientY === 'number'
  ) {
    pointerRef.current = { x: native.clientX, y: native.clientY };
    return;
  }

  const { x, y } = event.operation.position.current;
  if (Number.isFinite(x) && Number.isFinite(y)) {
    pointerRef.current = { x, y };
  }
}
