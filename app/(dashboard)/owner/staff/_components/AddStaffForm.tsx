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
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import type { VenueAction } from '@/graphql/generated';
import { mergeVenuePermissions } from '@/lib/venue/venue-action-labels';
import { StaffPermissionsForm } from './StaffPermissionsForm';

interface AddStaffFormProps {
  loading?: boolean;
  formId?: string;
  showSubmit?: boolean;
  onSubmit: (userId: string, permissions: VenueAction[]) => Promise<boolean>;
}

export function AddStaffForm({
  loading,
  formId,
  showSubmit = true,
  onSubmit,
}: AddStaffFormProps) {
  const [userId, setUserId] = useState('');
  const [permissions, setPermissions] = useState<VenueAction[]>([]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!userId.trim()) return;
    const ok = await onSubmit(
      userId.trim(),
      mergeVenuePermissions(permissions)
    );
    if (ok) {
      setUserId('');
      setPermissions([]);
    }
  };

  return (
    <form
      id={formId}
      onSubmit={(e) => void handleSubmit(e)}
      className="space-y-4"
    >
      <Input
        label="ID người dùng"
        placeholder="Nhập userId để thêm nhân viên"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        leftIcon="person-outline"
        required
      />
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
          disabled={!userId.trim() || loading}
        >
          {loading ? 'Đang thêm...' : 'Thêm nhân viên'}
        </Button>
      ) : null}
    </form>
  );
}
