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

import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface DeleteConfirmModalsProps {
  actions: OwnerProductsPageActions;
}

export function DeleteConfirmModals({ actions }: DeleteConfirmModalsProps) {
  const {
    deleteProductId,
    setDeleteProductId,
    handleDeleteProduct,
    deleteCategoryId,
    setDeleteCategoryId,
    handleDeleteCategory,
    productDeleting,
    categoryDeleting,
  } = actions;

  return (
    <>
      <Modal
        open={!!deleteProductId}
        onClose={() => setDeleteProductId(null)}
        title="Xóa sản phẩm"
        size="sm"
        footer={
          <VenueActionGate action={VenueAction.ManageProducts}>
            <Button
              variant="ghost"
              onClick={() => setDeleteProductId(null)}
              disabled={productDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDeleteProduct()}
              disabled={productDeleting}
            >
              {productDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </VenueActionGate>
        }
      >
        <p className="text-muted text-sm">
          Bạn có chắc muốn xóa sản phẩm này? Hành động không thể hoàn tác.
        </p>
      </Modal>

      <Modal
        open={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        title="Xóa danh mục"
        size="sm"
        footer={
          <VenueActionGate action={VenueAction.ManageProducts}>
            <Button
              variant="ghost"
              onClick={() => setDeleteCategoryId(null)}
              disabled={categoryDeleting}
            >
              Hủy
            </Button>
            <Button
              variant="danger"
              onClick={() => void handleDeleteCategory()}
              disabled={categoryDeleting}
            >
              {categoryDeleting ? 'Đang xóa...' : 'Xóa'}
            </Button>
          </VenueActionGate>
        }
      >
        <p className="text-muted text-sm">
          Bạn có chắc muốn xóa danh mục này? Sản phẩm trong danh mục có thể bị
          ảnh hưởng.
        </p>
      </Modal>
    </>
  );
}
