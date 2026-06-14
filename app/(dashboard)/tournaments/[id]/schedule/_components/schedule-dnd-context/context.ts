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

import { createContext, useContext } from 'react';
import type { ScheduleDndContextValue } from './types';

const ScheduleDndCtx = createContext<ScheduleDndContextValue>({
  enabled: false,
  registerCourtColumn: () => {},
  preview: null,
});

export function useScheduleDnd() {
  return useContext(ScheduleDndCtx);
}

export { ScheduleDndCtx };
