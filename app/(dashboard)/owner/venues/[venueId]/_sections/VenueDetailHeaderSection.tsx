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
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import type { VenueDetailPageData } from '../_hooks/useVenueDetailPageData';

interface VenueDetailHeaderSectionProps {
  data: VenueDetailPageData;
}

export function VenueDetailHeaderSection({
  data,
}: VenueDetailHeaderSectionProps) {
  const { venue } = data;

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <PageHeader
        title={venue?.name ?? 'Chi tiết sân'}
        description={
          venue?.location?.address
            ? `${venue.location.address}${venue.location.city ? `, ${venue.location.city}` : ''}`
            : 'Thông tin và cấu hình sân.'
        }
      />
      <div className="flex shrink-0 items-center gap-3">
        {venue && <Badge variant="neutral">{venue.status}</Badge>}
        <Link href="/owner/venues">
          <Button variant="secondary" size="sm" iconLeft="arrow-back-outline">
            Danh sách
          </Button>
        </Link>
      </div>
    </div>
  );
}
