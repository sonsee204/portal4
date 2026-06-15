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

import { cn } from '@/lib/utils';

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  /** Use the stronger card variant with tinted border */
  card?: boolean;
}

export function GlassPanel({ children, className, card }: GlassPanelProps) {
  return (
    <div
      className={cn(
        card ? 'glass-card p-6' : 'glass-panel',
        'rounded-xl',
        className
      )}
    >
      {children}
    </div>
  );
}
