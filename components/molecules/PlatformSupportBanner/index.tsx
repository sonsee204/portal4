/**
 * Ao Trình (NALee Sports)
 * @copyright 2025-2026 Lê Trung Hiếu
 */

'use client';

import Link from 'next/link';
import { IonIcon } from '@/components/atoms/IonIcon';
import { webTournamentManageUrl } from '@/lib/tournaments/web-urls';

interface PlatformSupportBannerProps {
  tournamentId?: string;
  organizerId: string;
  organizerName?: string | null;
}

export function PlatformSupportBanner({
  tournamentId,
  organizerId,
  organizerName,
}: PlatformSupportBannerProps) {
  const displayName = organizerName?.trim() || 'Ban tổ chức';

  return (
    <div className="border-primary/20 bg-primary/5 mb-6 flex items-start gap-3 rounded-xl border p-4">
      <IonIcon
        name="shield-checkmark-outline"
        className="text-primary mt-0.5 shrink-0"
        size="md"
      />
      <div className="min-w-0">
        <p className="text-heading m-0 text-sm font-semibold">
          Chế độ hỗ trợ platform
        </p>
        <p className="text-muted m-0 mt-1 text-sm leading-snug">
          Bạn đang quản lý giải của{' '}
          <span className="text-heading font-medium">{displayName}</span>.{' '}
          <Link
            href={`/admin/users/${organizerId}`}
            className="text-primary font-medium hover:underline"
          >
            Xem hồ sơ BTC
          </Link>
          {tournamentId ? (
            <>
              {' · '}
              <a
                href={webTournamentManageUrl(tournamentId, 'schedule')}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary inline-flex items-center gap-1 font-medium hover:underline"
              >
                Vận hành trên Web
                <IonIcon name="open-outline" size="xs" />
              </a>
            </>
          ) : null}
        </p>
      </div>
    </div>
  );
}
