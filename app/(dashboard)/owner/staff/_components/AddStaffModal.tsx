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

import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import type { VenueAction } from '@/graphql/generated';
import { AddStaffForm } from './AddStaffForm';

const ADD_STAFF_FORM_ID = 'add-staff-form';

interface AddStaffModalProps {
  open: boolean;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (userId: string, permissions: VenueAction[]) => Promise<boolean>;
}

function AddStaffModalContent({
  loading,
  onClose,
  onSubmit,
}: Omit<AddStaffModalProps, 'open'>) {
  const handleSubmit = async (userId: string, permissions: VenueAction[]) => {
    const ok = await onSubmit(userId, permissions);
    if (ok) onClose();
    return ok;
  };

  return (
    <Modal
      open
      onClose={onClose}
      title="Thêm nhân viên"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Huỷ
          </Button>
          <Button
            type="submit"
            form={ADD_STAFF_FORM_ID}
            iconLeft="person-add-outline"
            disabled={loading}
          >
            {loading ? 'Đang thêm...' : 'Thêm nhân viên'}
          </Button>
        </>
      }
    >
      <AddStaffForm
        formId={ADD_STAFF_FORM_ID}
        showSubmit={false}
        loading={loading}
        onSubmit={handleSubmit}
      />
    </Modal>
  );
}

export function AddStaffModal({
  open,
  loading,
  onClose,
  onSubmit,
}: AddStaffModalProps) {
  if (!open) return null;

  return (
    <AddStaffModalContent
      key="add-staff-modal"
      loading={loading}
      onClose={onClose}
      onSubmit={onSubmit}
    />
  );
}
