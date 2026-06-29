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

import { useCallback, useMemo, useState } from 'react';
import type { VenueProductNode } from '@/hooks/owner';
import {
  toggleSelectAllIds,
  toggleSelectionSet,
} from '@/hooks/shared/selection-set';
import {
  isProductTransferable,
  type TransferProductSnapshot,
} from '@/lib/inventory/product-transfer';

function toTransferSnapshot(product: VenueProductNode): TransferProductSnapshot {
  return {
    _id: product._id,
    name: product.name,
    stockQuantity: product.stockQuantity,
    sku: product.sku,
    price: product.price,
    category: product.category
      ? { _id: product.category._id, name: product.category.name }
      : null,
  };
}

type ProductSelectionState = {
  venueId: string | null;
  active: boolean;
  selectedProductIds: Set<string>;
  snapshots: Record<string, TransferProductSnapshot>;
};

const EMPTY_PRODUCT_SELECTION: ProductSelectionState = {
  venueId: null,
  active: false,
  selectedProductIds: new Set(),
  snapshots: {},
};

export function useOwnerProductsSelectionActions(
  venueId: string | null,
  products: VenueProductNode[],
) {
  const [selection, setSelection] = useState<ProductSelectionState>(
    EMPTY_PRODUCT_SELECTION,
  );
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferSessionId, setTransferSessionId] = useState(0);

  const selectionMode =
    selection.active && selection.venueId === venueId && Boolean(venueId);

  const selectedProductIds = useMemo(
    () =>
      selectionMode ? selection.selectedProductIds : new Set<string>(),
    [selectionMode, selection.selectedProductIds],
  );

  const selectedProductSnapshots = useMemo(
    () => (selectionMode ? selection.snapshots : {}),
    [selectionMode, selection.snapshots],
  );

  const transferableLoadedProducts = useMemo(
    () => products.filter(isProductTransferable),
    [products],
  );

  const selectedProducts = useMemo(
    () =>
      [...selectedProductIds]
        .map((id) => selectedProductSnapshots[id])
        .filter((product): product is TransferProductSnapshot => product != null),
    [selectedProductIds, selectedProductSnapshots],
  );

  const exitSelectionMode = useCallback(() => {
    setSelection(EMPTY_PRODUCT_SELECTION);
    setTransferModalOpen(false);
  }, []);

  const enterSelectionMode = useCallback(() => {
    if (!venueId) {
      return;
    }
    setSelection({
      venueId,
      active: true,
      selectedProductIds: new Set(),
      snapshots: {},
    });
  }, [venueId]);

  const toggleProductSelection = useCallback(
    (product: VenueProductNode) => {
      if (!venueId || !isProductTransferable(product)) {
        return;
      }

      setSelection((prev) => {
        if (!prev.active || prev.venueId !== venueId) {
          return prev;
        }

        const nextIds = toggleSelectionSet(prev.selectedProductIds, product._id);
        const nextSnapshots = { ...prev.snapshots };
        if (nextSnapshots[product._id]) {
          delete nextSnapshots[product._id];
        } else {
          nextSnapshots[product._id] = toTransferSnapshot(product);
        }

        return {
          ...prev,
          selectedProductIds: nextIds,
          snapshots: nextSnapshots,
        };
      });
    },
    [venueId],
  );

  const toggleSelectAllLoadedProducts = useCallback(() => {
    if (!venueId) {
      return;
    }

    const transferableIds = transferableLoadedProducts.map(
      (product) => product._id,
    );
    const allSelected =
      transferableIds.length > 0 &&
      transferableIds.every((id) => selectedProductIds.has(id));

    setSelection((prev) => {
      if (!prev.active || prev.venueId !== venueId) {
        return prev;
      }

      const nextIds = toggleSelectAllIds(prev.selectedProductIds, transferableIds);
      const nextSnapshots = { ...prev.snapshots };
      if (allSelected) {
        for (const id of transferableIds) {
          delete nextSnapshots[id];
        }
      } else {
        for (const product of transferableLoadedProducts) {
          nextSnapshots[product._id] = toTransferSnapshot(product);
        }
      }

      return {
        ...prev,
        selectedProductIds: nextIds,
        snapshots: nextSnapshots,
      };
    });
  }, [transferableLoadedProducts, selectedProductIds, venueId]);

  const clearProductSelection = useCallback(() => {
    setSelection((prev) => {
      if (!prev.active || prev.venueId !== venueId) {
        return prev;
      }
      return {
        ...prev,
        selectedProductIds: new Set(),
        snapshots: {},
      };
    });
  }, [venueId]);

  const openTransferModal = useCallback(() => {
    if (selectedProductIds.size === 0) {
      return;
    }
    setTransferSessionId((current) => current + 1);
    setTransferModalOpen(true);
  }, [selectedProductIds.size]);

  const closeTransferModal = useCallback(() => {
    setTransferModalOpen(false);
  }, []);

  return {
    selectionMode,
    selectedProductIds,
    selectedProducts,
    transferableLoadedProducts,
    transferModalOpen,
    transferSessionId,
    enterSelectionMode,
    exitSelectionMode,
    toggleProductSelection,
    toggleSelectAllLoadedProducts,
    clearProductSelection,
    openTransferModal,
    closeTransferModal,
  };
}

export type OwnerProductsSelectionActions = ReturnType<
  typeof useOwnerProductsSelectionActions
>;
