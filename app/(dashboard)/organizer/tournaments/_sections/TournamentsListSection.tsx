/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { TournamentsOrganizerCardsSection } from './TournamentsOrganizerCardsSection';
import { TournamentsPlatformTableSection } from './TournamentsPlatformTableSection';
import type { TournamentsPageData } from '../_hooks/useTournamentsPageData';

interface TournamentsListSectionProps {
  data: TournamentsPageData;
}

export function TournamentsListSection({ data }: TournamentsListSectionProps) {
  if (data.isPlatformOwner) {
    return <TournamentsPlatformTableSection data={data} />;
  }

  return <TournamentsOrganizerCardsSection data={data} />;
}
