'use client';

import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Textarea } from '@/components/atoms/Textarea';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { SupportTicket } from '@/types/mock';

export function UserDetailPanel({ ticket }: { ticket: SupportTicket }) {
  return (
    <GlassPanel card className="space-y-5">
      {/* User info */}
      <div className="flex flex-col items-center text-center">
        <Avatar fallback={ticket.userName[0]} status="online" />
        <p className="mt-2 text-sm font-bold text-heading">{ticket.userName}</p>
        <Badge variant="info" className="mt-1">
          Premium Member
        </Badge>
      </div>

      {/* Contact details */}
      <div className="border-surface-border space-y-3 border-t pt-4">
        <p className="text-xs font-bold tracking-wider text-faint uppercase">
          Thông tin liên hệ
        </p>
        <div className="flex items-center gap-2 text-xs text-muted">
          <IonIcon name="mail-outline" size="sm" />
          <span>
            {ticket.userName.toLowerCase().replace(' ', '.')}@email.com
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted">
          <IonIcon name="call-outline" size="sm" />
          <span>0912-xxx-xxx</span>
        </div>
      </div>

      {/* Ticket history */}
      <div className="border-surface-border space-y-2 border-t pt-4">
        <p className="text-xs font-bold tracking-wider text-faint uppercase">
          Lịch sử ticket
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Tổng ticket</span>
          <span className="font-medium text-heading">7</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Đã giải quyết</span>
          <span className="font-medium text-emerald-400">5</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Thời gian TB</span>
          <span className="font-medium text-heading">2.5 giờ</span>
        </div>
      </div>

      {/* Internal notes */}
      <div className="border-surface-border space-y-2 border-t pt-4">
        <p className="text-xs font-bold tracking-wider text-faint uppercase">
          Ghi chú nội bộ
        </p>
        <Textarea placeholder="Ghi chú cho admin..." rows={3} />
      </div>
    </GlassPanel>
  );
}
