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

import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

export interface RichContentProps {
  content: string;
  className?: string;
  /** Compact styling for small previews */
  compact?: boolean;
}

export function RichContent({ content, className, compact }: RichContentProps) {
  if (!content?.trim()) return null;

  return (
    <div
      className={cn(
        'rich-content',
        compact
          ? 'text-muted text-xs [&_*]:text-inherit [&_p]:mb-0.5'
          : 'text-body [&_p]:mb-2 [&_p:last-child]:mb-0 [&_strong]:font-semibold',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
