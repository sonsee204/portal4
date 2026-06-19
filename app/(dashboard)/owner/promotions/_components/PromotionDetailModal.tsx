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

import { useEffect, useMemo, useRef } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { QueryState } from '@/components/molecules/QueryState';
import { usePromotion } from '@/hooks/owner';
import type { OwnerPromotionsPageActions } from '../_hooks/useOwnerPromotionsPageActions';
import { PromotionDetailContent } from './PromotionDetailContent';
import { PromotionDetailFooterActions } from './PromotionDetailFooterActions';

export interface PromotionDetailModalProps {
  promotionId: string | null;
  open: boolean;
  onClose: () => void;
  actions: OwnerPromotionsPageActions;
}

export function PromotionDetailModal({
  promotionId,
  open,
  onClose,
  actions,
}: PromotionDetailModalProps) {
  const { promotion, loading, error, refetch } = usePromotion(
    open ? promotionId : null
  );

  const { isMutating } = actions;
  const wasLoadingRef = useRef(isMutating);

  useEffect(() => {
    if (wasLoadingRef.current && !isMutating && open) {
      void refetch();
    }
    wasLoadingRef.current = isMutating;
  }, [isMutating, open, refetch]);

  const footerActions = useMemo(() => {
    if (!promotion) return null;
    return (
      <PromotionDetailFooterActions promotion={promotion} actions={actions} />
    );
  }, [actions, promotion]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={promotion ? promotion.name : 'Chi tiết khuyến mãi'}
      size="lg"
      footer={footerActions}
    >
      <QueryState
        loading={loading}
        error={error}
        empty={!loading && !promotion}
        emptyMessage="Không tìm thấy khuyến mãi."
        onRetry={() => void refetch()}
      >
        {promotion && <PromotionDetailContent promotion={promotion} />}
      </QueryState>
    </Modal>
  );
}
