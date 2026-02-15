'use client';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import type { ChatMessage as ChatMessageType } from '@/types/mock';

export function ChatMessage({ message }: { message: ChatMessageType }) {
  if (message.sender === 'system') {
    return (
      <div className="flex justify-center py-2">
        <span className="bg-surface rounded-full px-3 py-1 text-[10px] text-faint">
          {message.content}
        </span>
      </div>
    );
  }

  const isAdmin = message.sender === 'admin';

  return (
    <div className={cn('flex gap-3', isAdmin && 'flex-row-reverse')}>
      <Avatar
        fallback={isAdmin ? 'AD' : 'U'}
        size="sm"
        status={isAdmin ? 'online' : undefined}
      />
      <div className={cn('max-w-[70%]', isAdmin && 'text-right')}>
        <div
          className={cn(
            'inline-block rounded-2xl px-4 py-2.5 text-sm',
            isAdmin
              ? 'bg-primary rounded-tr-sm text-heading'
              : 'bg-surface border-surface-border rounded-tl-sm border text-body'
          )}
        >
          {message.content}
        </div>
        <p className="mt-1 text-[10px] text-faint">{message.time}</p>
      </div>
    </div>
  );
}
