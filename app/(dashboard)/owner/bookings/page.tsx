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

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import { DataTable } from '@/components/organisms/DataTable';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Select } from '@/components/atoms/Select';
import { Badge } from '@/components/atoms/Badge';
import { QueryState } from '@/components/molecules/QueryState';
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { useMyVenues, useVenueBookings } from '@/hooks/owner';
import { formatCurrency } from '@/lib/utils';
import {
  BOOKING_STATUS_LABEL,
  BOOKING_STATUS_VARIANT,
} from '@/lib/constants/booking-status';

export default function OwnerBookingsPage() {
  const { venues, loading: venuesLoading } = useMyVenues({ limit: 50 });
  const [venueId, setVenueId] = useState('');

  const effectiveVenueId = venueId || venues[0]?._id || null;
  const {
    bookings,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
  } = useVenueBookings(effectiveVenueId, undefined, { limit: 20 });

  const venueOptions = useMemo(
    () => venues.map((v) => ({ label: v.name, value: v._id })),
    [venues]
  );

  return (
    <>
      <PageHeader
        title="Đặt sân"
        description="Danh sách đặt sân theo từng cơ sở."
      />

      <GlassPanel card className="mt-6 space-y-4">
        {venueOptions.length > 0 && (
          <Select
            label="Chọn sân"
            options={venueOptions}
            value={effectiveVenueId ?? ''}
            onChange={(e) => setVenueId(e.target.value)}
          />
        )}

        <QueryState
          loading={(loading || venuesLoading) && bookings.length === 0}
          error={error}
          empty={!loading && !effectiveVenueId}
          emptyMessage="Chọn sân để xem đặt chỗ."
          onRetry={() => void refetch()}
        >
          <DataTable
            columns={[
              { key: 'date', label: 'Ngày' },
              { key: 'slots', label: 'Khung giờ' },
              { key: 'customer', label: 'Khách' },
              { key: 'amount', label: 'Số tiền' },
              { key: 'status', label: 'Trạng thái' },
            ]}
            data={bookings}
            renderRow={(b) => {
              const slotLabel = b.slots
                ?.map((s) => `${s.courtName} ${s.startTime}-${s.endTime}`)
                .join(', ');
              return (
                <tr
                  key={b._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="text-body px-4 py-3 text-sm">{b.date}</td>
                  <td className="text-muted px-4 py-3 text-xs">
                    {slotLabel || '—'}
                  </td>
                  <td className="text-body px-4 py-3 text-sm">
                    {b.customer?.displayName ?? '—'}
                  </td>
                  <td className="px-4 py-3 text-sm font-medium text-emerald-400">
                    {formatCurrency(b.finalAmount ?? b.totalPrice)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={BOOKING_STATUS_VARIANT[b.status] ?? 'neutral'}
                    >
                      {BOOKING_STATUS_LABEL[b.status] ?? b.status}
                    </Badge>
                  </td>
                </tr>
              );
            }}
          />
        </QueryState>
        <ConnectionPager
          loadedCount={bookings.length}
          totalCount={totalCount}
          hasNextPage={hasNextPage}
          onNext={() => void loadMore()}
          loading={loading}
        />
      </GlassPanel>
    </>
  );
}
