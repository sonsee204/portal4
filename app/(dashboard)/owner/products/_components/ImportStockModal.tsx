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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { Modal } from '@/components/molecules/Modal';
import { VenueAction } from '@/graphql/generated';
import {
  useImportStock,
  useOwnerProductMutations,
  type VenueProductNode,
} from '@/hooks/owner';
import { estimateNewAverageCost } from '@/lib/inventory/margin-utils';
import { isProductOutOfStock } from '@/lib/inventory/product-stock';
import { formatCurrency } from '@/lib/utils';
import { showSuccess, showError } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared/mutation-helpers';
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';
import type { OwnerProductsPageData } from '../_hooks/useOwnerProductsPageData';
import { ImportStockMarginModal } from './ImportStockMarginModal';

interface ImportStockModalProps {
  data: OwnerProductsPageData;
  actions: OwnerProductsPageActions;
}

export function ImportStockModal({ data, actions }: ImportStockModalProps) {
  const { venueId, products, marginThresholds, refetchAll } = data;
  const {
    importStockModalOpen,
    importStockTarget,
    importStockForm,
    setImportStockForm,
    closeImportStockModal,
    importMarginModalOpen,
    setImportMarginModalOpen,
    importMarginAnalysis,
    setImportMarginAnalysis,
    closeImportMarginModal,
  } = actions;

  const { importStock, importing } = useImportStock(venueId);
  const { updateProduct, updating } = useOwnerProductMutations();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const selectedProduct = useMemo(() => {
    const productId = importStockTarget?._id ?? importStockForm.productId;
    if (!productId) return null;
    return (
      products.find((product) => product._id === productId) ?? importStockTarget
    );
  }, [products, importStockForm.productId, importStockTarget]);

  useEffect(() => {
    if (
      !importStockModalOpen ||
      importStockTarget ||
      !importStockForm.productId
    ) {
      return;
    }

    const product = products.find(
      (item) => item._id === importStockForm.productId
    );
    if (product?.lastImportPrice && !importStockForm.importPrice) {
      setImportStockForm((prev) => ({
        ...prev,
        importPrice: String(product.lastImportPrice),
      }));
    }
  }, [
    importStockModalOpen,
    importStockTarget,
    importStockForm.productId,
    importStockForm.importPrice,
    products,
    setImportStockForm,
  ]);

  const productOptions = useMemo(
    () => [
      { label: 'Chọn sản phẩm', value: '' },
      ...products.map((product) => ({
        label: `${product.name} (${product.stockQuantity ?? 0})`,
        value: product._id,
      })),
    ],
    [products]
  );

  const quantity = parseInt(importStockForm.quantity, 10);
  const importPrice = parseFloat(importStockForm.importPrice);
  const isValid =
    Boolean(selectedProduct?._id) &&
    Number.isFinite(quantity) &&
    quantity > 0 &&
    Number.isFinite(importPrice) &&
    importPrice > 0;

  const totalCost =
    Number.isFinite(quantity) && Number.isFinite(importPrice)
      ? quantity * importPrice
      : 0;

  const handleProductChange = useCallback(
    (productId: string) => {
      const product = products.find((item) => item._id === productId);
      setImportStockForm((prev) => ({
        ...prev,
        productId,
        importPrice: product?.lastImportPrice
          ? String(product.lastImportPrice)
          : prev.importPrice,
      }));
    },
    [products, setImportStockForm]
  );

  const executeImport = useCallback(
    async (newSellingPrice?: number) => {
      if (!selectedProduct || !isValid) return;

      setSubmitError(null);

      try {
        await importStock({
          productId: selectedProduct._id,
          quantity,
          importPrice,
          supplierName: importStockForm.supplierName.trim() || undefined,
          supplierContact: importStockForm.supplierContact.trim() || undefined,
          invoiceNumber: importStockForm.invoiceNumber.trim() || undefined,
          note: importStockForm.note.trim() || undefined,
        });

        if (newSellingPrice && newSellingPrice > 0) {
          try {
            await updateProduct({
              productId: selectedProduct._id,
              price: newSellingPrice,
            });
            showSuccess(
              `Đã nhập hàng và cập nhật giá bán thành ${formatCurrency(newSellingPrice)}`
            );
          } catch (priceError) {
            showSuccess('Đã nhập kho thành công');
            showError(
              formatMutationError(priceError) ||
                'Không thể cập nhật giá bán. Vui lòng cập nhật thủ công.'
            );
          }
        } else {
          showSuccess('Đã nhập kho thành công');
        }

        closeImportStockModal();
        refetchAll();
      } catch (error) {
        setSubmitError(formatMutationError(error));
      }
    },
    [
      selectedProduct,
      isValid,
      importStock,
      quantity,
      importPrice,
      importStockForm,
      updateProduct,
      closeImportStockModal,
      refetchAll,
    ]
  );

  const handleSubmit = useCallback(() => {
    if (!selectedProduct || !isValid) {
      setSubmitError('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setSubmitError(null);
    const currentSellingPrice = selectedProduct.price || 0;

    if (currentSellingPrice <= 0) {
      void executeImport();
      return;
    }

    const estimatedAvgCost = estimateNewAverageCost(
      selectedProduct.totalImportValue ?? 0,
      selectedProduct.totalImportQuantity ?? 0,
      quantity,
      importPrice
    );

    setImportMarginAnalysis({
      currentPrice: currentSellingPrice,
      estimatedAvgCost,
      importPrice,
      quantity,
    });
    setImportMarginModalOpen(true);
  }, [
    selectedProduct,
    isValid,
    quantity,
    importPrice,
    executeImport,
    setImportMarginAnalysis,
    setImportMarginModalOpen,
  ]);

  const handleConfirmMargin = useCallback(
    async (newSellingPrice?: number) => {
      closeImportMarginModal();
      await executeImport(newSellingPrice);
    },
    [closeImportMarginModal, executeImport]
  );

  const submitting = importing || updating;

  return (
    <>
      <Modal
        open={importStockModalOpen}
        onClose={closeImportStockModal}
        title="Nhập kho"
        size="md"
        footer={
          <VenueActionGate action={VenueAction.ManageProducts}>
            <Button
              variant="ghost"
              onClick={closeImportStockModal}
              disabled={submitting}
            >
              Hủy
            </Button>
            <Button
              onClick={() => void handleSubmit()}
              disabled={submitting || !isValid}
            >
              {submitting ? 'Đang xử lý...' : 'Nhập kho'}
            </Button>
          </VenueActionGate>
        }
      >
        <div className="space-y-5">
          {importStockTarget ? (
            <ProductSummary product={importStockTarget} />
          ) : (
            <Select
              label="Sản phẩm"
              options={productOptions}
              value={importStockForm.productId}
              onChange={(event) => handleProductChange(event.target.value)}
            />
          )}

          {selectedProduct && !importStockTarget && (
            <ProductSummary product={selectedProduct} compact />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="Số lượng nhập"
              type="number"
              min={1}
              value={importStockForm.quantity}
              onChange={(event) =>
                setImportStockForm((prev) => ({
                  ...prev,
                  quantity: event.target.value,
                }))
              }
              required
            />
            <CurrencyInput
              label="Giá nhập / đơn vị"
              value={importStockForm.importPrice}
              onChange={(value) =>
                setImportStockForm((prev) => ({ ...prev, importPrice: value }))
              }
            />
          </div>

          {isValid && (
            <div className="border-surface-border bg-surface-hover/40 rounded-xl border px-4 py-3 text-sm">
              <div className="text-muted flex items-center justify-between">
                <span>Tổng giá trị nhập</span>
                <span className="text-body font-semibold">
                  {formatCurrency(totalCost)}
                </span>
              </div>
              {selectedProduct && (
                <div className="text-muted mt-2 flex items-center justify-between">
                  <span>Tồn sau nhập</span>
                  <span className="text-body font-medium">
                    {(selectedProduct.stockQuantity ?? 0) + quantity}
                  </span>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4 border-t border-white/5 pt-4">
            <p className="text-muted text-xs font-medium tracking-wide uppercase">
              Thông tin nhà cung cấp (tuỳ chọn)
            </p>
            <Input
              label="Tên nhà cung cấp"
              value={importStockForm.supplierName}
              onChange={(event) =>
                setImportStockForm((prev) => ({
                  ...prev,
                  supplierName: event.target.value,
                }))
              }
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Liên hệ"
                value={importStockForm.supplierContact}
                onChange={(event) =>
                  setImportStockForm((prev) => ({
                    ...prev,
                    supplierContact: event.target.value,
                  }))
                }
              />
              <Input
                label="Số hoá đơn"
                value={importStockForm.invoiceNumber}
                onChange={(event) =>
                  setImportStockForm((prev) => ({
                    ...prev,
                    invoiceNumber: event.target.value,
                  }))
                }
              />
            </div>
            <Input
              label="Ghi chú"
              value={importStockForm.note}
              onChange={(event) =>
                setImportStockForm((prev) => ({
                  ...prev,
                  note: event.target.value,
                }))
              }
            />
          </div>

          {submitError && <p className="text-sm text-red-400">{submitError}</p>}
        </div>
      </Modal>

      <ImportStockMarginModal
        open={importMarginModalOpen}
        analysis={importMarginAnalysis}
        thresholds={marginThresholds}
        loading={submitting}
        onConfirm={(newSellingPrice?: number) =>
          void handleConfirmMargin(newSellingPrice)
        }
        onCancel={closeImportMarginModal}
      />
    </>
  );
}

function ProductSummary({
  product,
  compact = false,
}: {
  product: VenueProductNode;
  compact?: boolean;
}) {
  const outOfStock = isProductOutOfStock(product);

  return (
    <div
      className={
        compact
          ? 'border-surface-border bg-surface-hover/30 rounded-xl border px-4 py-3'
          : 'border-surface-border bg-surface-hover/40 rounded-xl border px-4 py-4'
      }
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-body text-sm font-semibold">{product.name}</p>
          <p className="text-muted mt-1 text-xs">
            Tồn hiện tại: {product.stockQuantity ?? 0}
            {product.category?.name ? ` · ${product.category.name}` : ''}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {outOfStock && <Badge variant="danger">Hết hàng</Badge>}
          <span className="text-sm font-medium text-emerald-400">
            {formatCurrency(product.price)}
          </span>
        </div>
      </div>
    </div>
  );
}
