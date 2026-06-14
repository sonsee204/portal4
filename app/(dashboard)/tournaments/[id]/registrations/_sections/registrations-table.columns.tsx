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

export const REGISTRATION_TABLE_HEADERS = [
  'Vận động viên',
  'SBD',
  'Nội dung đăng ký',
  'SĐT / Email',
  'Ngày sinh',
  'Phí',
  'Trạng thái',
  'Thanh toán',
  'Ngày đăng ký',
  'Thao tác',
] as const;

export type { RegistrationTableColumnContext } from './registrations-table.row';

interface RegistrationTableHeadProps {
  allSelected: boolean;
  onToggleSelectAll: () => void;
}

export function RegistrationTableHead({
  allSelected,
  onToggleSelectAll,
}: RegistrationTableHeadProps) {
  return (
    <thead>
      <tr className="border-surface-border border-b">
        <th className="p-3 text-left">
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            className="accent-primary"
          />
        </th>
        {REGISTRATION_TABLE_HEADERS.map((label) => (
          <th key={label} className="text-secondary p-3 text-left font-medium">
            {label}
          </th>
        ))}
      </tr>
    </thead>
  );
}
