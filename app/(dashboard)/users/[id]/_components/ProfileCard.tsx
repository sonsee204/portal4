'use client';

import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { PortalUser } from '@/types/portal';

interface ProfileCardProps {
  user: PortalUser;
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <GlassPanel card className="space-y-6">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        <Avatar
          fallback={user.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .slice(0, 2)}
          status={user.online ? 'online' : 'offline'}
          size="lg"
        />
        <h2 className="mt-3 text-lg font-bold text-white">{user.name}</h2>
        <div className="mt-1 flex items-center gap-2">
          <Badge variant="info">{user.role}</Badge>
          {user.status === 'active' && <Badge variant="success">VIP</Badge>}
        </div>
      </div>

      {/* Contact info */}
      <div className="border-surface-border space-y-3 border-t pt-4">
        <div className="flex items-center gap-3 text-sm">
          <IonIcon name="mail-outline" className="text-slate-500" />
          <span className="text-slate-300">{user.email}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <IonIcon name="call-outline" className="text-slate-500" />
          <span className="text-slate-300">{user.phone ?? '0912-xxx-xxx'}</span>
        </div>
        <div className="flex items-center gap-3 text-sm">
          <IonIcon name="calendar-outline" className="text-slate-500" />
          <span className="text-slate-300">
            Tham gia: {user.joinedAt ?? '15/03/2023'}
          </span>
        </div>
      </div>

      {/* Danger zone */}
      <div className="border-surface-border space-y-2 border-t pt-4">
        <p className="text-xs font-bold tracking-wider text-slate-500 uppercase">
          Admin Actions
        </p>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-amber-400 hover:bg-amber-500/10"
          iconLeft="lock-closed-outline"
        >
          Suspend Account
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-red-400 hover:bg-red-500/10"
          iconLeft="trash-outline"
        >
          Delete Account
        </Button>
      </div>
    </GlassPanel>
  );
}
