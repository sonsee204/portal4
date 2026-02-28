'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { useMyTournaments } from '@/hooks/tournament';
import { TOURNAMENT } from '@/lib/strings';
import type { TournamentStatus } from '@/graphql/generated';
import { TournamentListCard } from './_components/TournamentListCard';
import { TournamentStatusActions } from './_components/TournamentStatusActions';

const STATUS_TABS: { label: string; value: TournamentStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: TOURNAMENT.STATUS_DRAFT, value: 'DRAFT' as TournamentStatus },
  {
    label: TOURNAMENT.STATUS_PUBLISHED,
    value: 'PUBLISHED' as TournamentStatus,
  },
  {
    label: TOURNAMENT.STATUS_REGISTRATION_OPEN,
    value: 'REGISTRATION_OPEN' as TournamentStatus,
  },
  {
    label: TOURNAMENT.STATUS_IN_PROGRESS,
    value: 'IN_PROGRESS' as TournamentStatus,
  },
  {
    label: TOURNAMENT.STATUS_COMPLETED,
    value: 'COMPLETED' as TournamentStatus,
  },
];

export default function TournamentsPage() {
  const [activeTab, setActiveTab] = useState<TournamentStatus | 'ALL'>('ALL');

  const { tournaments, loading, refetch } = useMyTournaments({
    filter:
      activeTab === 'ALL'
        ? undefined
        : { status: activeTab as TournamentStatus },
    pagination: { page: 1, limit: 20 },
  });

  const handleStatusChange = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <>
      <PageHeader
        title="Giải đấu của tôi"
        description="Quản lý và theo dõi các giải đấu bạn tổ chức."
      >
        <Link href="/tournaments/create">
          <Button size="sm" iconLeft="add-outline">
            Tạo Giải Đấu Mới
          </Button>
        </Link>
      </PageHeader>

      <div className="mt-6 flex gap-2 overflow-x-auto pb-2">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.value
                ? 'bg-primary text-white'
                : 'bg-surface-elevated text-secondary hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-4">
        {loading && tournaments.length === 0 ? (
          <GlassPanel card>
            <div className="flex items-center justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </GlassPanel>
        ) : tournaments.length === 0 ? (
          <GlassPanel card>
            <div className="py-12 text-center">
              <p className="text-secondary">{TOURNAMENT.EMPTY_TOURNAMENTS}</p>
              <Link
                href="/tournaments/create"
                className="text-primary mt-2 inline-block text-sm hover:underline"
              >
                Tạo giải đấu đầu tiên
              </Link>
            </div>
          </GlassPanel>
        ) : (
          tournaments.map((tournament) => (
            <GlassPanel key={tournament._id} card className="p-0">
              <TournamentListCard tournament={tournament} />
              <div className="border-surface-border border-t px-4 py-3">
                <TournamentStatusActions
                  tournamentId={tournament._id}
                  status={tournament.status}
                  onStatusChange={handleStatusChange}
                />
              </div>
            </GlassPanel>
          ))
        )}
      </div>
    </>
  );
}
