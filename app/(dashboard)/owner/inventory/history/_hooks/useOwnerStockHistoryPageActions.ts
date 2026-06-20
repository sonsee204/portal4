/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { ProductDetailTab } from '@/app/(dashboard)/owner/stats/products/_hooks/owner-product-stats.constants';
import type { OwnerStockHistoryPageData } from './useOwnerStockHistoryPageData';

export function useOwnerStockHistoryPageActions(
  data: OwnerStockHistoryPageData,
) {
  const router = useRouter();
  const [detailInitialTab, setDetailInitialTab] =
    useState<ProductDetailTab>('movements');

  const handleRetryAll = useCallback(() => {
    void data.refetchAll();
  }, [data]);

  const openOrder = useCallback(
    (orderId: string) => {
      router.push(`/owner/orders?orderId=${orderId}`);
    },
    [router],
  );

  const openProductDetail = useCallback(
    (productId: string) => {
      setDetailInitialTab('movements');
      data.setDetailProductId(productId);
    },
    [data],
  );

  const closeProductDetail = useCallback(() => {
    data.setDetailProductId(null);
  }, [data]);

  return {
    handleRetryAll,
    openOrder,
    openProductDetail,
    closeProductDetail,
    detailProductId: data.detailProductId,
    detailInitialTab,
  };
}

export type OwnerStockHistoryPageActions = ReturnType<
  typeof useOwnerStockHistoryPageActions
>;
