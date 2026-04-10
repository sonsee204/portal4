'use client';

import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { PickupGameCampaign } from '@/graphql/types';

interface CampaignTableProps {
  campaigns: PickupGameCampaign[];
  loading: boolean;
  onToggle: (id: string, isActive: boolean) => void;
}

const SPORT_LABEL: Record<string, string> = {
  BADMINTON: 'Cầu lông',
  FOOTBALL: 'Bóng đá',
  PICKLEBALL: 'Pickleball',
  BASKETBALL: 'Bóng rổ',
  TENNIS: 'Tennis',
  VOLLEYBALL: 'Bóng chuyền',
  TABLE_TENNIS: 'Bóng bàn',
};

export function CampaignTable({
  campaigns,
  loading,
  onToggle,
}: CampaignTableProps) {
  if (loading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface border-surface-border h-16 animate-pulse rounded-xl border"
          />
        ))}
      </div>
    );
  }

  if (campaigns.length === 0) {
    return (
      <div className="bg-surface border-surface-border flex flex-col items-center justify-center rounded-xl border py-16 text-center">
        <IonIcon name="flag-outline" className="text-faint mb-3 text-4xl" />
        <p className="text-body font-medium">Chưa có campaign nào</p>
        <p className="text-faint mt-1 text-sm">
          Tạo campaign để quản lý và theo dõi các kèo giao lưu
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface border-surface-border overflow-hidden rounded-xl border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-surface-border border-b">
            <th className="text-faint px-4 py-3 text-left font-medium">
              Tên campaign
            </th>
            <th className="text-faint px-4 py-3 text-left font-medium">
              Môn thể thao
            </th>
            <th className="text-faint px-4 py-3 text-left font-medium">
              Thời gian
            </th>
            <th className="text-faint px-4 py-3 text-left font-medium">
              Số kèo
            </th>
            <th className="text-faint px-4 py-3 text-left font-medium">
              Trạng thái
            </th>
            <th className="text-faint px-4 py-3 text-left font-medium">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-surface-border divide-y">
          {campaigns.map((c) => (
            <tr
              key={c._id}
              className="hover:bg-surface-hover transition-colors"
            >
              <td className="px-4 py-3">
                <div>
                  <p className="text-heading font-medium">{c.name}</p>
                  {c.description && (
                    <p className="text-faint mt-0.5 max-w-xs truncate text-xs">
                      {c.description}
                    </p>
                  )}
                </div>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1">
                  {c.sportTypes.length > 0 ? (
                    c.sportTypes.map((s) => (
                      <span
                        key={s}
                        className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium"
                      >
                        {SPORT_LABEL[s] ?? s}
                      </span>
                    ))
                  ) : (
                    <span className="text-faint text-xs">Tất cả</span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 text-sm">
                {c.startDate || c.endDate ? (
                  <span className="text-body">
                    {c.startDate
                      ? new Date(c.startDate).toLocaleDateString('vi-VN')
                      : '—'}{' '}
                    →{' '}
                    {c.endDate
                      ? new Date(c.endDate).toLocaleDateString('vi-VN')
                      : '—'}
                  </span>
                ) : (
                  <span className="text-faint text-xs">Không giới hạn</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="text-heading font-semibold">
                  {c.gameIds.length}
                </span>
                <span className="text-faint ml-1 text-xs">kèo</span>
              </td>
              <td className="px-4 py-3">
                <Badge variant={c.isActive ? 'success' : 'neutral'}>
                  {c.isActive ? 'Hoạt động' : 'Tạm dừng'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center gap-2">
                  <Link href={`/pickup-campaigns/${c._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft="bar-chart-outline"
                    >
                      Xem
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft={c.isActive ? 'pause-outline' : 'play-outline'}
                    onClick={() => onToggle(c._id, !c.isActive)}
                  >
                    {c.isActive ? 'Tạm dừng' : 'Kích hoạt'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
