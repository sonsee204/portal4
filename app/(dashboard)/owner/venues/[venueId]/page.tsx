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

import { use } from 'react';
import { QueryState } from '@/components/molecules/QueryState';
import { useVenueDetailPageData } from './_hooks/useVenueDetailPageData';
import { useVenueDetailPageActions } from './_hooks/useVenueDetailPageActions';
import { VenueDetailHeaderSection } from './_sections/VenueDetailHeaderSection';
import { VenueEditFormSection } from './_sections/VenueEditFormSection';
import { VenueCourtsSection } from './_sections/VenueCourtsSection';
import { CourtFormModal } from './_components/CourtFormModal';
import { DeleteCourtDialog } from './_components/DeleteCourtDialog';

export default function OwnerVenueDetailPage({
  params,
}: {
  params: Promise<{ venueId: string }>;
}) {
  const { venueId } = use(params);
  const data = useVenueDetailPageData(venueId);
  const actions = useVenueDetailPageActions();

  return (
    <>
      <VenueDetailHeaderSection data={data} />

      <QueryState
        loading={data.loading && !data.venue}
        error={data.error}
        empty={!data.loading && !data.venue}
        emptyMessage="Không tìm thấy sân hoặc bạn không có quyền truy cập."
        onRetry={() => data.refetchAll()}
      >
        <div className="mt-6 space-y-6">
          <VenueEditFormSection data={data} />
          <VenueCourtsSection data={data} actions={actions} />
        </div>
      </QueryState>

      <CourtFormModal
        venueId={venueId}
        actions={actions}
        onSaved={() => data.refetchAll()}
      />
      <DeleteCourtDialog
        venueId={venueId}
        actions={actions}
        onDeleted={() => data.refetchAll()}
      />
    </>
  );
}
