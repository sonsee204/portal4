'use client';

import { useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { IconButton } from '@/components/atoms/IconButton';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { ChatMessage } from './ChatMessage';
import type {
  SupportTicket,
  ChatMessage as ChatMessageType,
} from '@/types/portal';

export function ChatPanel({
  ticket,
  messages,
}: {
  ticket: SupportTicket;
  messages: ChatMessageType[];
}) {
  const [msg, setMsg] = useState('');

  return (
    <GlassPanel card className="flex h-full flex-col">
      {/* Chat header */}
      <div className="border-surface-border flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-sm font-bold text-white">{ticket.subject}</h3>
          <p className="text-xs text-slate-500">{ticket.userName}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="warning">Đang xử lý</Badge>
          <IconButton icon="ellipsis-vertical-outline" size="sm" />
        </div>
      </div>

      {/* Messages */}
      <div className="no-scrollbar flex-1 space-y-4 overflow-y-auto py-4">
        {messages.map((m) => (
          <ChatMessage key={m._id} message={m} />
        ))}
      </div>

      {/* Input toolbar */}
      <div className="border-surface-border border-t pt-3">
        <div className="mb-2 flex items-center gap-2">
          <IconButton icon="attach-outline" size="sm" tooltip="Đính kèm" />
          <IconButton icon="image-outline" size="sm" tooltip="Hình ảnh" />
          <IconButton icon="happy-outline" size="sm" tooltip="Emoji" />
        </div>
        <div className="flex gap-2">
          <textarea
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Nhập tin nhắn..."
            rows={1}
            className="border-surface-border bg-surface-dark focus:border-primary flex-1 resize-none rounded-xl border px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none"
          />
          <Button size="sm" iconLeft="send-outline" disabled={!msg.trim()}>
            Gửi
          </Button>
        </div>
      </div>
    </GlassPanel>
  );
}
