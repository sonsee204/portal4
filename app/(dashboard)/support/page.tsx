'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { SearchInput } from '@/components/molecules/SearchInput';
import { EmptyState } from '@/components/molecules/EmptyState';
import { TicketListItem } from './_components/TicketListItem';
import { ChatPanel } from './_components/ChatPanel';
import { UserDetailPanel } from './_components/UserDetailPanel';
import { mockTickets, mockChatMessages } from '@/lib/mock-data';

const statusFilters = [
  { label: 'Tất cả', value: 'all', count: 4 },
  { label: 'Mới', value: 'new', count: 1 },
  { label: 'Đang xử lý', value: 'open', count: 1 },
  { label: 'Đã đóng', value: 'closed', count: 1 },
];

export default function SupportPage() {
  const [filter, setFilter] = useState('all');
  const [selectedId, setSelectedId] = useState<string>(
    mockTickets[0]?._id ?? ''
  );

  const filtered = mockTickets.filter(
    (t) => filter === 'all' || t.status === filter
  );
  const selectedTicket = mockTickets.find((t) => t._id === selectedId);

  return (
    <>
      <PageHeader
        title="Hỗ trợ khách hàng"
        description="Quản lý và trả lời ticket từ người dùng."
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr_280px]">
        {/* Left: Ticket list */}
        <GlassPanel card className="space-y-4">
          <SearchInput placeholder="Tìm ticket..." />
          <FilterChips
            chips={statusFilters}
            active={filter}
            onChange={setFilter}
          />
          <div className="space-y-2">
            {filtered.map((t) => (
              <TicketListItem
                key={t._id}
                ticket={t}
                active={t._id === selectedId}
                onClick={() => setSelectedId(t._id)}
              />
            ))}
            {filtered.length === 0 && (
              <EmptyState
                icon="chatbubbles-outline"
                title="Không có ticket"
                description="Không có ticket nào phù hợp."
              />
            )}
          </div>
        </GlassPanel>

        {/* Center: Chat */}
        {selectedTicket ? (
          <ChatPanel ticket={selectedTicket} messages={mockChatMessages} />
        ) : (
          <GlassPanel card>
            <EmptyState
              icon="chatbubble-outline"
              title="Chọn ticket"
              description="Chọn một ticket để bắt đầu trả lời."
            />
          </GlassPanel>
        )}

        {/* Right: User details (xl+) */}
        <div className="hidden xl:block">
          {selectedTicket && <UserDetailPanel ticket={selectedTicket} />}
        </div>
      </div>
    </>
  );
}
