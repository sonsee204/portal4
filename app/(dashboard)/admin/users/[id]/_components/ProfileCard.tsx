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

import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { PermissionGate } from '@/components/atoms/PermissionGate';
import { formatDate, formatDateTime } from '@/lib/utils';
import { ROLE_DISPLAY_NAMES, isSuperAdminRole } from '@/lib/permissions';
import {
  ADMIN_SUSPEND_USER,
  ADMIN_UNSUSPEND_USER,
} from '@/graphql/admin/mutations';
import { createMutationOptions } from '@/hooks/shared/mutation-helpers';
import { useAuthStore } from '@/stores/auth';
import { USERS } from '@/lib/strings';
import type { User } from '@/types';
import { ResetPlayerPasswordDialog } from '../../_components/ResetPlayerPasswordDialog';

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
  const viewerRole = useAuthStore((s) => s.user?.role);
  const [resetOpen, setResetOpen] = useState(false);
  const displayName = getDisplayName(user);
  const initials = getInitials(user);
  const status = user.isSuspended
    ? 'offline'
    : user.isActive
      ? 'online'
      : 'offline';

  const [suspendUser, { loading: suspending }] = useMutation(
    ADMIN_SUSPEND_USER,
    createMutationOptions('AdminSuspendUser', 'Khóa tài khoản thành công')
  );

  const [unsuspendUser, { loading: unsuspending }] = useMutation(
    ADMIN_UNSUSPEND_USER,
    createMutationOptions('AdminUnsuspendUser', 'Mở khóa tài khoản thành công')
  );

  const actionLoading = suspending || unsuspending;
  const canResetPassword =
    user.role === 'PLAYER' && isSuperAdminRole(viewerRole);

  const handleToggleSuspend = () => {
    if (user.isSuspended) {
      const confirmed = window.confirm(`Mở khóa tài khoản ${displayName}?`);
      if (!confirmed) return;
      void unsuspendUser({ variables: { userId: user._id } });
    } else {
      const reason = window.prompt(`Lý do khóa tài khoản ${displayName}:`);
      if (reason === null) return;
      void suspendUser({
        variables: { userId: user._id, reason: reason || undefined },
      });
    }
  };

  return (
    <>
      <GlassPanel card className="space-y-6">
        <div className="flex flex-col items-center text-center">
          <Avatar
            fallback={initials}
            src={user.photoURL}
            status={status}
            size="lg"
          />
          <h2 className="text-heading mt-3 text-lg font-bold">{displayName}</h2>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2">
            <Badge variant="info">
              {ROLE_DISPLAY_NAMES[user.role] ?? user.role}
            </Badge>
            {user.accountOrigin === 'ADMIN_CREATED' && (
              <Badge variant="warning">
                {USERS.PROVISION.ADMIN_CREATED_BADGE}
              </Badge>
            )}
            {user.isActive && !user.isSuspended && (
              <Badge variant="success">Hoạt động</Badge>
            )}
            {user.isSuspended && <Badge variant="danger">Bị khóa</Badge>}
          </div>
        </div>

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
              Tham gia: {user.createdAt ? formatDate(user.createdAt) : '—'}
            </span>
          </div>
          {user.lastLoginAt && (
            <div className="flex items-center gap-3 text-sm">
              <IonIcon name="log-in-outline" className="text-faint" />
              <span className="text-body">
                Đăng nhập cuối: {formatDateTime(user.lastLoginAt)}
              </span>
            </div>
          )}
        </div>

        <div className="border-surface-border space-y-2 border-t pt-4">
          <p className="text-faint text-xs font-bold tracking-wider uppercase">
            Admin Actions
          </p>

          <PermissionGate feature="player_password_reset">
            {canResetPassword && (
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start text-sky-400 hover:bg-sky-500/10"
                iconLeft="key-outline"
                onClick={() => setResetOpen(true)}
              >
                {USERS.RESET_PASSWORD.TITLE}
              </Button>
            )}
          </PermissionGate>

          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-amber-400 hover:bg-amber-500/10"
            iconLeft={
              user.isSuspended ? 'lock-open-outline' : 'lock-closed-outline'
            }
            onClick={handleToggleSuspend}
            disabled={actionLoading}
          >
            {user.isSuspended ? 'Mở khóa tài khoản' : 'Khóa tài khoản'}
          </Button>
        </div>
      </GlassPanel>

      {canResetPassword && (
        <ResetPlayerPasswordDialog
          open={resetOpen}
          userId={user._id}
          userName={displayName}
          onClose={() => setResetOpen(false)}
        />
      )}
    </>
  );
}
