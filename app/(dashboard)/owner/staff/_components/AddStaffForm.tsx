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
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import {
  UserPhoneLookupField,
  type UserPhoneLookupResult,
} from '@/components/molecules/UserPhoneLookupField';
import type { VenueAction } from '@/graphql/generated';
import { mergeVenuePermissions } from '@/lib/venue/venue-action-labels';
import { StaffPermissionsForm } from './StaffPermissionsForm';

const CUSTOM_TITLE_MAX_LENGTH = 50;

export type AddStaffSubmitInput = {
  userId: string;
  permissions: VenueAction[];
  customTitle?: string;
};

interface AddStaffFormProps {
  loading?: boolean;
  formId?: string;
  showSubmit?: boolean;
  onSubmit: (input: AddStaffSubmitInput) => Promise<boolean>;
}

export function AddStaffForm({
  loading,
  formId,
  showSubmit = true,
  onSubmit,
}: AddStaffFormProps) {
  const [phone, setPhone] = useState('');
  const [selectedUser, setSelectedUser] =
    useState<UserPhoneLookupResult | null>(null);
  const [permissions, setPermissions] = useState<VenueAction[]>([]);
  const [customTitle, setCustomTitle] = useState('');

  const resetForm = () => {
    setPhone('');
    setSelectedUser(null);
    setPermissions([]);
    setCustomTitle('');
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedUser?._id) return;

    const trimmedTitle = customTitle.trim();
    const ok = await onSubmit({
      userId: selectedUser._id,
      permissions: mergeVenuePermissions(permissions),
      ...(trimmedTitle ? { customTitle: trimmedTitle } : {}),
    });
    if (ok) {
      resetForm();
    }
  };

  return (
    <form
      id={formId}
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-4"
    >
      <input type="hidden" value={selectedUser?._id ?? ''} required readOnly />

      <UserPhoneLookupField
        phone={phone}
        onPhoneChange={(value) => {
          setPhone(value);
          setSelectedUser(null);
        }}
        selectedUser={selectedUser}
        onUserChange={setSelectedUser}
        phoneLabel="Số điện thoại"
        phonePlaceholder="0901234567"
        requireRegisteredUser
        autoApply
      />

      <div>
        <Input
          label="Chức danh"
          placeholder="VD: Lễ tân, Thu ngân"
          value={customTitle}
          onChange={(event) => setCustomTitle(event.target.value)}
          maxLength={CUSTOM_TITLE_MAX_LENGTH}
        />
        <p className="text-faint mt-1 text-xs">
          Tùy chọn — hiển thị bên cạnh tên nhân viên.
        </p>
      </div>

      <div>
        <p className="text-body mb-2 text-sm font-medium">Quyền truy cập</p>
        <StaffPermissionsForm
          selected={permissions}
          onChange={setPermissions}
        />
      </div>

      {showSubmit ? (
        <Button
          type="submit"
          iconLeft="person-add-outline"
          disabled={!selectedUser?._id || loading}
        >
          {loading ? 'Đang thêm...' : 'Thêm nhân viên'}
        </Button>
      ) : null}
    </form>
  );
}
