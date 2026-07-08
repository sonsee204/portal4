/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */
'use client';

import { use } from 'react';
import { useLeaderboardData } from '@/app/(dashboard)/admin/tournaments/[id]/leaderboard/_hooks/userLeaderboardData';
import { LeaderboardHeaderSection } from '@/app/(dashboard)/admin/tournaments/[id]/leaderboard/_sections/LeaderboardHeaderSection';
import { LeaderboardTableSection } from '@/app/(dashboard)/admin/tournaments/[id]/leaderboard/_sections/LeaderboardTableSection';

export default function LeaderboardPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const data = useLeaderboardData(tournamentId);

  return (
    <>
      <LeaderboardHeaderSection />
      <LeaderboardTableSection data={data} />
    </>
  );
}