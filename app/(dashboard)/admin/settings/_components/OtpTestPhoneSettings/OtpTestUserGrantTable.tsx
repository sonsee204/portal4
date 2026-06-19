/**
 * Ao Trình (NALee Sports)
 */

'use client';

import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { QueryState } from '@/components/molecules/QueryState';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import type { DataTableSortDir } from '@/hooks/shared/useDataTableSort';
import { formatDateTime } from '@/lib/utils';
import { OTP_TEST_USER_GRANTS } from '@/lib/strings/otp-test-user-grants';
import type { OtpTestUserGrant } from '@/lib/api/otp-test-user-grants';

function maskPhoneDisplay(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}•••${phone.slice(-3)}`;
}

const columns: DataTableColumn[] = [
  { key: 'user', label: OTP_TEST_USER_GRANTS.COLUMNS.USER },
  { key: 'phone', label: OTP_TEST_USER_GRANTS.COLUMNS.PHONE, sortable: true },
  { key: 'reason', label: OTP_TEST_USER_GRANTS.COLUMNS.REASON },
  { key: 'testCode', label: OTP_TEST_USER_GRANTS.COLUMNS.CODE },
  {
    key: 'expires',
    label: OTP_TEST_USER_GRANTS.COLUMNS.EXPIRES,
    sortable: true,
    sortField: 'expiresAt',
  },
  { key: 'status', label: OTP_TEST_USER_GRANTS.COLUMNS.STATUS },
  { key: 'createdAt', label: 'Tạo lúc', sortable: true },
  {
    key: 'actions',
    label: OTP_TEST_USER_GRANTS.COLUMNS.ACTIONS,
    align: 'right',
  },
];

interface OtpTestUserGrantTableProps {
  items: OtpTestUserGrant[];
  loading: boolean;
  error: Error | null;
  sortField: string;
  sortDir: DataTableSortDir;
  onSort: (field: string) => void;
  onRetry: () => void;
  onCopyCode: (code: string) => void;
  onRevoke: (row: OtpTestUserGrant) => void;
}

export function OtpTestUserGrantTable({
  items,
  loading,
  error,
  sortField,
  sortDir,
  onSort,
  onRetry,
  onCopyCode,
  onRevoke,
}: OtpTestUserGrantTableProps) {
  return (
    <QueryState loading={loading} error={error ?? undefined} onRetry={onRetry}>
      <DataTable
        columns={columns}
        data={items}
        sortKey={sortField}
        sortDir={sortDir}
        onSort={onSort}
        sortLoading={loading && items.length > 0}
        renderRow={(row) => (
          <tr
            key={row._id}
            className="hover:bg-surface-hover transition-colors"
          >
            <td className="px-4 py-3">
              <p className="text-heading text-sm font-medium">
                {row.userDisplayName}
              </p>
              <p className="text-faint text-xs">{row.userRole}</p>
            </td>
            <td className="px-4 py-3 font-mono text-sm">
              {maskPhoneDisplay(row.phone)}
            </td>
            <td className="text-muted px-4 py-3 text-xs">{row.reason}</td>
            <td className="px-4 py-3">
              <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs">
                {row.testCode}
              </code>
            </td>
            <td className="text-muted px-4 py-3 text-xs">
              {formatDateTime(row.expiresAt)}
            </td>
            <td className="px-4 py-3">
              <Badge variant={row.enabled ? 'success' : 'danger'}>
                {row.enabled
                  ? OTP_TEST_USER_GRANTS.STATUS_ENABLED
                  : OTP_TEST_USER_GRANTS.STATUS_DISABLED}
              </Badge>
            </td>
            <td className="text-muted px-4 py-3 text-xs">
              {formatDateTime(row.createdAt)}
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-1">
                <button
                  type="button"
                  onClick={() => onCopyCode(row.testCode)}
                  className="text-muted hover:text-heading rounded p-1.5 transition-colors"
                  title={OTP_TEST_USER_GRANTS.COPIED_CODE}
                >
                  <IonIcon name="copy-outline" size="sm" />
                </button>
                <button
                  type="button"
                  onClick={() => onRevoke(row)}
                  className="rounded p-1.5 text-red-400 transition-colors hover:text-red-500"
                  title={OTP_TEST_USER_GRANTS.REVOKE}
                >
                  <IonIcon name="close-circle-outline" size="sm" />
                </button>
              </div>
            </td>
          </tr>
        )}
        emptyTitle={OTP_TEST_USER_GRANTS.EMPTY_TITLE}
        emptyDescription={OTP_TEST_USER_GRANTS.EMPTY_DESCRIPTION}
      />
    </QueryState>
  );
}
