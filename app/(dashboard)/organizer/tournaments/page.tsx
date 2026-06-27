/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useTournamentsPageData } from './_hooks/useTournamentsPageData';
import { TournamentsFiltersSection } from './_sections/TournamentsFiltersSection';
import { TournamentsHeaderSection } from './_sections/TournamentsHeaderSection';
import { TournamentsListSection } from './_sections/TournamentsListSection';

export default function TournamentsPage() {
  const data = useTournamentsPageData();

  return (
    <>
      <TournamentsHeaderSection data={data} />
      <TournamentsFiltersSection data={data} />
      <TournamentsListSection data={data} />
    </>
  );
}
