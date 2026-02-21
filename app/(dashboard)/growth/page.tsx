'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import { PermissionGate } from '@/components/atoms/PermissionGate';
import { GrowthStatsCards } from './_components/GrowthStatsCards';
import { TrafficSourceChart } from './_components/TrafficSourceChart';
import { PartnerLeaderboard } from './_components/PartnerLeaderboard';
import { ReferralCodeManager } from './_components/ReferralCodeManager';
import { useGrowthStats, usePartnerLeaderboard } from '@/hooks/referral';
import type { ReferralFilterInput } from '@/types';

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function GrowthPage() {
  const [dateRange, setDateRange] = useState<{
    from?: string;
    to?: string;
  }>({});

  const filter: ReferralFilterInput | undefined =
    dateRange.from || dateRange.to ? dateRange : undefined;

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useGrowthStats(filter);

  const {
    leaderboard,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = usePartnerLeaderboard(filter);

  const handleRefresh = useCallback(() => {
    void refetchStats();
    void refetchLeaderboard();
  }, [refetchStats, refetchLeaderboard]);

  const hasError = statsError || leaderboardError;

  return (
    <div className="space-y-8">
      {/* Header */}
      <PageHeader
        title="Theo dõi Tăng trưởng & Đối tác"
        description="Theo dõi hiệu suất đối tác, nguồn giới thiệu và tăng trưởng hữu cơ."
      >
        <div className="bg-surface border-surface-border flex items-center gap-3 rounded-lg border p-1.5 shadow-sm">
          {/* Date range inputs */}
          <div className="border-surface-border text-muted flex items-center border-r px-3 py-2 text-sm">
            <IonIcon name="calendar-outline" className="mr-2 text-lg" />
            <input
              type="date"
              className="bg-transparent outline-none"
              value={dateRange.from ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            <span className="mx-2">-</span>
            <input
              type="date"
              className="bg-transparent outline-none"
              value={dateRange.to ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
            />
          </div>

          {/* Refresh button */}
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>

          {/* Export button */}
          <Button variant="primary" size="sm" iconLeft="download-outline">
            Xuất báo cáo
          </Button>
        </div>
      </PageHeader>

      {/* Error state */}
      {hasError && (
        <QueryState
          loading={false}
          error={statsError || leaderboardError}
          onRetry={handleRefresh}
        >
          <></>
        </QueryState>
      )}

      {/* KPI Cards */}
      <GrowthStatsCards stats={stats} loading={statsLoading} />

      {/* Traffic Source Chart */}
      <TrafficSourceChart trend={stats?.trend} loading={statsLoading} />

      {/* Partner Leaderboard */}
      <PartnerLeaderboard
        items={leaderboard?.items}
        totalCodes={leaderboard?.totalCodes ?? 0}
        loading={leaderboardLoading}
      />

      {/* Referral Code Management - only SUPER_ADMIN */}
      <PermissionGate roles={['SUPER_ADMIN']}>
        <ReferralCodeManager />
      </PermissionGate>
    </div>
  );
}
