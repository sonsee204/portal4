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
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import type { OwnerDashboardData } from '../_hooks/useOwnerDashboardData';

interface OwnerDashboardVenuesTableSectionProps {
  data: OwnerDashboardData;
}

export function OwnerDashboardVenuesTableSection({
  data,
}: OwnerDashboardVenuesTableSectionProps) {
  const { venues } = data;

  if (venues.length === 0) return null;

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-4 text-sm font-bold">So sánh sân</h3>
      <DataTable
        columns={[
          { key: 'name', label: 'Tên sân' },
          { key: 'courts', label: 'Số sân con' },
          { key: 'role', label: 'Vai trò' },
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
            <td className="text-body px-4 py-3 text-sm">{v.courtCount}</td>
            <td className="px-4 py-3">
              <Badge variant={v.isOwner ? 'success' : 'info'}>
                {v.isOwner ? 'Chủ sân' : 'Nhân viên'}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              <Link href={`/owner/venues/${v._id}`}>
                <Button variant="ghost" size="sm" iconLeft="eye-outline">
                  Chi tiết
                </Button>
              </Link>
            </td>
          </tr>
        )}
      />
    </GlassPanel>
  );
}
