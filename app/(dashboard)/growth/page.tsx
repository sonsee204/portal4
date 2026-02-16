'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@apollo/client/react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import { PermissionGate } from '@/components/atoms/PermissionGate';
import { GrowthStatsCards } from './_components/GrowthStatsCards';
import { TrafficSourceChart } from './_components/TrafficSourceChart';
import { PartnerLeaderboard } from './_components/PartnerLeaderboard';
import { ReferralCodeManager } from './_components/ReferralCodeManager';
import {
  GET_GROWTH_STATS,
  GET_PARTNER_LEADERBOARD,
} from '@/graphql/queries/referral';
import type {
  GrowthStats,
  PartnerLeaderboard as PartnerLeaderboardType,
  ReferralFilterInput,
} from '@/types';

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function GrowthPage() {
  const [dateRange, setDateRange] = useState<{
    from?: string;
    to?: string;
  }>({});

  const filterVariables: { filter?: ReferralFilterInput } =
    dateRange.from || dateRange.to ? { filter: dateRange } : {};

  // Growth stats query
  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQuery<{ getGrowthStats: GrowthStats }>(GET_GROWTH_STATS, {
    variables: filterVariables,
    fetchPolicy: 'cache-and-network',
  });

  // Leaderboard query
  const {
    data: leaderboardData,
    loading: leaderboardLoading,
    error: leaderboardError,
    refetch: refetchLeaderboard,
  } = useQuery<{ getPartnerLeaderboard: PartnerLeaderboardType }>(
    GET_PARTNER_LEADERBOARD,
    {
      variables: filterVariables,
      fetchPolicy: 'cache-and-network',
    }
  );

  const handleRefresh = useCallback(() => {
    void refetchStats();
    void refetchLeaderboard();
  }, [refetchStats, refetchLeaderboard]);

  const stats = statsData?.getGrowthStats;
  const leaderboard = leaderboardData?.getPartnerLeaderboard;
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
