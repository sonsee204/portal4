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
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { Select } from '@/components/atoms/Select';
import { Button } from '@/components/atoms/Button';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { VenueAction } from '@/graphql/generated';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';

interface ProductFormModalProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

export function ProductFormModal({ data, actions }: ProductFormModalProps) {
  const { allCategories } = data;
  const {
    productModalOpen,
    editingProduct,
    productForm,
    setProductForm,
    closeProductModal,
    handleProductSubmit,
    productCreating,
    productUpdating,
  } = actions;

  const categoryOptions = [
    { label: 'Chọn danh mục', value: '' },
    ...allCategories.map((c) => ({ label: c.name, value: c._id })),
  ];

  const submitting = productCreating || productUpdating;

  return (
    <Modal
      open={productModalOpen}
      onClose={closeProductModal}
      title={editingProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}
      size="md"
      footer={
        <VenueActionGate action={VenueAction.ManageProducts}>
          <Button
            variant="ghost"
            onClick={closeProductModal}
            disabled={submitting}
          >
            Hủy
          </Button>
          <Button
            onClick={() => void handleProductSubmit()}
            disabled={
              submitting ||
              !productForm.name.trim() ||
              !productForm.categoryId ||
              !productForm.price
            }
          >
            {submitting
              ? 'Đang lưu...'
              : editingProduct
                ? 'Cập nhật'
                : 'Tạo mới'}
          </Button>
        </VenueActionGate>
      }
    >
      <div className="space-y-4">
        <Input
          label="Tên sản phẩm"
          value={productForm.name}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
        <Input
          label="SKU"
          value={productForm.sku}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, sku: e.target.value }))
          }
        />
        <Input
          label="Đơn vị"
          value={productForm.unit}
          placeholder="cái, lon, chai..."
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, unit: e.target.value }))
          }
        />
        <Select
          label="Danh mục"
          options={categoryOptions}
          value={productForm.categoryId}
          onChange={(e) =>
            setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))
          }
        />
        <CurrencyInput
          label="Giá bán"
          value={productForm.price}
          onChange={(value) =>
            setProductForm((prev) => ({ ...prev, price: value }))
          }
        />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Tồn kho"
            type="number"
            min={0}
            value={productForm.stockQuantity}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                stockQuantity: e.target.value,
              }))
            }
          />
          <Input
            label="Ngưỡng cảnh báo"
            type="number"
            min={0}
            value={productForm.lowStockThreshold}
            onChange={(e) =>
              setProductForm((prev) => ({
                ...prev,
                lowStockThreshold: e.target.value,
              }))
            }
          />
        </div>
      </div>
    </Modal>
  );
}
