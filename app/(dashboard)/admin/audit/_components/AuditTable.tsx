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

import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import type { AuditLogEntry } from '@/hooks/audit';
import type { AuditAction, AuditCategory } from '@/types';
import type { BadgeVariant } from '@/config/theme';
import { formatDateTime } from '@/lib/utils';
import { AUDIT, COMMON } from '@/lib/strings';

interface AuditTableProps {
  logs: AuditLogEntry[];
  loading: boolean;
  onViewDetail: (log: AuditLogEntry) => void;
}

const ACTION_LABELS: Record<AuditAction, string> = AUDIT.ACTIONS;

const ACTION_VARIANT: Record<AuditAction, BadgeVariant> = {
  LOGIN: 'neutral',
  LOGIN_FAILED: 'danger',
  LOGOUT: 'neutral',
  LOGOUT_ALL: 'neutral',
  PASSWORD_CHANGE: 'info',
  PASSWORD_RESET: 'info',
  ACCOUNT_REGISTER: 'success',
  TOKEN_REFRESH_FAILED: 'danger',
  USER_CREATE: 'success',
  USER_SUSPEND: 'danger',
  USER_UNSUSPEND: 'success',
  USER_ROLE_CHANGE: 'warning',
  USER_DELETE: 'danger',
  VENUE_APPROVE: 'success',
  VENUE_REJECT: 'danger',
  VENUE_SUSPEND: 'warning',
  RATE_LIMIT_HIT: 'warning',
  CONFIG_CHANGE: 'info',
  SYSTEM_ERROR: 'danger',
};

const CATEGORY_LABELS: Record<AuditCategory, string> = AUDIT.CATEGORIES;

function getInitials(name?: string | null): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const columns = [
  { key: 'admin', label: AUDIT.COLUMNS.ADMIN },
  { key: 'category', label: AUDIT.COLUMNS.CATEGORY },
  { key: 'action', label: AUDIT.COLUMNS.ACTION },
  { key: 'target', label: AUDIT.COLUMNS.TARGET },
  { key: 'ip', label: AUDIT.COLUMNS.IP },
  { key: 'timestamp', label: AUDIT.COLUMNS.TIMESTAMP, sortable: true },
  { key: 'status', label: AUDIT.COLUMNS.STATUS },
  { key: 'actions', label: '', align: 'right' as const },
];

export function AuditTable({ logs, loading, onViewDetail }: AuditTableProps) {
  if (loading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-surface-hover h-14 animate-pulse rounded-lg"
          />
        ))}
      </div>
    );
  }

  return (
    <DataTable
      columns={columns}
      data={logs}
      emptyTitle={AUDIT.EMPTY.TITLE}
      emptyDescription={AUDIT.EMPTY.DESCRIPTION}
      renderRow={(log) => (
        <tr
          key={log._id}
          className="border-surface-border hover:bg-surface-hover border-b transition-colors"
        >
          <td className="px-4 py-3">
            <div className="flex items-center gap-2">
              <div className="bg-primary/20 text-primary flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold">
                {getInitials(log.actorName)}
              </div>
              <div>
                <span className="text-heading text-sm">
                  {log.actorName || AUDIT.ACTOR_SYSTEM}
                </span>
                {log.actorRole && (
                  <p className="text-faint text-xs">{log.actorRole}</p>
                )}
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-muted text-xs font-medium">
              {CATEGORY_LABELS[log.category as AuditCategory] ?? log.category}
            </span>
          </td>
          <td className="px-4 py-3">
            <Badge
              variant={ACTION_VARIANT[log.action as AuditAction] ?? 'neutral'}
            >
              {ACTION_LABELS[log.action as AuditAction] ?? log.action}
            </Badge>
          </td>
          <td className="text-muted max-w-[200px] truncate px-4 py-3 font-mono text-xs">
            {log.target || '—'}
          </td>
          <td className="text-faint px-4 py-3 font-mono text-xs">
            {log.ip || '—'}
          </td>
          <td className="text-muted px-4 py-3 font-mono text-xs">
            {formatDateTime(log.createdAt)}
          </td>
          <td className="px-4 py-3">
            <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'}>
              {log.status === 'SUCCESS'
                ? AUDIT.STATUS.SUCCESS
                : AUDIT.STATUS.FAILED}
            </Badge>
          </td>
          <td className="px-4 py-3 text-right">
            <div className="flex items-center justify-end">
              <IconButton
                icon="eye-outline"
                size="sm"
                tooltip={COMMON.VIEW_DETAIL}
                onClick={() => onViewDetail(log)}
              />
            </div>
          </td>
        </tr>
      )}
    />
  );
}
