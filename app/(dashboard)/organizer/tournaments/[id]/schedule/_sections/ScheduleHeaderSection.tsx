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

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import { TOURNAMENT } from '@/lib/strings';

interface ScheduleHeaderSectionProps {
  tournamentId: string;
  matchCount: number;
}

export function ScheduleHeaderSection({
  tournamentId,
  matchCount,
}: ScheduleHeaderSectionProps) {
  const router = useRouter();
  const routes = useTournamentRoutes();

  return (
    <PageHeader
      title={TOURNAMENT.LABEL_SCHEDULE}
      description={`${matchCount} trận đấu`}
    >
      <div className="flex items-center gap-2">
        <Link href={routes.edit(tournamentId)}>
          <Button variant="outline" size="sm" iconLeft="grid-outline">
            {TOURNAMENT.LABEL_ADD_COURTS_LINK}
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push(routes.detail(tournamentId))}
        >
          Quay lại
        </Button>
      </div>
    </PageHeader>
  );
}
