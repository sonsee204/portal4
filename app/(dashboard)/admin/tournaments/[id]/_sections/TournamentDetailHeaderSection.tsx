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

import { useRouter } from 'next/navigation';
import { Button } from '@/components/atoms/Button';
import type { TournamentDetailPageData } from '../_hooks/useTournamentDetailPageData';

interface TournamentDetailHeaderSectionProps {
  data: TournamentDetailPageData;
}

export function TournamentDetailHeaderSection({
  data,
}: TournamentDetailHeaderSectionProps) {
  const router = useRouter();
  const { tournament, statusColor, statusLabel } = data;

  if (!tournament) return null;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-heading text-2xl font-bold">{tournament.title}</h1>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor}`}
          >
            {statusLabel}
          </span>
          <span className="text-muted text-sm">{tournament.sportType}</span>
          {tournament.location?.name && (
            <span className="text-muted text-sm">
              • {tournament.location.name}
            </span>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="sm"
        iconLeft="arrow-back-outline"
        onClick={() => router.push('/admin/tournaments')}
      >
        Quay lại
      </Button>
    </div>
  );
}
