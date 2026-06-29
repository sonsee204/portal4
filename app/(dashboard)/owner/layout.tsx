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

import { ownerSidebarNav } from '@/config/navigation';
import { WorkspaceDashboardShell } from '@/components/templates/WorkspaceDashboardShell';
import { VenueContextProvider } from '@/components/providers/VenueContextProvider';
import { OwnerDateRangeProvider } from '@/components/providers/OwnerDateRangeProvider';
import { VenueRouteGuard } from '@/components/atoms/VenueRouteGuard';

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <VenueContextProvider>
      <OwnerDateRangeProvider>
        <VenueRouteGuard>
          <WorkspaceDashboardShell workspace="owner" nav={ownerSidebarNav}>
            {children}
          </WorkspaceDashboardShell>
        </VenueRouteGuard>
      </OwnerDateRangeProvider>
    </VenueContextProvider>
  );
}
