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

import { useEffect, useCallback } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { IconButton } from '@/components/atoms/IconButton';
import type { AuditLogEntry } from '@/hooks/audit';
import type { AuditAction, AuditCategory } from '@/types';
import type { BadgeVariant } from '@/config/theme';
import { formatDateTime } from '@/lib/utils';
import { AUDIT, COMMON } from '@/lib/strings';

interface AuditDetailDrawerProps {
  log: AuditLogEntry | null;
  onClose: () => void;
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

function DetailRow({
  icon,
  label,
  value,
  mono,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <IonIcon name={icon} className="text-faint mt-0.5" size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-faint text-xs">{label}</p>
        <p
          className={`text-heading text-sm break-all ${mono ? 'font-mono' : ''}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

export function AuditDetailDrawer({ log, onClose }: AuditDetailDrawerProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (log) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [log, handleEscape]);

  if (!log) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="bg-bg border-surface-border fixed inset-y-0 right-0 z-50 w-full max-w-lg border-l shadow-2xl">
        <div className="flex h-full flex-col overflow-y-auto">
          {/* Header */}
          <div className="border-surface-border flex items-center justify-between border-b p-4">
            <h2 className="text-heading text-lg font-semibold">
              {AUDIT.DETAIL.TITLE}
            </h2>
            <IconButton
              icon="close-outline"
              size="sm"
              onClick={onClose}
              tooltip={COMMON.CLOSE}
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1 p-4">
            {/* Status and Action badges */}
            <div className="mb-4 flex items-center gap-2">
              <Badge
                variant={ACTION_VARIANT[log.action as AuditAction] ?? 'neutral'}
              >
                {ACTION_LABELS[log.action as AuditAction] ?? log.action}
              </Badge>
              <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'}>
                {log.status === 'SUCCESS'
                  ? AUDIT.STATUS.SUCCESS
                  : AUDIT.STATUS.FAILED}
              </Badge>
            </div>

            <DetailRow
              icon="person-outline"
              label={AUDIT.DETAIL.ACTOR}
              value={log.actorName || AUDIT.ACTOR_SYSTEM}
            />
            <DetailRow
              icon="shield-outline"
              label={AUDIT.DETAIL.ROLE}
              value={log.actorRole}
            />
            <DetailRow
              icon="layers-outline"
              label={AUDIT.DETAIL.CATEGORY}
              value={
                CATEGORY_LABELS[log.category as AuditCategory] ?? log.category
              }
            />
            <DetailRow
              icon="locate-outline"
              label={AUDIT.DETAIL.TARGET}
              value={log.target}
              mono
            />
            {log.targetId && (
              <DetailRow
                icon="finger-print-outline"
                label={AUDIT.DETAIL.TARGET_ID}
                value={log.targetId}
                mono
              />
            )}
            <DetailRow
              icon="globe-outline"
              label={AUDIT.DETAIL.IP}
              value={log.ip}
              mono
            />
            <DetailRow
              icon="phone-portrait-outline"
              label={AUDIT.DETAIL.USER_AGENT}
              value={log.userAgent}
              mono
            />
            <DetailRow
              icon="link-outline"
              label={AUDIT.DETAIL.CORRELATION_ID}
              value={log.correlationId}
              mono
            />
            <DetailRow
              icon="time-outline"
              label={AUDIT.DETAIL.TIMESTAMP}
              value={formatDateTime(log.createdAt)}
            />

            {/* Error message */}
            {log.errorMessage && (
              <div className="mt-4 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
                <div className="flex items-center gap-2">
                  <IonIcon
                    name="alert-circle-outline"
                    className="text-red-400"
                    size="sm"
                  />
                  <p className="text-sm font-medium text-red-400">
                    {AUDIT.DETAIL.ERROR_TITLE}
                  </p>
                </div>
                <p className="text-muted mt-1 font-mono text-xs">
                  {log.errorMessage}
                </p>
              </div>
            )}

            {/* Metadata */}
            {log.metadata && Object.keys(log.metadata).length > 0 && (
              <div className="mt-4">
                <p className="text-faint mb-2 text-xs font-semibold tracking-wider uppercase">
                  Metadata
                </p>
                <pre className="bg-surface border-surface-border text-muted overflow-auto rounded-lg border p-3 font-mono text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
              </div>
            )}

            {/* ID */}
            <div className="border-surface-border mt-6 border-t pt-4">
              <p className="text-faint font-mono text-xs">ID: {log._id}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
