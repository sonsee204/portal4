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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import { formatCurrency } from '@/lib/utils';
import {
  COURT_STATUS_LABEL,
  COURT_STATUS_VARIANT,
  SPORT_TYPE_LABEL,
} from '../_hooks/owner-court.constants';
import type { VenueDetailPageData } from '../_hooks/useVenueDetailPageData';
import type { VenueDetailPageActions } from '../_hooks/useVenueDetailPageActions';

interface VenueCourtsSectionProps {
  data: VenueDetailPageData;
  actions: VenueDetailPageActions;
}

export function VenueCourtsSection({ data, actions }: VenueCourtsSectionProps) {
  const {
    courts,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    sortField,
    sortDir,
    handleSort,
    sortLoading,
  } = data;
  const { openCreateCourt, openEditCourt, openDeleteCourt } = actions;

  return (
    <GlassPanel card>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-heading text-sm font-bold">Sân con</h3>
        <VenueActionGate action={VenueAction.Edit}>
          <Button
            variant="secondary"
            size="sm"
            iconLeft="add-outline"
            onClick={openCreateCourt}
          >
            Thêm sân con
          </Button>
        </VenueActionGate>
      </div>

      <DataTable
        columns={[
          { key: 'name', label: 'Tên', sortable: true, sortField: 'name' },
          { key: 'sport', label: 'Môn' },
          { key: 'price', label: 'Giá mặc định' },
          { key: 'peak', label: 'Giá cao điểm' },
          { key: 'status', label: 'Trạng thái' },
          { key: 'actions', label: '', align: 'right' },
        ]}
        data={courts}
        sortKey={sortField}
        sortDir={sortDir}
        onSort={handleSort}
        sortLoading={sortLoading}
        renderRow={(court) => (
          <tr
            key={court._id}
            className="border-surface-border hover:bg-surface-hover border-b transition-colors"
          >
            <td className="text-heading px-4 py-3 text-sm font-medium">
              {court.name}
            </td>
            <td className="text-body px-4 py-3 text-sm">
              {SPORT_TYPE_LABEL[court.sportType]}
            </td>
            <td className="text-body px-4 py-3 text-sm">
              {formatCurrency(court.defaultPricePerHour)}
            </td>
            <td className="text-body px-4 py-3 text-sm">
              {formatCurrency(court.peakPricePerHour)}
            </td>
            <td className="px-4 py-3">
              <Badge variant={COURT_STATUS_VARIANT[court.status]}>
                {COURT_STATUS_LABEL[court.status]}
              </Badge>
            </td>
            <td className="px-4 py-3 text-right">
              <VenueActionGate action={VenueAction.Edit}>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft="create-outline"
                    onClick={() => openEditCourt(court)}
                  >
                    Sửa
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconLeft="trash-outline"
                    onClick={() => openDeleteCourt(court._id)}
                  >
                    Xóa
                  </Button>
                </div>
              </VenueActionGate>
            </td>
          </tr>
        )}
      />

      <ConnectionInfiniteScroll
        loadedCount={courts.length}
        totalCount={totalCount}
        hasNextPage={hasNextPage}
        onLoadMore={() => void loadMore()}
        loading={loading && courts.length === 0}
        loadingMore={isLoadingMore}
      />
    </GlassPanel>
  );
}
