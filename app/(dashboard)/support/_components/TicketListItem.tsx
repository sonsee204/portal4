'use client';

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import type { SupportTicket, TicketStatus } from '@/types/mock';

const statusVariant: Record<
  TicketStatus,
  'danger' | 'warning' | 'success' | 'neutral'
> = {
  new: 'danger',
  open: 'warning',
  replied: 'success',
  closed: 'neutral',
};

const statusLabel: Record<TicketStatus, string> = {
  new: 'Mới',
  open: 'Đang mở',
  replied: 'Đã trả lời',
  closed: 'Đã đóng',
};

export function TicketListItem({
  ticket,
  active,
  onClick,
}: {
  ticket: SupportTicket;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl p-3 text-left transition-colors',
        active
          ? 'bg-primary/10 border-primary/30 border'
          : 'hover:bg-surface-hover border border-transparent'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar fallback={ticket.userName[0]} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                'truncate text-sm',
                ticket.unread ? 'font-bold text-heading' : 'text-body'
              )}
            >
              {ticket.subject}
            </p>
            {ticket.unread && (
              <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
            )}
          </div>
          <p className="mt-0.5 text-xs text-faint">{ticket.userName}</p>
          <p className="mt-1 truncate text-xs text-muted">
            {ticket.lastMessage}
          </p>
          <div className="mt-1.5 flex items-center justify-between">
            <Badge
              variant={statusVariant[ticket.status]}
              className="text-[10px]"
            >
              {statusLabel[ticket.status]}
            </Badge>
            <span className="text-[10px] text-faint">
              {ticket.updatedAt}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
