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

import { Button } from '@/components/atoms/Button';
import { Modal } from '@/components/molecules/Modal';
import { PageHeader } from '@/components/organisms/PageHeader';
import type { CreatePromotionPageActions } from '../_hooks/useCreatePromotionPageActions';
import type { CreatePromotionPageData } from '../_hooks/useCreatePromotionPageData';

interface CreatePromotionHeaderSectionProps {
  data: CreatePromotionPageData;
  actions: CreatePromotionPageActions;
}

export function CreatePromotionHeaderSection({
  data,
  actions,
}: CreatePromotionHeaderSectionProps) {
  const { isEditing, venueName } = data;
  const { handleBack, abandonDialogOpen, confirmAbandon, cancelAbandon } =
    actions;

  return (
    <>
      <PageHeader
        title={isEditing ? 'Chỉnh sửa khuyến mãi' : 'Tạo khuyến mãi'}
        description={
          venueName ? `Cơ sở: ${venueName}` : 'Thiết lập khuyến mãi cho cơ sở'
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
        title="Bỏ thay đổi?"
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
          Các thay đổi chưa lưu sẽ bị mất nếu bạn rời trang này.
        </p>
      </Modal>
    </>
  );
}
