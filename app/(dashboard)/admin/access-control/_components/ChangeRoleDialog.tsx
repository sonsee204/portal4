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

import { useMutation } from '@apollo/client/react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/molecules/Modal';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { ADMIN_CHANGE_USER_ROLE } from '@/graphql/admin/mutations';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import type { UserRole } from '@/types';

const changeRoleSchema = z.object({
  role: z.enum(['SUPER_ADMIN', 'ADMIN', 'FACILITY_OWNER', 'PLAYER']),
});

type ChangeRoleForm = z.infer<typeof changeRoleSchema>;

interface ChangeRoleDialogProps {
  open: boolean;
  user: {
    _id: string;
    fullName: string;
    role: string;
  } | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ALL_ROLES: UserRole[] = [
  'SUPER_ADMIN',
  'ADMIN',
  'FACILITY_OWNER',
  'PLAYER',
];

export function ChangeRoleDialog({
  open,
  user,
  onClose,
  onSuccess,
}: ChangeRoleDialogProps) {
  const { control, handleSubmit, reset } = useForm<ChangeRoleForm>({
    resolver: zodResolver(changeRoleSchema),
    defaultValues: { role: 'PLAYER' },
  });

  const [changeRole, { loading }] = useMutation(ADMIN_CHANGE_USER_ROLE, {
    onCompleted: () => {
      showSuccess('Đã cập nhật vai trò thành công');
      onSuccess();
      onClose();
      reset();
    },
    onError: (err) => showError(formatMutationError(err)),
  });

  if (!user) return null;

  const onSubmit = (values: ChangeRoleForm) => {
    void changeRole({
      variables: { userId: user._id, role: values.role },
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Thay đổi vai trò"
      size="sm"
      footer={
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Hủy
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </div>
      }
    >
      <p className="text-muted mb-4 text-sm">
        Người dùng:{' '}
        <span className="text-heading font-medium">{user.fullName}</span>
      </p>
      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <Select
            label="Vai trò mới"
            value={field.value}
            onChange={field.onChange}
            options={ALL_ROLES.map((role) => ({
              value: role,
              label: ROLE_DISPLAY_NAMES[role] ?? role,
            }))}
          />
        )}
      />
      <p className="text-faint mt-3 text-xs">
        Phong/giáng Super Admin chỉ Owner có thể thực hiện. Thay đổi có hiệu lực
        ngay sau khi lưu.
      </p>
    </Modal>
  );
}
