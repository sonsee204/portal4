/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { PageHeader } from '@/components/organisms/PageHeader';
import type { CreateOrderPageActions } from '../_hooks/useCreateOrderPageActions';
import type { CreateOrderPageData } from '../_hooks/useCreateOrderPageData';

interface CreateOrderHeaderSectionProps {
  data: CreateOrderPageData;
  actions: CreateOrderPageActions;
}

export function CreateOrderHeaderSection({
  data,
  actions,
}: CreateOrderHeaderSectionProps) {
  const { venueName } = data;
  const { handleBack, abandonDialogOpen, confirmAbandon, cancelAbandon } =
    actions;

  return (
    <>
      <PageHeader
        title="Tạo đơn bán hàng"
        description={
          venueName
            ? `POS walk-in / F&B — ${venueName}`
            : 'POS walk-in / F&B'
        }
        actions={
          <Button type="button" variant="ghost" onClick={handleBack}>
            Quay lại danh sách
          </Button>
        }
      />
      <Modal
        open={abandonDialogOpen}
        onClose={cancelAbandon}
        title="Bỏ đơn nháp?"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={cancelAbandon}>
              Tiếp tục chỉnh sửa
            </Button>
            <Button variant="danger" onClick={confirmAbandon}>
              Rời trang
            </Button>
          </>
        }
      >
        <p className="text-muted text-sm">
          Giỏ hàng sẽ không được lưu nếu bạn rời trang này.
        </p>
      </Modal>
    </>
  );
}
