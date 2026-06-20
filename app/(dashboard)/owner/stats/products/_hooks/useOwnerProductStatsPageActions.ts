/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback } from 'react';
import type { OwnerProductStatsPageData } from './useOwnerProductStatsPageData';

export function useOwnerProductStatsPageActions(
  data: OwnerProductStatsPageData,
) {
  const handleRetryAll = useCallback(() => {
    void data.refetchReport();
  }, [data]);

  const openProductDetail = useCallback(
    (productId: string) => {
      data.setDetailProductId(productId);
    },
    [data],
  );

  const closeProductDetail = useCallback(() => {
    data.setDetailProductId(null);
  }, [data]);

  return {
    handleRetryAll,
    openProductDetail,
    closeProductDetail,
    detailProductId: data.detailProductId,
  };
}

export type OwnerProductStatsPageActions = ReturnType<
  typeof useOwnerProductStatsPageActions
>;
