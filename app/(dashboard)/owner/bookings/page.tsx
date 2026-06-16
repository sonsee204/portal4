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

import { useOwnerBookingsPageActions } from './_hooks/useOwnerBookingsPageActions';
import { useOwnerBookingsPageData } from './_hooks/useOwnerBookingsPageData';
import { OwnerBookingsHeaderSection } from './_sections/OwnerBookingsHeaderSection';
import { OwnerBookingsTableSection } from './_sections/OwnerBookingsTableSection';

export default function OwnerBookingsPage() {
  const data = useOwnerBookingsPageData();
  const actions = useOwnerBookingsPageActions(data);

  return (
    <>
      <OwnerBookingsHeaderSection />
      <OwnerBookingsTableSection data={data} actions={actions} />
    </>
  );
}
