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
import { GlassPanel } from '@/components/molecules/GlassPanel';

export function TournamentDetailErrorSection() {
  const router = useRouter();

  return (
    <GlassPanel card>
      <div className="py-20 text-center">
        <p className="text-secondary">Không tìm thấy giải đấu.</p>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/admin/tournaments')}
          className="mt-4"
        >
          Quay lại danh sách
        </Button>
      </div>
    </GlassPanel>
  );
}
