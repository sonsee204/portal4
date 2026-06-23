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

import { useMemo } from 'react';
import Link from 'next/link';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { useDataTableSort } from '@/hooks/shared/useDataTableSort';
import type { OwnerDashboardData } from '../_hooks/useOwnerDashboardData';

interface OwnerDashboardVenuesTableSectionProps {
  data: OwnerDashboardData;
}

export function OwnerDashboardVenuesTableSection({
  data,
}: OwnerDashboardVenuesTableSectionProps) {
  const { venues } = data;
  const { sortField, sortDir, handleSort } = useDataTableSort({
    defaultField: 'name',
    defaultDir: 'asc',
  });

  const sortedVenues = useMemo(() => {
    const list = [...venues];
    list.sort((left, right) => {
      let leftValue: string | number;
      let rightValue: string | number;
      switch (sortField) {
        case 'courtCount':
          leftValue = left.courtCount ?? 0;
          rightValue = right.courtCount ?? 0;
          break;
        case 'name':
        default:
          leftValue = left.name;
          rightValue = right.name;
          break;
      }
      if (typeof leftValue === 'string' && typeof rightValue === 'string') {
        return sortDir === 'asc'
          ? leftValue.localeCompare(rightValue, 'vi')
          : rightValue.localeCompare(leftValue, 'vi');
      }
      const delta = Number(leftValue) - Number(rightValue);
      return sortDir === 'asc' ? delta : -delta;
    });
    return list;
  }, [sortDir, sortField, venues]);

  if (venues.length === 0) return null;

  return (
    <GlassPanel card>
      <h3 className="text-heading mb-4 text-sm font-bold">So sánh sân</h3>
      <DataTable
        columns={[
          { key: 'name', label: 'Tên sân', sortable: true },
          {
            key: 'courts',
            label: 'Số sân con',
            sortable: true,
            sortField: 'courtCount',
          },
          { key: 'role', label: 'Vai trò' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        data={sortedVenues}
        sortKey={sortField}
        sortDir={sortDir}
        onSort={handleSort}
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
