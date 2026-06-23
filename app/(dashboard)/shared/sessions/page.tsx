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

import { PageHeader } from '@/components/organisms/PageHeader';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { QueryState } from '@/components/molecules/QueryState';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { useState } from 'react';
import { formatDateTime } from '@/lib/utils';
import { useSessions } from './_hooks/useSessions';

function formatDeviceLabel(session: {
  deviceName?: string | null;
  platform?: string | null;
  clientSource?: string | null;
  deviceInfo?: {
    deviceName?: string | null;
    platform?: string | null;
  } | null;
}): string {
  const name = session.deviceName || session.deviceInfo?.deviceName;
  if (name) return name;

  const platform = session.platform || session.deviceInfo?.platform;
  if (platform) return platform;

  if (session.clientSource === 'PORTAL') return 'Trình duyệt web';

  return 'Thiết bị không rõ';
}

function formatPlatformLine(session: {
  platform?: string | null;
  clientSource?: string | null;
  deviceInfo?: {
    platform?: string | null;
    osVersion?: string | null;
    appVersion?: string | null;
  } | null;
}): string {
  const platform = session.platform || session.deviceInfo?.platform;
  const parts = [platform, session.deviceInfo?.appVersion].filter(Boolean);
  const line = parts.length > 0 ? parts.join(' · ') : '—';
  return session.clientSource ? `${line} · ${session.clientSource}` : line;
}

export default function SessionsPage() {
  const {
    sessions,
    loading,
    error,
    refetch,
    revokeSessionById,
    revokeOtherSessions,
    revoking,
  } = useSessions();

  const [revokeTarget, setRevokeTarget] = useState<string | null>(null);
  const [confirmRevokeOthers, setConfirmRevokeOthers] = useState(false);

  const otherSessions = sessions.filter((s) => !s.isCurrent);

  return (
    <>
      <PageHeader
        title="Thiết bị & Phiên đăng nhập"
        description="Quản lý các phiên đăng nhập trên thiết bị khác nhau."
      />

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          iconLeft="log-out-outline"
          disabled={revoking || loading || otherSessions.length === 0}
          onClick={() => setConfirmRevokeOthers(true)}
        >
          Đăng xuất tất cả thiết bị khác
        </Button>
        {!loading && otherSessions.length === 0 && (
          <span className="text-faint text-sm">
            Hiện không có thiết bị khác đang đăng nhập
          </span>
        )}
      </div>

      <p className="text-muted mt-3 text-sm">
        Thiết bị bị đăng xuất từ xa sẽ bị chặn ngay khi có yêu cầu mạng tiếp
        theo (thường trong vài giây). Push notification trên app mobile sẽ ngừng
        sau khi đăng xuất phiên từ xa.
      </p>

      <div className="mt-6 space-y-4">
        <QueryState
          loading={loading && sessions.length === 0}
          error={error}
          empty={!loading && sessions.length === 0}
          emptyMessage="Không có phiên đăng nhập hoạt động"
          onRetry={() => void refetch()}
        >
          {sessions.map((session) => (
            <GlassPanel key={session.id} card className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl">
                    <IonIcon
                      name="phone-portrait-outline"
                      className="text-primary text-xl"
                    />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-heading font-medium">
                        {formatDeviceLabel(session)}
                      </h3>
                      {session.isCurrent && (
                        <Badge variant="success">Thiết bị này</Badge>
                      )}
                    </div>
                    <p className="text-muted text-sm">
                      {formatPlatformLine(session)}
                    </p>
                    <p className="text-faint text-xs">
                      {session.loginLocation
                        ? `Vị trí: ${session.loginLocation} · `
                        : ''}
                      IP: {session.ipAddress ?? '—'} · Hoạt động:{' '}
                      {(() => {
                        const activityAt =
                          session.lastUsedAt ?? session.createdAt;
                        return activityAt ? formatDateTime(activityAt) : '—';
                      })()}
                    </p>
                  </div>
                </div>
                {!session.isCurrent && (
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={revoking}
                    onClick={() => setRevokeTarget(session.id)}
                  >
                    Đăng xuất thiết bị này
                  </Button>
                )}
              </div>
            </GlassPanel>
          ))}
        </QueryState>
      </div>

      <ConfirmDialog
        open={revokeTarget !== null}
        onClose={() => setRevokeTarget(null)}
        onConfirm={() => {
          if (revokeTarget) {
            void revokeSessionById(revokeTarget);
          }
          setRevokeTarget(null);
        }}
        title="Đăng xuất thiết bị?"
        description="Phiên trên thiết bị này sẽ bị vô hiệu khi refresh token hết hạn hoặc bị revoke."
        variant="danger"
        loading={revoking}
      />

      <ConfirmDialog
        open={confirmRevokeOthers}
        onClose={() => setConfirmRevokeOthers(false)}
        onConfirm={() => {
          void revokeOtherSessions();
          setConfirmRevokeOthers(false);
        }}
        title="Đăng xuất tất cả thiết bị khác?"
        description="Mọi phiên khác sẽ bị vô hiệu và mọi token push (FCM) của tài khoản sẽ bị xóa — thiết bị đó không nhận notification cho đến khi đăng nhập lại. Thiết bị hiện tại vẫn giữ phiên; portal có thể đăng ký lại push sau thao tác này."
        variant="danger"
        loading={revoking}
      />
    </>
  );
}
