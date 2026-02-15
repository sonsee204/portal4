'use client';

import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ROLE_DISPLAY_NAMES } from '@/lib/permissions';
import type { User } from '@/types';

interface ProfileCardProps {
  user: User;
}

function getDisplayName(user: User): string {
  return user.displayName || user.fullName || user.userName || 'User';
}

function getInitials(user: User): string {
  const name = user.fullName || user.displayName || user.userName || '';
  return (
    name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || 'U'
  );
}

export function ProfileCard({ user }: ProfileCardProps) {
  const displayName = getDisplayName(user);
  const initials = getInitials(user);
  const status = user.isSuspended
    ? 'offline'
    : user.isActive
      ? 'online'
      : 'offline';

  return (
    <GlassPanel card className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <Avatar
          fallback={initials}
          src={user.photoURL}
          status={status}
          size="lg"
        />
        <h2 className="mt-3 text-lg font-bold text-heading">{displayName}</h2>
        <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
          <Badge variant="info">
            {ROLE_DISPLAY_NAMES[user.role] ?? user.role}
          </Badge>
          {user.isActive && !user.isSuspended && (
            <Badge variant="success">Hoạt động</Badge>
          )}
          {user.isSuspended && <Badge variant="danger">Bị khóa</Badge>}
        </div>
      </div>

      {/* Contact info */}
      <div className="border-surface-border space-y-3 border-t pt-4">
        <div className="flex items-center gap-3 text-sm">
          <IonIcon name="mail-outline" className="text-faint" />
          <span className="text-body">{user.email}</span>
        </div>
        {user.phone && (
          <div className="flex items-center gap-3 text-sm">
            <IonIcon name="call-outline" className="text-faint" />
            <span className="text-body">{user.phone}</span>
          </div>
        )}
        <div className="flex items-center gap-3 text-sm">
          <IonIcon name="calendar-outline" className="text-faint" />
          <span className="text-body">
            Tham gia:{' '}
            {user.createdAt
              ? new Date(user.createdAt).toLocaleDateString('vi-VN')
              : '—'}
          </span>
        </div>
        {user.lastLoginAt && (
          <div className="flex items-center gap-3 text-sm">
            <IonIcon name="log-in-outline" className="text-faint" />
            <span className="text-body">
              Đăng nhập cuối:{' '}
              {new Date(user.lastLoginAt).toLocaleString('vi-VN')}
            </span>
          </div>
        )}
      </div>

      {/* Danger zone */}
      <div className="border-surface-border space-y-2 border-t pt-4">
        <p className="text-xs font-bold tracking-wider text-faint uppercase">
          Admin Actions
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-amber-400 hover:bg-amber-500/10"
          iconLeft="lock-closed-outline"
        >
          {user.isSuspended ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:bg-red-500/10"
          iconLeft="trash-outline"
        >
          Xóa tài khoản
        </Button>
      </div>
    </GlassPanel>
  );
}
