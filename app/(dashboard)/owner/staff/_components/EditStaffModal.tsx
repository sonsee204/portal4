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
import { Input } from '@/components/atoms/Input';
import type { VenueStaffNode } from '@/hooks/owner';
import type { VenueAction } from '@/graphql/generated';
import { VenueAction as VenueActionEnum } from '@/graphql/generated';
import { mergeVenuePermissions } from '@/lib/venue/venue-action-labels';
import { StaffPermissionsForm } from './StaffPermissionsForm';

const CUSTOM_TITLE_MAX_LENGTH = 50;

export type EditStaffSaveInput = {
  permissions: VenueAction[];
  customTitle: string;
};

interface EditStaffModalProps {
  staff: VenueStaffNode | null;
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSave: (
    userId: string,
    input: EditStaffSaveInput,
    staff: VenueStaffNode,
  ) => Promise<boolean>;
}

function EditStaffModalContent({
  staff,
  loading,
  onClose,
  onSave,
}: {
  staff: VenueStaffNode;
  loading?: boolean;
  onClose: () => void;
  onSave: EditStaffModalProps['onSave'];
}) {
  const [permissions, setPermissions] = useState<VenueAction[]>(() =>
    (staff.permissions ?? []).filter((p) => p !== VenueActionEnum.View),
  );
  const [customTitle, setCustomTitle] = useState(staff.customTitle ?? '');

  const handleSave = async () => {
    if (!staff.user?._id) return;
    const ok = await onSave(
      staff.user._id,
      {
        permissions: mergeVenuePermissions(permissions),
        customTitle: customTitle.trim(),
      },
      staff,
    );
    if (ok) onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Chỉnh sửa nhân viên"
      size="lg"
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
            Lưu thay đổi
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

        <div>
          <Input
            label="Chức danh"
            placeholder="VD: Lễ tân, Thu ngân"
            value={customTitle}
            onChange={(event) => setCustomTitle(event.target.value)}
            maxLength={CUSTOM_TITLE_MAX_LENGTH}
            disabled={staff.isOwner}
          />
          <p className="text-faint mt-1 text-xs">
            {staff.isOwner
              ? 'Chủ sân không cần chức danh tùy chỉnh.'
              : 'Tùy chọn — hiển thị bên cạnh tên nhân viên.'}
          </p>
        </div>

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

export function EditStaffModal({
  staff,
  open,
  loading,
  onClose,
  onSave,
}: EditStaffModalProps) {
  if (!open || !staff) return null;

  return (
    <EditStaffModalContent
      key={staff._id}
      staff={staff}
      loading={loading}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
