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

import Link from 'next/link';
import { Button } from '@/components/atoms/Button';

export default function NotFound() {
  return (
    <div className="bg-bg relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      {/* Gradient blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="bg-primary/20 absolute -top-32 -left-32 h-80 w-80 rounded-full blur-[100px]" />
        <div className="absolute -right-32 -bottom-32 h-80 w-80 rounded-full bg-red-500/10 blur-[100px]" />
      </div>

      <div className="relative z-10 text-center">
        {/* Large 404 */}
        <h1 className="neon-text text-[120px] leading-none font-extrabold text-heading md:text-[180px]">
          404
        </h1>

        <h2 className="mt-4 text-xl font-bold text-heading md:text-2xl">
          Trang không tồn tại
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-muted">
          Trang bạn đang tìm kiếm không tồn tại hoặc đã được di chuyển. Hãy kiểm
          tra lại URL hoặc quay về trang chủ.
        </p>

        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/">
            <Button iconLeft="home-outline">Về Dashboard</Button>
          </Link>
          <Link href="/support">
            <Button variant="ghost" iconLeft="chatbubble-outline">
              Liên hệ hỗ trợ
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
