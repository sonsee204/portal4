'use client';

import { DataTable } from '@/components/organisms/DataTable';
import { Badge } from '@/components/atoms/Badge';
import { IconButton } from '@/components/atoms/IconButton';
import type { AuditLog, AuditAction, AuditCategory } from '@/types';
import type { BadgeVariant } from '@/config/theme';

interface AuditTableProps {
  logs: AuditLog[];
  loading: boolean;
  onViewDetail: (log: AuditLog) => void;
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
  const date = new Date(iso);
  return date.toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

function getInitials(name?: string): string {
  if (!name) return '?';
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const columns = [
  { key: 'admin', label: 'Tác nhân' },
  { key: 'category', label: 'Phân loại' },
  { key: 'action', label: 'Hành động' },
  { key: 'target', label: 'Đối tượng' },
  { key: 'ip', label: 'IP' },
  { key: 'timestamp', label: 'Thời gian', sortable: true },
  { key: 'status', label: 'Trạng thái' },
  { key: 'actions', label: '' },
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
      emptyTitle="Chưa có audit log"
      emptyDescription="Các hoạt động hệ thống sẽ được ghi lại tại đây."
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
                  {log.actorName || 'Hệ thống'}
                </span>
                {log.actorRole && (
                  <p className="text-faint text-xs">{log.actorRole}</p>
                )}
              </div>
            </div>
          </td>
          <td className="px-4 py-3">
            <span className="text-muted text-xs font-medium">
              {CATEGORY_LABELS[log.category] ?? log.category}
            </span>
          </td>
          <td className="px-4 py-3">
            <Badge variant={ACTION_VARIANT[log.action] ?? 'neutral'}>
              {ACTION_LABELS[log.action] ?? log.action}
            </Badge>
          </td>
          <td className="text-muted max-w-[200px] truncate px-4 py-3 font-mono text-xs">
            {log.target || '—'}
          </td>
          <td className="text-faint px-4 py-3 font-mono text-xs">
            {log.ip || '—'}
          </td>
          <td className="text-muted px-4 py-3 font-mono text-xs">
            {formatTimestamp(log.createdAt)}
          </td>
          <td className="px-4 py-3">
            <Badge variant={log.status === 'SUCCESS' ? 'success' : 'danger'}>
              {log.status === 'SUCCESS' ? 'Thành công' : 'Thất bại'}
            </Badge>
          </td>
          <td className="px-4 py-3">
            <IconButton
              icon="eye-outline"
              size="sm"
              tooltip="Chi tiết"
              onClick={() => onViewDetail(log)}
            />
          </td>
        </tr>
      )}
    />
  );
}
