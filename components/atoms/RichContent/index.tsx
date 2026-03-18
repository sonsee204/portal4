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
