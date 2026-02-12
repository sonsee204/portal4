'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { TabGroup } from '@/components/molecules/TabGroup';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { StatCard } from '@/components/molecules/StatCard';
import { UserCell } from '@/components/molecules/UserCell';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IconButton } from '@/components/atoms/IconButton';
import { Pagination } from '@/components/organisms/Pagination';
import { mockMatchmakingLogs, mockBanners } from '@/lib/mock-data';
import type { MatchmakingStatus } from '@/types/portal';

const cmsTabs = [
  { label: 'Matchmaking', value: 'matchmaking' },
  { label: 'Banners', value: 'banners' },
];

const matchStatusVariant: Record<
  MatchmakingStatus,
  'warning' | 'success' | 'danger'
> = {
  searching: 'warning',
  matched: 'success',
  cancelled: 'danger',
};

export default function CmsPage() {
  const [tab, setTab] = useState('matchmaking');
  const [page, setPage] = useState(1);

  return (
    <>
      <PageHeader
        title="CMS & Vận hành"
        description="Quản lý nội dung, matchmaking và banner."
      >
        <Button size="sm" iconLeft="add-outline">
          Thêm Banner
        </Button>
      </PageHeader>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          icon="search-outline"
          iconColor="text-primary"
          label="Đang tìm đối"
          value="12"
        />
        <StatCard
          icon="people-outline"
          iconColor="text-emerald-400"
          label="Ghép thành công"
          value="84"
          trend={{ value: '+15%', direction: 'up' }}
        />
        <StatCard
          icon="images-outline"
          iconColor="text-blue-400"
          label="Banner đang chạy"
          value="2"
        />
      </div>

      <TabGroup
        tabs={cmsTabs}
        active={tab}
        onChange={setTab}
        className="mt-6"
      />

      {tab === 'matchmaking' && (
        <GlassPanel card className="mt-4">
          <DataTable
            columns={[
              { key: 'host', label: 'Host' },
              { key: 'sport', label: 'Môn' },
              { key: 'level', label: 'Trình độ' },
              { key: 'time', label: 'Thời gian' },
              { key: 'reputation', label: 'Uy tín', sortable: true },
              { key: 'status', label: 'Trạng thái' },
              { key: 'actions', label: '' },
            ]}
            data={mockMatchmakingLogs}
            renderRow={(m) => (
              <tr
                key={m._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="px-4 py-3">
                  <UserCell name={m.hostName} subtitle={m.hostId} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-300 capitalize">
                  {m.sport}
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">{m.level}</td>
                <td className="px-4 py-3 text-sm text-slate-400">{m.time}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="bg-surface-dark h-1.5 w-16 overflow-hidden rounded-full">
                      <div
                        className="h-full rounded-full bg-emerald-400"
                        style={{ width: `${m.reputationScore}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-400">
                      {m.reputationScore}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={matchStatusVariant[m.status]}>
                    {m.status}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <IconButton icon="eye-outline" size="sm" />
                </td>
              </tr>
            )}
          />
          <Pagination
            currentPage={page}
            totalPages={3}
            totalItems={24}
            pageSize={10}
            onPageChange={setPage}
            className="mt-4"
          />
        </GlassPanel>
      )}

      {tab === 'banners' && (
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockBanners.map((b) => (
            <GlassPanel key={b._id} card className="space-y-3">
              <div className="from-primary/20 flex h-32 items-center justify-center rounded-lg bg-gradient-to-br to-blue-500/20">
                <span className="text-2xl font-bold text-white/20">Banner</span>
              </div>
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-white">{b.title}</h4>
                <Badge
                  variant={
                    b.status === 'active'
                      ? 'success'
                      : b.status === 'scheduled'
                        ? 'info'
                        : 'neutral'
                  }
                >
                  {b.status}
                </Badge>
              </div>
              <p className="text-xs text-slate-500">Deep link: {b.deepLink}</p>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1"
                  iconLeft="create-outline"
                >
                  Sửa
                </Button>
                <IconButton
                  icon="trash-outline"
                  size="sm"
                  className="text-red-400"
                />
              </div>
            </GlassPanel>
          ))}
        </div>
      )}
    </>
  );
}
