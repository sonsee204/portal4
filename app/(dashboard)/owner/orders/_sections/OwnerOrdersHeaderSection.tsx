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
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { PageHeader } from '@/components/organisms/PageHeader';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import { VenueAction } from '@/graphql/generated';

export function OwnerOrdersHeaderSection() {
  const router = useRouter();
  const { selectedVenueId } = useVenueContext();

  return (
    <PageHeader
      title="Đơn hàng / POS"
      description="Quản lý đơn hàng, trạng thái chuẩn bị và hoàn tiền theo từng cơ sở."
      actions={
        <VenueActionGate action={VenueAction.CreateOrder}>
          <Button
            iconLeft="add-outline"
            disabled={!selectedVenueId}
            onClick={() => router.push('/owner/orders/create')}
          >
            Tạo đơn
          </Button>
        </VenueActionGate>
      }
    />
  );
}
