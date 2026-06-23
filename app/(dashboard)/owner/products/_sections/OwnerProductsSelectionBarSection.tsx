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
import type { OwnerProductsPageActions } from '../_hooks/useOwnerProductsPageActions';

interface OwnerProductsSelectionBarSectionProps {
  actions: OwnerProductsPageActions;
}

export function OwnerProductsSelectionBarSection({
  actions,
}: OwnerProductsSelectionBarSectionProps) {
  const {
    selectedProductIds,
    transferableLoadedProducts,
    toggleSelectAllLoadedProducts,
    clearProductSelection,
    openTransferModal,
    exitSelectionMode,
  } = actions;

  const transferableIds = transferableLoadedProducts.map(
    (product) => product._id
  );
  const allLoadedSelected =
    transferableIds.length > 0 &&
    transferableIds.every((id) => selectedProductIds.has(id));

  return (
    <div className="border-primary/30 bg-primary/5 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-body text-sm">
          <span className="text-primary font-semibold">
            {selectedProductIds.size}
          </span>{' '}
          sản phẩm đã chọn
        </span>
        <button
          type="button"
          onClick={toggleSelectAllLoadedProducts}
          disabled={transferableIds.length === 0}
          className="text-primary hover:text-primary/80 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-50"
        >
          {allLoadedSelected
            ? 'Bỏ chọn trang hiện tại'
            : 'Chọn tất cả (trang hiện tại)'}
        </button>
        {selectedProductIds.size > 0 && (
          <button
            type="button"
            onClick={clearProductSelection}
            className="text-muted hover:text-body text-xs font-medium"
          >
            Bỏ chọn
          </button>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Button
          size="sm"
          variant="primary"
          iconLeft="swap-horizontal-outline"
          disabled={selectedProductIds.size === 0}
          onClick={openTransferModal}
        >
          Tiếp tục
        </Button>
        <Button size="sm" variant="ghost" onClick={exitSelectionMode}>
          Hủy
        </Button>
      </div>
    </div>
  );
}
