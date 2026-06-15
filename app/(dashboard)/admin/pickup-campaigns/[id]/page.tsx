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

import { use, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import {
  usePickupGameCampaign,
  useCampaignStats,
} from '@/hooks/pickup-game-campaign';
import { CampaignStatsCards } from './_components/CampaignStatsCards';
import { CheckInTrendChart } from './_components/CheckInTrendChart';
import { GameFillRateTable } from './_components/GameFillRateTable';
import { TopParticipantsTable } from './_components/TopParticipantsTable';
import { CheckInMethodChart } from './_components/CheckInMethodChart';

interface PickupCampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function PickupCampaignDetailPage({
  params,
}: PickupCampaignDetailPageProps) {
  const { id } = use(params);

  const {
    campaign,
    loading: campaignLoading,
    error: campaignError,
  } = usePickupGameCampaign(id);

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useCampaignStats(id);

  const handleRefresh = useCallback(() => {
    void refetchStats();
  }, [refetchStats]);

  const hasError = campaignError || statsError;

  const SPORT_LABEL: Record<string, string> = {
    BADMINTON: 'Cầu lông',
    FOOTBALL: 'Bóng đá',
    PICKLEBALL: 'Pickleball',
    BASKETBALL: 'Bóng rổ',
    TENNIS: 'Tennis',
    VOLLEYBALL: 'Bóng chuyền',
    TABLE_TENNIS: 'Bóng bàn',
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title={campaign?.name ?? 'Chi tiết Campaign'}
        description={
          campaign?.description ??
          (campaign
            ? `${campaign.gameIds.length} kèo · ${
                campaign.sportTypes
                  .map((s) => SPORT_LABEL[s] ?? s)
                  .join(', ') || 'Tất cả môn'
              }`
            : undefined)
        }
      >
        <div className="flex items-center gap-3">
          {campaign && (
            <Badge variant={campaign.isActive ? 'success' : 'neutral'}>
              {campaign.isActive ? 'Đang hoạt động' : 'Tạm dừng'}
            </Badge>
          )}

          {campaign?.startDate && campaign.endDate && (
            <span className="text-faint text-sm">
              <IonIcon name="calendar-outline" className="mr-1 inline" />
              {new Date(campaign.startDate).toLocaleDateString('vi-VN')} →{' '}
              {new Date(campaign.endDate).toLocaleDateString('vi-VN')}
            </span>
          )}

          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>

          <Link href="/admin/pickup-campaigns">
            <Button variant="ghost" size="sm" iconLeft="arrow-back-outline">
              Quay lại
            </Button>
          </Link>
        </div>
      </PageHeader>

      {hasError && (
        <QueryState
          loading={false}
          error={campaignError || statsError}
          onRetry={handleRefresh}
        >
          <></>
        </QueryState>
      )}

      {campaignLoading && !campaign && (
        <div className="bg-surface border-surface-border h-16 animate-pulse rounded-xl border" />
      )}

      {/* Goals progress (nếu có mục tiêu) */}
      {campaign?.goals && stats && (
        <div className="bg-surface border-surface-border rounded-xl border p-5">
          <h3 className="text-heading mb-4 text-sm font-semibold">
            Tiến độ mục tiêu
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {campaign.goals.targetCheckIns != null && (
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-body">Check-in</span>
                  <span className="text-heading font-medium">
                    {stats.totalCheckIns} / {campaign.goals.targetCheckIns}
                  </span>
                </div>
                <div className="bg-overlay-subtle h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-green-500"
                    style={{
                      width: `${Math.min(
                        (stats.totalCheckIns / campaign.goals.targetCheckIns) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {campaign.goals.targetUniqueUsers != null && (
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-body">Unique players</span>
                  <span className="text-heading font-medium">
                    {stats.uniqueParticipants} /{' '}
                    {campaign.goals.targetUniqueUsers}
                  </span>
                </div>
                <div className="bg-overlay-subtle h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-purple-500"
                    style={{
                      width: `${Math.min(
                        (stats.uniqueParticipants /
                          campaign.goals.targetUniqueUsers) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
            {campaign.goals.targetFillRate != null && (
              <div>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-body">Fill Rate</span>
                  <span className="text-heading font-medium">
                    {Math.round(stats.avgFillRate * 100)}% /{' '}
                    {Math.round(campaign.goals.targetFillRate * 100)}%
                  </span>
                </div>
                <div className="bg-overlay-subtle h-2 overflow-hidden rounded-full">
                  <div
                    className="h-full rounded-full bg-blue-500"
                    style={{
                      width: `${Math.min(
                        (stats.avgFillRate / campaign.goals.targetFillRate) *
                          100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* KPI Cards */}
      <CampaignStatsCards stats={stats} loading={statsLoading} />

      {/* Charts row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckInTrendChart
            data={stats?.checkInsByDate}
            loading={statsLoading}
          />
        </div>
        <CheckInMethodChart stats={stats} loading={statsLoading} />
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <GameFillRateTable
            games={stats?.checkInsByGame}
            loading={statsLoading}
          />
        </div>
        <TopParticipantsTable
          participants={stats?.topParticipants}
          loading={statsLoading}
        />
      </div>
    </div>
  );
}
