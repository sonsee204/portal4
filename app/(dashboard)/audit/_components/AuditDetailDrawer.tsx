'use client';

import { useEffect, useCallback } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { IconButton } from '@/components/atoms/IconButton';
import type { AuditLog, AuditAction, AuditCategory } from '@/types';
import type { BadgeVariant } from '@/config/theme';

interface AuditDetailDrawerProps {
  log: AuditLog | null;
  onClose: () => void;
}

const ACTION_LABELS: Record<AuditAction, string> = {
  LOGIN: 'Đăng nhập',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  LOGOUT: 'Đăng xuất',
  LOGOUT_ALL: 'Đăng xuất tất cả',
  PASSWORD_CHANGE: 'Đổi mật khẩu',
  PASSWORD_RESET: 'Đặt lại mật khẩu',
  ACCOUNT_REGISTER: 'Đăng ký tài khoản',
  TOKEN_REFRESH_FAILED: 'Làm mới token thất bại',
  USER_CREATE: 'Tạo người dùng',
  USER_SUSPEND: 'Khóa tài khoản',
  USER_UNSUSPEND: 'Mở khóa tài khoản',
  USER_ROLE_CHANGE: 'Thay đổi vai trò',
  USER_DELETE: 'Xóa tài khoản',
  VENUE_APPROVE: 'Duyệt sân',
  VENUE_REJECT: 'Từ chối sân',
  VENUE_SUSPEND: 'Tạm ngưng sân',
  RATE_LIMIT_HIT: 'Vượt giới hạn',
  CONFIG_CHANGE: 'Thay đổi cấu hình',
  SYSTEM_ERROR: 'Lỗi hệ thống',
};

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

const CATEGORY_LABELS: Record<AuditCategory, string> = {
  AUTH: 'Xác thực',
  ADMIN: 'Quản trị',
  SECURITY: 'Bảo mật',
  SYSTEM: 'Hệ thống',
};

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

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
              Chi tiết Audit Log
            </h2>
            <IconButton
              icon="close-outline"
              size="sm"
              onClick={onClose}
              tooltip="Đóng"
            />
          </div>

          {/* Content */}
          <div className="flex-1 space-y-1 p-4">
            {/* Status and Action badges */}
            <div className="mb-4 flex items-center gap-2">
              <Badge variant={ACTION_VARIANT[log.action] ?? 'neutral'}>
                {ACTION_LABELS[log.action] ?? log.action}
              </Badge>
              <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'}>
                {log.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
              </Badge>
            </div>

            <DetailRow
              icon="person-outline"
              label="Tác nhân"
              value={log.actorName || 'Hệ thống'}
            />
            <DetailRow
              icon="shield-outline"
              label="Vai trò"
              value={log.actorRole}
            />
            <DetailRow
              icon="layers-outline"
              label="Phân loại"
              value={CATEGORY_LABELS[log.category] ?? log.category}
            />
            <DetailRow
              icon="locate-outline"
              label="Đối tượng"
              value={log.target}
              mono
            />
            {log.targetId && (
              <DetailRow
                icon="finger-print-outline"
                label="ID đối tượng"
                value={log.targetId}
                mono
              />
            )}
            <DetailRow
              icon="globe-outline"
              label="Địa chỉ IP"
              value={log.ip}
              mono
            />
            <DetailRow
              icon="phone-portrait-outline"
              label="User Agent"
              value={log.userAgent}
              mono
            />
            <DetailRow
              icon="link-outline"
              label="Correlation ID"
              value={log.correlationId}
              mono
            />
            <DetailRow
              icon="time-outline"
              label="Thời gian"
              value={formatTimestamp(log.createdAt)}
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
                    Thông báo lỗi
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
