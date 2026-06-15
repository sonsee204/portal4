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
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';

export default function OrganizerDashboardPage() {
  return (
    <>
      <PageHeader
        title="Ban tổ chức giải"
        description="Quản lý giải đấu do bạn tổ chức."
      />

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <GlassPanel card className="p-6">
          <div className="flex items-start gap-4">
            <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
              <IonIcon name="trophy-outline" className="text-primary text-2xl" />
            </div>
            <div className="flex-1 space-y-2">
              <h2 className="text-heading font-semibold">Giải đấu của tôi</h2>
              <p className="text-secondary text-sm">
                Tạo, chỉnh sửa và theo dõi các giải đấu bạn đang tổ chức.
              </p>
              <Link href="/organizer/tournaments">
                <Button size="sm" variant="primary" iconLeft="arrow-forward-outline">
                  Mở danh sách giải
                </Button>
              </Link>
            </div>
          </div>
        </GlassPanel>
      </div>
    </>
  );
}
