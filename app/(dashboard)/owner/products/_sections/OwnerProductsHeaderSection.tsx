/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';

export function OwnerProductsHeaderSection() {
  const router = useRouter();

  return (
    <PageHeader
      title="Sản phẩm & F&B"
      description="Quản lý menu, tồn kho và danh mục sản phẩm theo từng cơ sở."
      actions={
        <Button
          variant="secondary"
          size="sm"
          iconLeft="swap-vertical-outline"
          onClick={() => router.push('/owner/inventory/history')}
        >
          Lịch sử kho
        </Button>
      }
    />
  );
}
