'use client';

import { useCallback, useState } from 'react';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import { QrSummaryCards } from './_components/QrSummaryCards';
import { QrCampaignTable } from './_components/QrCampaignTable';
import { CreateQrCampaignModal } from './_components/CreateQrCampaignModal';
import { useQrCampaigns, useQrAnalyticsSummary } from '@/hooks/qr-campaign';

export default function QrCampaignsPage() {
  const [search, setSearch] = useState('');

  const filter = search ? { search } : undefined;

  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    refetch: refetchCampaigns,
  } = useQrCampaigns(filter);

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refetch: refetchSummary,
  } = useQrAnalyticsSummary();

  const handleRefresh = useCallback(() => {
    void refetchCampaigns();
    void refetchSummary();
  }, [refetchCampaigns, refetchSummary]);

  const hasError = campaignsError || summaryError;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Quản lý QR Code"
        description="Tạo và theo dõi hiệu quả các chiến dịch QR Code download app."
      >
        <div className="flex items-center gap-3">
          {/* Search */}
          <div className="bg-surface border-surface-border relative flex items-center rounded-lg border px-3 py-2 shadow-sm">
            <IonIcon name="search-outline" className="text-faint mr-2" />
            <input
              type="text"
              placeholder="Tìm chiến dịch..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-48 bg-transparent text-sm outline-none placeholder:text-gray-400"
            />
          </div>

          <Button
            variant="ghost"
            size="sm"
            iconLeft="refresh-outline"
            onClick={handleRefresh}
          >
            Làm mới
          </Button>

          <CreateQrCampaignModal onCreated={handleRefresh} />
        </div>
      </PageHeader>

      {hasError && (
        <QueryState
          loading={false}
          error={campaignsError || summaryError}
          onRetry={handleRefresh}
        >
          <></>
        </QueryState>
      )}

      {/* KPI Summary */}
      <QrSummaryCards summary={summary} loading={summaryLoading} />

      {/* Campaign List */}
      <div>
        <h2 className="text-heading mb-4 text-base font-semibold">
          Danh sách chiến dịch
        </h2>
        <QrCampaignTable
          campaigns={campaigns}
          loading={campaignsLoading}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
