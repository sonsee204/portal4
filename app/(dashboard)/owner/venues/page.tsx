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

import Link from 'next/link';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { QueryState } from '@/components/molecules/QueryState';
import { useVenueContext } from '@/components/providers/VenueContextProvider';

export default function OwnerVenuesPage() {
  const { venues, loading, error, refetchVenues } = useVenueContext();

  return (
    <>
      <PageHeader
        title="Sân của tôi"
        description="Danh sách sân bạn sở hữu hoặc quản lý."
      />

      <GlassPanel card className="mt-6">
        <QueryState
          loading={loading && venues.length === 0}
          error={error}
          empty={!loading && venues.length === 0}
          emptyMessage="Bạn chưa quản lý sân nào."
          onRetry={() => refetchVenues()}
        >
          <DataTable
            columns={[
              { key: 'name', label: 'Tên sân' },
              { key: 'address', label: 'Địa chỉ' },
              { key: 'courts', label: 'Số sân' },
              { key: 'role', label: 'Vai trò' },
              { key: 'status', label: 'Trạng thái' },
              { key: 'actions', label: '', align: 'right' },
            ]}
            data={venues}
            renderRow={(v) => (
              <tr
                key={v._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="text-heading px-4 py-3 text-sm font-medium">
                  {v.name}
                </td>
                <td className="text-muted px-4 py-3 text-sm">
                  {v.location?.address ?? '—'}
                </td>
                <td className="text-body px-4 py-3 text-sm">{v.courtCount}</td>
                <td className="px-4 py-3">
                  <Badge variant={v.isOwner ? 'success' : 'info'}>
                    {v.isOwner ? 'Chủ sân' : 'Nhân viên'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge variant="neutral">{v.status}</Badge>
                </td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/owner/venues/${v._id}`}>
                    <Button
                      variant="ghost"
                      size="sm"
                      iconLeft="chevron-forward-outline"
                    >
                      Chi tiết
                    </Button>
                  </Link>
                </td>
              </tr>
            )}
          />
        </QueryState>
      </GlassPanel>
    </>
  );
}
