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
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { TOURNAMENT } from '@/lib/strings';

export function DrawHeaderSection() {
  const router = useRouter();

  return (
    <PageHeader
      title={TOURNAMENT.LABEL_DRAW}
      description="Quản lý bốc thăm và xếp hạt giống cho từng nội dung."
    >
      <Button
        variant="ghost"
        size="sm"
        iconLeft="arrow-back-outline"
        onClick={() => router.push('/tournaments')}
      >
        Quay lại
      </Button>
    </PageHeader>
  );
}
