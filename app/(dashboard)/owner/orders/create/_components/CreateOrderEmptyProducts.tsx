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
import { IonIcon } from '@/components/atoms/IonIcon';

export function CreateOrderEmptyProducts() {
  return (
    <div className="flex flex-col items-center gap-3 py-10 text-center">
      <IonIcon name="cube-outline" size="lg" className="text-faint" />
      <p className="text-muted text-sm">
        Chưa có sản phẩm đang bán. Thêm sản phẩm để bắt đầu tạo đơn.
      </p>
      <Link
        href="/owner/products"
        className="border-surface-border text-body hover:bg-surface-hover inline-flex items-center rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors"
      >
        Quản lý sản phẩm
      </Link>
    </div>
  );
}
