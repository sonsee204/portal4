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
import { DataTable } from '@/components/organisms/DataTable';
import type { OtpTestPhone } from '@/lib/api/otp-test-phones';
import { formatDateTime } from '@/lib/utils';
import { OTP_TEST_PHONES } from '@/lib/strings';

import {
  formatPurposes,
  maskPhone,
  OTP_TEST_PHONE_REGISTRY_COLUMNS,
} from './otp-test-phone-registry.helpers';

type OtpTestPhoneRegistryTableProps = {
  items: OtpTestPhone[];
  onEdit: (row: OtpTestPhone) => void;
  onCopyFirebase: (row: OtpTestPhone) => void;
  onToggle: (row: OtpTestPhone) => void;
};

export function OtpTestPhoneRegistryTable({
  items,
  onEdit,
  onCopyFirebase,
  onToggle,
}: OtpTestPhoneRegistryTableProps) {
  const renderRow = (row: OtpTestPhone) => (
    <tr key={row._id} className="hover:bg-surface-hover transition-colors">
      <td className="px-4 py-3 font-mono text-sm">{maskPhone(row.phone)}</td>
      <td className="text-heading px-4 py-3 text-sm">{row.label}</td>
      <td className="px-4 py-3">
        <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs">
          {row.testCode}
        </code>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {formatPurposes(row.allowedPurposes ?? [])}
      </td>
      <td className="px-4 py-3">
        <Badge variant={row.enabled ? 'success' : 'danger'}>
          {row.enabled
            ? OTP_TEST_PHONES.STATUS_ENABLED
            : OTP_TEST_PHONES.STATUS_DISABLED}
        </Badge>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {row.expiresAt
          ? formatDateTime(row.expiresAt)
          : OTP_TEST_PHONES.NO_EXPIRY}
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => onEdit(row)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={OTP_TEST_PHONES.ACTION_EDIT}
          >
            <IonIcon name="create-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => onCopyFirebase(row)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={OTP_TEST_PHONES.ACTION_COPY_FIREBASE}
          >
            <IonIcon name="copy-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => onToggle(row)}
            className={`rounded p-1.5 transition-colors ${
              row.enabled
                ? 'text-red-400 hover:text-red-500'
                : 'text-emerald-400 hover:text-emerald-500'
            }`}
            title={
              row.enabled
                ? OTP_TEST_PHONES.ACTION_DISABLE
                : OTP_TEST_PHONES.ACTION_ENABLE
            }
          >
            <IonIcon
              name={
                row.enabled
                  ? 'close-circle-outline'
                  : 'checkmark-circle-outline'
              }
              size="sm"
            />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <DataTable
      columns={OTP_TEST_PHONE_REGISTRY_COLUMNS}
      data={items}
      renderRow={renderRow}
      emptyTitle={OTP_TEST_PHONES.EMPTY_TITLE}
      emptyDescription={OTP_TEST_PHONES.EMPTY_DESCRIPTION}
    />
  );
}
