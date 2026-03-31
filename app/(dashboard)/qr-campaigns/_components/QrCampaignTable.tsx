'use client';

import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useToggleQrCampaign } from '@/hooks/qr-campaign';
import { showSuccess, showError } from '@/lib/toast';
import type { QrCampaign } from '@/types';

interface QrCampaignTableProps {
  campaigns: QrCampaign[];
  loading: boolean;
  onRefresh: () => void;
}

function SkeletonRow() {
  return (
    <tr>
      {Array.from({ length: 7 }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="bg-surface-hover h-4 animate-pulse rounded" />
        </td>
      ))}
    </tr>
  );
}

export function QrCampaignTable({
  campaigns,
  loading,
  onRefresh,
}: QrCampaignTableProps) {
  const { toggleCampaign, loading: toggling } = useToggleQrCampaign();

  const handleToggle = async (id: string, currentState: boolean) => {
    try {
      await toggleCampaign(id, !currentState);
      showSuccess(`Chiến dịch đã ${!currentState ? 'kích hoạt' : 'tạm dừng'}`);
      onRefresh();
    } catch {
      showError('Không thể cập nhật trạng thái');
    }
  };

  return (
    <div className="bg-surface border-surface-border overflow-hidden rounded-xl border">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-surface-border border-b">
              <th className="text-faint px-4 py-3 text-left font-medium">
                Tên chiến dịch
              </th>
              <th className="text-faint px-4 py-3 text-left font-medium">
                Địa điểm
              </th>
              <th className="text-faint px-4 py-3 text-right font-medium">
                Tổng quét
              </th>
              <th className="text-faint px-4 py-3 text-right font-medium">
                iOS
              </th>
              <th className="text-faint px-4 py-3 text-right font-medium">
                Android
              </th>
              <th className="text-faint px-4 py-3 text-center font-medium">
                Trạng thái
              </th>
              <th className="text-faint px-4 py-3 text-right font-medium">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-surface-border divide-y">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            ) : campaigns.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-faint py-12 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <IonIcon
                      name="qr-code-outline"
                      className="text-4xl opacity-30"
                    />
                    <p>Chưa có chiến dịch QR nào</p>
                  </div>
                </td>
              </tr>
            ) : (
              campaigns.map((campaign) => (
                <tr
                  key={campaign._id?.toString()}
                  className="hover:bg-surface-hover transition-colors"
                >
                  <td className="px-4 py-3">
                    <div>
                      <p className="text-heading font-medium">
                        {campaign.name}
                      </p>
                      <p className="text-faint font-mono text-xs">
                        {campaign.slug}
                      </p>
                    </div>
                  </td>
                  <td className="text-body px-4 py-3">
                    {campaign.location ? (
                      <span className="flex items-center gap-1">
                        <IonIcon
                          name="location-outline"
                          className="text-faint text-sm"
                        />
                        {campaign.location}
                      </span>
                    ) : (
                      <span className="text-faint">—</span>
                    )}
                  </td>
                  <td className="text-heading px-4 py-3 text-right font-semibold">
                    {(campaign.totalScans ?? 0).toLocaleString('vi-VN')}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-slate-600">
                      {(campaign.iosScans ?? 0).toLocaleString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <span className="font-medium text-emerald-600">
                      {(campaign.androidScans ?? 0).toLocaleString('vi-VN')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={campaign.isActive ? 'success' : 'neutral'}>
                      {campaign.isActive ? 'Hoạt động' : 'Tạm dừng'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/qr-campaigns/${campaign._id?.toString()}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconLeft="bar-chart-outline"
                        >
                          Chi tiết
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        iconLeft={
                          campaign.isActive ? 'pause-outline' : 'play-outline'
                        }
                        disabled={toggling}
                        onClick={() =>
                          handleToggle(
                            campaign._id?.toString() ?? '',
                            campaign.isActive ?? false
                          )
                        }
                      >
                        {campaign.isActive ? 'Dừng' : 'Bật'}
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
