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
import { IonIcon } from '@/components/atoms/IonIcon';

export interface BracketAdjustmentItem {
  categoryId: string;
  categoryTitle: string;
  currentBracketSize: number;
  newRegistrationCount: number;
  suggestedBracketSize: number;
}

interface BracketAdjustmentModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  adjustments: BracketAdjustmentItem[];
  loading?: boolean;
}

export function BracketAdjustmentModal({
  open,
  onClose,
  onConfirm,
  adjustments,
  loading = false,
}: BracketAdjustmentModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Điều chỉnh kích thước nhánh đấu"
      size="md"
      footer={
        <>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={loading}
          >
            Từ chối
          </Button>
          <Button
            size="sm"
            iconLeft="checkmark-circle-outline"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đồng ý điều chỉnh'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-secondary text-sm">
          Một số nội dung đăng ký vượt quá kích thước nhánh đấu hiện tại. Hệ
          thống sẽ tự động điều chỉnh lên kích thước phù hợp (lũy thừa 2) nếu
          bạn đồng ý.
        </p>
        <ul className="space-y-0.5">
          {adjustments.map((adj) => (
            <li
              key={adj.categoryId}
              className="border-surface-border bg-surface-elevated/50 flex items-center justify-between rounded-lg border px-4 py-3 text-sm"
            >
              <span className="text-heading font-medium">
                {adj.categoryTitle}
              </span>
              <span className="text-secondary">
                {adj.currentBracketSize} → {adj.suggestedBracketSize} vị trí
                <span className="text-faint">
                  {' '}
                  ({adj.newRegistrationCount} VĐV)
                </span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </Modal>
  );
}
