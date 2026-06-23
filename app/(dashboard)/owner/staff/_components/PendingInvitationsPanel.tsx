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

import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Badge } from '@/components/atoms/Badge';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { VenueStaffNode } from '@/hooks/owner';
import { formatVenuePermissionSummary } from '@/lib/venue/venue-action-labels';

interface PendingInvitationsPanelProps {
  invitations: VenueStaffNode[];
  disabled?: boolean;
  onCancel: (member: VenueStaffNode) => void;
}

export function PendingInvitationsPanel({
  invitations,
  disabled,
  onCancel,
}: PendingInvitationsPanelProps) {
  if (invitations.length === 0) return null;

  return (
    <GlassPanel card className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
          <IonIcon name="time-outline" size="sm" className="text-amber-500" />
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="text-heading text-sm font-semibold">
            Đang chờ chấp nhận
          </h3>
          <p className="text-muted text-xs">
            {invitations.length} lời mời — nhân viên xác nhận trên ứng dụng
            mobile
          </p>
        </div>
        <Badge variant="warning">{invitations.length}</Badge>
      </div>

      <div className="space-y-3">
        {invitations.map((invitation) => (
          <div
            key={invitation._id}
            className="border-surface-border flex flex-wrap items-center justify-between gap-3 rounded-xl border p-4"
          >
            <div className="min-w-0">
              <p className="text-heading text-sm font-medium">
                {invitation.user?.displayName ?? '—'}
              </p>
              {invitation.customTitle ? (
                <p className="text-faint text-xs">{invitation.customTitle}</p>
              ) : null}
              <p className="text-muted mt-1 text-xs">
                {invitation.user?.phone ?? '—'}
              </p>
              <p className="text-muted mt-1 max-w-md text-xs">
                {formatVenuePermissionSummary(invitation.permissions)}
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
              disabled={disabled}
              onClick={() => onCancel(invitation)}
            >
              Hủy lời mời
            </Button>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}
