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

import { useCallback, useRef, useState } from 'react';
import Link from 'next/link';
import { use } from 'react';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { PageHeader } from '@/components/organisms/PageHeader';
import { QueryState } from '@/components/molecules/QueryState';
import { QrStatsCards } from './_components/QrStatsCards';
import { QrScanTrendChart } from './_components/QrScanTrendChart';
import { QrCodePreview } from './_components/QrCodePreview';
import { QrTopCitiesTable } from './_components/QrTopCitiesTable';
import { useQrCampaign, useQrCampaignStats } from '@/hooks/qr-campaign';

interface QrCampaignDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function QrCampaignDetailPage({
  params,
}: QrCampaignDetailPageProps) {
  const { id } = use(params);

  const [dateRange, setDateRange] = useState<{ from?: string; to?: string }>(
    {}
  );

  const fromDateRef = useRef<HTMLInputElement>(null);
  const toDateRef = useRef<HTMLInputElement>(null);

  const openDatePicker = useCallback((input: HTMLInputElement | null) => {
    if (!input) return;
    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  }, []);

  const filter =
    dateRange.from || dateRange.to
      ? {
          from: dateRange.from ?? undefined,
          to: dateRange.to ?? undefined,
        }
      : undefined;

  const {
    campaign,
    loading: campaignLoading,
    error: campaignError,
  } = useQrCampaign(id);

  const {
    stats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useQrCampaignStats(id, filter);

  const handleRefresh = useCallback(() => {
    void refetchStats();
  }, [refetchStats]);

  const hasError = campaignError || statsError;

  return (
    <div className="space-y-8">
      <PageHeader
        title={campaign?.name ?? 'Chi tiết chiến dịch QR'}
        description={
          campaign
            ? `/${campaign.slug}${campaign.location ? ` · ${campaign.location}` : ''}`
            : undefined
        }
      >
        <div className="flex items-center gap-3">
          {campaign && (
            <Badge variant={campaign.isActive ? 'success' : 'neutral'}>
              {campaign.isActive ? 'Hoạt động' : 'Tạm dừng'}
            </Badge>
          )}

          {/* Date range filter — one calendar button per field; KPIs use backend scan-event aggregation */}
          <div className="bg-surface border-surface-border flex flex-wrap items-center gap-2 rounded-lg border p-1.5 shadow-sm">
            <button
              type="button"
              className="text-faint hover:text-body ml-0.5 inline-flex shrink-0 rounded p-0.5 transition-colors"
              aria-label="Từ ngày"
              onClick={() => openDatePicker(fromDateRef.current)}
            >
              <IonIcon name="calendar-outline" />
            </button>
            <input
              ref={fromDateRef}
              type="date"
              className="relative z-[1] min-w-[9.5rem] cursor-pointer bg-transparent text-sm outline-none"
              value={dateRange.from ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, from: e.target.value }))
              }
            />
            <span className="text-faint shrink-0">–</span>
            <button
              type="button"
              className="text-faint hover:text-body inline-flex shrink-0 rounded p-0.5 transition-colors"
              aria-label="Đến ngày"
              onClick={() => openDatePicker(toDateRef.current)}
            >
              <IonIcon name="calendar-outline" />
            </button>
            <input
              ref={toDateRef}
              type="date"
              className="relative z-[1] min-w-[9.5rem] cursor-pointer bg-transparent text-sm outline-none"
              value={dateRange.to ?? ''}
              onChange={(e) =>
                setDateRange((prev) => ({ ...prev, to: e.target.value }))
              }
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

          <Link href="/qr-campaigns">
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

      {/* KPI Cards */}
      <QrStatsCards stats={stats} loading={statsLoading} />

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Trend chart — spans 2 cols */}
        <div className="lg:col-span-2">
          <QrScanTrendChart trend={stats?.trend} loading={statsLoading} />
        </div>

        {/* QR Code preview */}
        {campaign && (
          <QrCodePreview
            campaignId={id}
            campaignSlug={campaign.slug}
            campaignName={campaign.name}
          />
        )}
      </div>

      {/* Top cities */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <QrTopCitiesTable cities={stats?.topCities} loading={statsLoading} />

        {/* OS breakdown */}
        <div className="bg-surface border-surface-border rounded-xl border p-6">
          <h3 className="text-heading mb-4 text-sm font-semibold">
            Phân bổ hệ điều hành
          </h3>
          {statsLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="bg-surface-hover h-4 w-20 animate-pulse rounded" />
                  <div className="bg-surface-hover h-2 flex-1 animate-pulse rounded-full" />
                  <div className="bg-surface-hover h-4 w-12 animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : stats ? (
            <div className="space-y-4">
              {[
                {
                  label: 'iOS',
                  icon: 'logo-apple',
                  count: stats.iosScans,
                  pct: stats.iosPercentage,
                  color: 'bg-slate-500',
                  textColor: 'text-slate-600',
                },
                {
                  label: 'Android',
                  icon: 'logo-android',
                  count: stats.androidScans,
                  pct: stats.androidPercentage,
                  color: 'bg-emerald-500',
                  textColor: 'text-emerald-600',
                },
                {
                  label: 'Không xác định',
                  icon: 'help-circle-outline',
                  count: stats.unknownScans,
                  pct:
                    stats.totalScans > 0
                      ? Math.round(
                          ((stats.unknownScans ?? 0) / stats.totalScans) * 1000
                        ) / 10
                      : 0,
                  color: 'bg-gray-300',
                  textColor: 'text-gray-500',
                },
              ].map((row) => (
                <div key={row.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-body flex items-center gap-1.5 font-medium">
                      <IonIcon name={row.icon} className={row.textColor} />
                      {row.label}
                    </span>
                    <span className="text-heading font-semibold">
                      {row.count.toLocaleString('vi-VN')} ({row.pct}%)
                    </span>
                  </div>
                  <div className="bg-overlay-subtle h-2 overflow-hidden rounded-full">
                    <div
                      className={`h-full rounded-full ${row.color}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
