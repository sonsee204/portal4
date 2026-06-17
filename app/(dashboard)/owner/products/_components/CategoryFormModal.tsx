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
import { Input } from '@/components/atoms/Input';
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface CategoryFormModalProps {
  actions: OwnerProductsPageActions;
}

export function CategoryFormModal({ actions }: CategoryFormModalProps) {
  const {
    categoryModalOpen,
    editingCategory,
    categoryForm,
    setCategoryForm,
    closeCategoryModal,
    handleCategorySubmit,
    categoryCreating,
    categoryUpdating,
  } = actions;

  const submitting = categoryCreating || categoryUpdating;

  return (
    <Modal
      open={categoryModalOpen}
      onClose={closeCategoryModal}
      title={editingCategory ? 'Cập nhật danh mục' : 'Thêm danh mục'}
      size="sm"
      footer={
        <VenueActionGate action={VenueAction.ManageProducts}>
          <Button
            variant="ghost"
            onClick={closeCategoryModal}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={() => void handleCategorySubmit()}
            disabled={submitting || !categoryForm.name.trim()}
          >
            {submitting
              ? 'Đang lưu...'
              : editingCategory
                ? 'Cập nhật'
                : 'Tạo mới'}
          </Button>
        </VenueActionGate>
      }
    >
      <div className="space-y-4">
        <Input
          label="Tên danh mục"
          value={categoryForm.name}
          onChange={(e) =>
            setCategoryForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Input
          label="Thứ tự hiển thị"
          type="number"
          min={0}
          value={categoryForm.displayOrder}
          onChange={(e) =>
            setCategoryForm((prev) => ({
              ...prev,
              displayOrder: e.target.value,
            }))
          }
        />
      </div>
    </Modal>
  );
}
