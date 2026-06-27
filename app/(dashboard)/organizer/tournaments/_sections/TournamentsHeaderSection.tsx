/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import Link from 'next/link';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { useTournamentRoutes } from '@/hooks/tournament/useTournamentRoutes';
import type { TournamentsPageData } from '../_hooks/useTournamentsPageData';

interface TournamentsHeaderSectionProps {
  data: TournamentsPageData;
}

export function TournamentsHeaderSection({
  data,
}: TournamentsHeaderSectionProps) {
  const routes = useTournamentRoutes();

  return (
    <PageHeader
      title={data.isPlatformOwner ? 'Tất cả giải đấu' : 'Giải đấu của tôi'}
      description={
        data.isPlatformOwner
          ? 'Quản lý và hỗ trợ giải trên toàn nền tảng.'
          : 'Quản lý và theo dõi các giải đấu bạn tổ chức.'
      }
    >
      {!data.isPlatformOwner ? (
        <Link href={routes.create}>
          <Button size="sm" iconLeft="add-outline">
            Tạo Giải Đấu Mới
          </Button>
        </Link>
      ) : null}
    </PageHeader>
  );
}
