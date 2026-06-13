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

import { Checkbox } from '@/components/atoms/Checkbox';
import { GlassPanel } from '@/components/molecules/GlassPanel';

interface Permission {
  key: string;
  label: string;
  category: string;
}

const PERMISSIONS: Permission[] = [
  {
    key: 'user.create_edit',
    label: 'Tạo/Sửa người dùng',
    category: 'User Management',
  },
  { key: 'user.delete', label: 'Xoá người dùng', category: 'User Management' },
  {
    key: 'finance.view',
    label: 'Xem Dashboard tài chính',
    category: 'Finance',
  },
  { key: 'finance.refund', label: 'Xử lý hoàn tiền', category: 'Finance' },
  { key: 'ops.tournaments', label: 'Quản lý giải đấu', category: 'Operations' },
  { key: 'ops.scores', label: 'Sửa điểm trận đấu', category: 'Operations' },
];

const ROLE_PERMISSIONS: Record<string, Record<string, boolean>> = {
  super_admin: {
    'user.create_edit': true,
    'user.delete': true,
    'finance.view': true,
    'finance.refund': true,
    'ops.tournaments': true,
    'ops.scores': true,
  },
  staff: {
    'user.create_edit': true,
    'user.delete': false,
    'finance.view': true,
    'finance.refund': false,
    'ops.tournaments': true,
    'ops.scores': true,
  },
  moderator: {
    'user.create_edit': false,
    'user.delete': false,
    'finance.view': false,
    'finance.refund': false,
    'ops.tournaments': false,
    'ops.scores': false,
  },
};

const roles = ['super_admin', 'staff', 'moderator'];
const roleLabels: Record<string, string> = {
  super_admin: 'Super Admin',
  staff: 'Staff',
  moderator: 'Moderator',
};

export function PermissionMatrix() {
  const categories = [...new Set(PERMISSIONS.map((p) => p.category))];

  return (
    <GlassPanel card>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-surface-border border-b">
              <th className="text-faint px-4 py-3 text-left text-xs font-bold tracking-wider uppercase">
                Permission
              </th>
              {roles.map((r) => (
                <th
                  key={r}
                  className="text-faint px-4 py-3 text-center text-xs font-bold tracking-wider uppercase"
                >
                  {roleLabels[r]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <>
                <tr key={cat}>
                  <td
                    colSpan={roles.length + 1}
                    className="bg-surface/50 text-primary px-4 py-2 text-xs font-bold tracking-wider uppercase"
                  >
                    {cat}
                  </td>
                </tr>
                {PERMISSIONS.filter((p) => p.category === cat).map((perm) => (
                  <tr
                    key={perm.key}
                    className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                  >
                    <td className="text-body px-4 py-2.5 text-sm">
                      {perm.label}
                    </td>
                    {roles.map((role) => (
                      <td key={role} className="px-4 py-2.5 text-center">
                        <Checkbox
                          checked={ROLE_PERMISSIONS[role]?.[perm.key] ?? false}
                          onChange={() => {}}
                          className="justify-center"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </GlassPanel>
  );
}
