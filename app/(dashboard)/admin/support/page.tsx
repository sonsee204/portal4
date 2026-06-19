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

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { FilterChips } from '@/components/molecules/FilterChips';
import { SearchInput } from '@/components/molecules/SearchInput';
import { QueryState } from '@/components/molecules/QueryState';
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { TicketListItem } from './_components/TicketListItem';
import { InquiryDetailPanel } from './_components/InquiryDetailPanel';
import { UserDetailPanel } from './_components/UserDetailPanel';
import { useContactInquiries, useContactInquiryStats } from '@/hooks/contact';
import type { ContactInquiry, ContactInquiryFilterInput } from '@/types';
import { InquiryStatusEnum } from '@/types';
import { SUPPORT, COMMON } from '@/lib/strings';

type FilterValue = 'all' | InquiryStatusEnum;

export default function SupportPage() {
  const [filter, setFilter] = useState<FilterValue>('all');
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filterInput: ContactInquiryFilterInput = {
    ...(filter !== 'all' && { status: filter }),
    ...(search && { search }),
    limit: 20,
  };

  const {
    inquiries,
    total,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
  } = useContactInquiries(filterInput);

  const { stats, refetch: refetchStats } = useContactInquiryStats();

  const selectedInquiry = inquiries.find((i) => i._id === selectedId) ?? null;

  const statusFilters: { label: string; value: FilterValue; count?: number }[] =
    [
      { label: COMMON.ALL, value: 'all', count: stats?.total },
      {
        label: SUPPORT.STATUS.NEW,
        value: InquiryStatusEnum.NEW,
        count: stats?.newCount,
      },
      {
        label: SUPPORT.STATUS.IN_PROGRESS,
        value: InquiryStatusEnum.IN_PROGRESS,
        count: stats?.inProgressCount,
      },
      {
        label: SUPPORT.STATUS.REPLIED,
        value: InquiryStatusEnum.REPLIED,
        count: stats?.repliedCount,
      },
      {
        label: SUPPORT.STATUS.CLOSED,
        value: InquiryStatusEnum.CLOSED,
        count: stats?.closedCount,
      },
    ];

  const handleFilterChange = (val: string) => {
    setFilter(val as FilterValue);
    setSelectedId(null);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setSelectedId(null);
  };

  const handleStatusUpdated = (_updated: ContactInquiry) => {
    void refetch();
    void refetchStats();
  };

  return (
    <>
      <PageHeader
        title={SUPPORT.PAGE.TITLE}
        description={SUPPORT.PAGE.DESCRIPTION}
      />

      <div className="mt-6 grid gap-6 lg:grid-cols-[320px_1fr_280px]">
        {/* Left: Inquiry list */}
        <GlassPanel card className="space-y-4">
          <SearchInput
            placeholder={SUPPORT.PAGE.SEARCH_PLACEHOLDER}
            value={search}
            onChange={handleSearch}
          />

          <FilterChips
            chips={statusFilters}
            active={filter}
            onChange={handleFilterChange}
          />
          <div className="space-y-2">
            <QueryState
              loading={loading}
              error={error}
              empty={inquiries.length === 0}
              emptyMessage={SUPPORT.PAGE.EMPTY}
              emptyIcon="chatbubbles-outline"
              onRetry={() => refetch()}
              skeletonCount={6}
            >
              {inquiries.map((inquiry) => (
                <TicketListItem
                  key={inquiry._id}
                  inquiry={inquiry}
                  active={inquiry._id === selectedId}
                  onClick={() => setSelectedId(inquiry._id)}
                />
              ))}
            </QueryState>

            <ConnectionInfiniteScroll
              hasNextPage={hasNextPage}
              onLoadMore={() => void loadMore()}
              loading={loading && inquiries.length === 0}
              loadingMore={isLoadingMore}
              loadedCount={inquiries.length}
              totalCount={total}
              onRetry={() => void refetch()}
            />
          </div>
        </GlassPanel>

        {/* Center: Inquiry detail */}
        {selectedInquiry ? (
          <InquiryDetailPanel
            inquiry={selectedInquiry}
            onStatusUpdated={handleStatusUpdated}
          />
        ) : (
          <GlassPanel
            card
            className="flex flex-col items-center justify-center py-20"
          >
            <p className="text-muted text-sm">{SUPPORT.PAGE.SELECT_PROMPT}</p>
          </GlassPanel>
        )}

        {/* Right: Sender details */}
        <div className="hidden xl:block">
          {selectedInquiry && <UserDetailPanel inquiry={selectedInquiry} />}
        </div>
      </div>
    </>
  );
}
