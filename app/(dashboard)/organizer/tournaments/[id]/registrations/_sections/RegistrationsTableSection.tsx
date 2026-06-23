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
import { ConnectionInfiniteScroll } from '@/components/molecules/ConnectionInfiniteScroll';
import { TOURNAMENT } from '@/lib/strings';
import type { RegistrationsPageActions } from '../_hooks/useRegistrationsPageActions';
import type { RegistrationsPageData } from '../_hooks/useRegistrationsPageData';
import { RegistrationTableHead } from './registrations-table.columns';
import { RegistrationTableRow } from './registrations-table.row';

interface RegistrationsTableSectionProps {
  data: RegistrationsPageData;
  actions: RegistrationsPageActions;
}

export function RegistrationsTableSection({
  data,
  actions,
}: RegistrationsTableSectionProps) {
  const {
    registrations,
    loading,
    total,
    hasNextPage,
    loadMore,
    isLoadingMore,
    selectedIds,
  } = data;
  const { toggleSelectAll } = actions;
  const tableCtx = { data, actions };

  return (
    <div className="mt-4">
      {loading && registrations.length === 0 ? (
        <GlassPanel card>
          <div className="flex items-center justify-center py-12">
            <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          </div>
        </GlassPanel>
      ) : registrations.length === 0 ? (
        <GlassPanel card>
          <div className="py-12 text-center">
            <p className="text-secondary">{TOURNAMENT.EMPTY_REGISTRATIONS}</p>
          </div>
        </GlassPanel>
      ) : (
        <GlassPanel card className="overflow-x-auto p-0">
          <table className="w-full text-sm">
            <RegistrationTableHead
              allSelected={
                selectedIds.size === registrations.length &&
                registrations.length > 0
              }
              onToggleSelectAll={toggleSelectAll}
            />
            <tbody>
              {registrations.map((reg) => (
                <RegistrationTableRow key={reg._id} reg={reg} ctx={tableCtx} />
              ))}
            </tbody>
          </table>
          <ConnectionInfiniteScroll
            hasNextPage={hasNextPage}
            onLoadMore={() => void loadMore()}
            loading={loading && registrations.length === 0}
            loadingMore={isLoadingMore}
            loadedCount={registrations.length}
            totalCount={total}
          />
        </GlassPanel>
      )}
    </div>
  );
}
