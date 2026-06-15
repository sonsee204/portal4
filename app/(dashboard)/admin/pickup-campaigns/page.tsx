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

import { useCallback } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import { Button } from '@/components/atoms/Button';
import { CampaignTable } from './_components/CampaignTable';
import { CreateCampaignModal } from './_components/CreateCampaignModal';
import {
  useMyCampaigns,
  useUpdatePickupGameCampaign,
} from '@/hooks/pickup-game-campaign';

export default function PickupCampaignsPage() {
  const { campaigns, loading, error, refetch } = useMyCampaigns();

  const { updateCampaign } = useUpdatePickupGameCampaign();

  const handleToggle = useCallback(
    async (id: string, isActive: boolean) => {
      await updateCampaign(id, { isActive });
      void refetch();
    },
    [updateCampaign, refetch]
  );

  const handleRefresh = useCallback(() => {
    void refetch();
  }, [refetch]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Campaign Giao Lưu"
        description="Tạo và theo dõi hiệu quả các campaign kèo giao lưu tại nhiều địa điểm."
      >
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>
          <CreateCampaignModal onCreated={handleRefresh} />
        </div>
      </PageHeader>

      {error && (
        <QueryState loading={false} error={error} onRetry={handleRefresh}>
          <></>
        </QueryState>
      )}

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Tổng campaign',
            value: campaigns.length,
            icon: 'flag-outline',
            color: 'text-green-600',
            bg: 'bg-green-500/10',
          },
          {
            label: 'Đang hoạt động',
            value: campaigns.filter((c) => c.isActive).length,
            icon: 'checkmark-circle-outline',
            color: 'text-emerald-600',
            bg: 'bg-emerald-500/10',
          },
          {
            label: 'Tổng kèo',
            value: campaigns.reduce((s, c) => s + c.gameIds.length, 0),
            icon: 'football-outline',
            color: 'text-blue-600',
            bg: 'bg-blue-500/10',
          },
        ].map((card) => (
          <div
            key={card.label}
            className="bg-surface border-surface-border flex items-center gap-4 rounded-xl border p-5"
          >
            <div
              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg ${card.bg}`}
            >
              <span className={`ion ion-${card.icon} text-xl ${card.color}`} />
            </div>
            <div>
              <p className="text-faint text-sm">{card.label}</p>
              <p className="text-heading text-2xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Campaign list */}
      <div>
        <h2 className="text-heading mb-4 text-base font-semibold">
          Danh sách Campaign
        </h2>
        <CampaignTable
          campaigns={campaigns}
          loading={loading}
          onToggle={handleToggle}
        />
      </div>
    </div>
  );
}
