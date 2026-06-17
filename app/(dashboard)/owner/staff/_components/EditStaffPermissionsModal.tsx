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

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import type { VenueStaffNode } from '@/hooks/owner';
import type { VenueAction } from '@/graphql/generated';
import { VenueAction as VenueActionEnum } from '@/graphql/generated';
import { mergeVenuePermissions } from '@/lib/venue/venue-action-labels';
import { StaffPermissionsForm } from './StaffPermissionsForm';

interface EditStaffPermissionsModalProps {
  staff: VenueStaffNode | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSave: (userId: string, permissions: VenueAction[]) => Promise<boolean>;
}

function EditStaffPermissionsModalContent({
  staff,
  loading,
  onClose,
  onSave,
}: {
  staff: VenueStaffNode;
  loading?: boolean;
  onClose: () => void;
  onSave: (userId: string, permissions: VenueAction[]) => Promise<boolean>;
}) {
  const [permissions, setPermissions] = useState<VenueAction[]>(() =>
    staff.permissions.filter((p) => p !== VenueActionEnum.View)
  );

  const handleSave = async () => {
    if (!staff.user?._id) return;
    const ok = await onSave(staff.user._id, mergeVenuePermissions(permissions));
    if (ok) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Chỉnh sửa quyền nhân viên"
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Huỷ
          </Button>
          <Button
            size="sm"
            onClick={() => void handleSave()}
            disabled={loading}
          >
            Lưu quyền
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-muted text-sm">
          Nhân viên:{' '}
          <span className="text-heading font-medium">
            {staff.user?.displayName ?? '—'}
          </span>
        </p>
        <StaffPermissionsForm
          selected={permissions}
          onChange={setPermissions}
          disabled={staff.isOwner}
        />
        {staff.isOwner && (
          <p className="text-faint text-xs">
            Chủ sân có toàn bộ quyền và không thể chỉnh sửa.
          </p>
        )}
      </div>
    </Modal>
  );
}

export function EditStaffPermissionsModal({
  staff,
  open,
  loading,
  onClose,
  onSave,
}: EditStaffPermissionsModalProps) {
  if (!open || !staff) return null;

  return (
    <EditStaffPermissionsModalContent
      key={staff._id}
      staff={staff}
      loading={loading}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
