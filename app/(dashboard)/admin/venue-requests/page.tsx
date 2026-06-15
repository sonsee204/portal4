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

import { useVenueRequestsPageActions } from './_hooks/useVenueRequestsPageActions';
import { useVenueRequestsPageData } from './_hooks/useVenueRequestsPageData';
import { VenueRequestsDetailSection } from './_sections/VenueRequestsDetailSection';
import { VenueRequestsHeaderSection } from './_sections/VenueRequestsHeaderSection';
import { VenueRequestsStatsSection } from './_sections/VenueRequestsStatsSection';
import { VenueRequestsTableSection } from './_sections/VenueRequestsTableSection';

export default function VenueRequestsPage() {
  const data = useVenueRequestsPageData();
  const actions = useVenueRequestsPageActions(data);

  return (
    <>
      <VenueRequestsHeaderSection />
      <VenueRequestsStatsSection data={data} />
      <div className="mt-6 space-y-6">
        <VenueRequestsTableSection data={data} actions={actions} />
        <VenueRequestsDetailSection data={data} actions={actions} />
      </div>
    </>
  );
}
