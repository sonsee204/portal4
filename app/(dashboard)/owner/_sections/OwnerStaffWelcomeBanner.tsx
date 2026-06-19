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

import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { formatVenuePermissionSummary } from '@/lib/venue/venue-action-labels';

export function OwnerStaffWelcomeBanner() {
  const { isOwner, selectedVenue, permissions } = useVenueContext();

  if (isOwner || !selectedVenue) {
    return null;
  }

  return (
    <GlassPanel card className="border-primary/20 bg-primary/5 p-4">
      <div className="flex flex-wrap items-start gap-3">
        <div className="bg-primary/10 text-primary flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
          <IonIcon name="people-outline" size="md" />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-heading text-sm font-semibold">
              Bạn đang quản lý với tư cách nhân viên
            </p>
            <Badge variant="info">Nhân viên</Badge>
          </div>
          <p className="text-muted text-sm">
            Cơ sở:{' '}
            <span className="text-heading font-medium">
              {selectedVenue.name}
            </span>
          </p>
          <p className="text-faint text-xs">
            Quyền được cấp: {formatVenuePermissionSummary(permissions)}
          </p>
        </div>
      </div>
    </GlassPanel>
  );
}
