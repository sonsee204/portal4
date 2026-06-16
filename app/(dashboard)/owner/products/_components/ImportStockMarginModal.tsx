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

import { useMemo, useState } from 'react';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { Modal } from '@/components/molecules/Modal';
import type { ImportStockMarginAnalysis } from '../_hooks/useOwnerProductsPageActions';
import {
  computeMargin,
  getMarginLevel,
  getMarginLevelLabel,
  suggestSellingPrice,
  type MarginThresholds,
} from '@/lib/inventory/margin-utils';
import { cn, formatCurrency } from '@/lib/utils';

interface ImportStockMarginModalProps {
  open: boolean;
  analysis: ImportStockMarginAnalysis | null;
  thresholds: MarginThresholds | null;
  loading?: boolean;
  onConfirm: (newSellingPrice?: number) => void;
  onCancel: () => void;
}

const levelBadgeVariant = {
  healthy: 'success',
  warning: 'warning',
  danger: 'danger',
  unknown: 'neutral',
} as const;

export function ImportStockMarginModal({
  open,
  analysis,
  thresholds,
  loading = false,
  onConfirm,
  onCancel,
}: ImportStockMarginModalProps) {
  const [showPriceInput, setShowPriceInput] = useState(false);
  const [priceText, setPriceText] = useState('');

  const margin = useMemo(
    () =>
      analysis
        ? computeMargin(analysis.currentPrice, analysis.estimatedAvgCost)
        : null,
    [analysis]
  );

  const level = useMemo(
    () => getMarginLevel(margin, thresholds),
    [margin, thresholds]
  );

  const suggestedPrice = useMemo(
    () =>
      analysis
        ? suggestSellingPrice(analysis.estimatedAvgCost, thresholds)
        : null,
    [analysis, thresholds]
  );

  const isWarningOrDanger = level === 'warning' || level === 'danger';

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      setShowPriceInput(false);
      setPriceText('');
      onCancel();
    }
  };

  const handleConfirmWithSuggestedPrice = () => {
    if (suggestedPrice && suggestedPrice > 0) {
      onConfirm(suggestedPrice);
      setShowPriceInput(false);
      setPriceText('');
      return;
    }
    onConfirm();
  };

  const handleConfirmWithCustomPrice = () => {
    const parsed = parseInt(priceText.replace(/\D/g, ''), 10);
    if (parsed > 0) {
      onConfirm(parsed);
      setShowPriceInput(false);
      setPriceText('');
      return;
    }
    onConfirm();
  };

  if (!analysis) return null;

  return (
    <Modal
      open={open}
      onClose={() => handleOpenChange(false)}
      title="Xác nhận nhập hàng"
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Quay lại
          </Button>
          {!showPriceInput ? (
            <>
              {isWarningOrDanger && suggestedPrice ? (
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowPriceInput(true);
                    setPriceText(String(suggestedPrice));
                  }}
                  disabled={loading}
                >
                  Nhập giá khác
                </Button>
              ) : null}
              <Button
                onClick={() =>
                  isWarningOrDanger && suggestedPrice
                    ? handleConfirmWithSuggestedPrice()
                    : onConfirm()
                }
                disabled={loading}
              >
                {loading
                  ? 'Đang xử lý...'
                  : isWarningOrDanger && suggestedPrice
                    ? `Nhập & đặt giá ${formatCurrency(suggestedPrice)}`
                    : 'Xác nhận nhập'}
              </Button>
            </>
          ) : (
            <Button
              onClick={handleConfirmWithCustomPrice}
              disabled={loading || !priceText}
            >
              {loading ? 'Đang xử lý...' : 'Cập nhật giá & nhập'}
            </Button>
          )}
        </>
      }
    >
      <div className="space-y-4">
        <p className="text-muted text-sm">
          Phân tích biên lợi nhuận sau khi nhập {analysis.quantity} đơn vị với
          giá {formatCurrency(analysis.importPrice)}.
        </p>

        <div
          className={cn(
            'rounded-xl border px-4 py-3',
            level === 'healthy' && 'border-emerald-500/20 bg-emerald-500/10',
            level === 'warning' && 'border-amber-500/20 bg-amber-500/10',
            level === 'danger' && 'border-red-500/20 bg-red-500/10',
            level === 'unknown' && 'border-surface-border bg-surface-hover/40'
          )}
        >
          <div className="flex items-center justify-between gap-3">
            <span className="text-body text-sm font-medium">
              Biên lợi nhuận ước tính
            </span>
            <Badge variant={levelBadgeVariant[level]}>
              {margin != null ? `${margin.toFixed(1)}%` : 'N/A'} ·{' '}
              {getMarginLevelLabel(level)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <MetricCard
            label="Giá bán hiện tại"
            value={formatCurrency(analysis.currentPrice)}
          />
          <MetricCard
            label="Giá vốn TB sau nhập"
            value={formatCurrency(analysis.estimatedAvgCost)}
          />
        </div>

        {isWarningOrDanger && suggestedPrice && !showPriceInput && (
          <div className="border-surface-border bg-surface-hover/40 rounded-xl border px-4 py-3 text-sm">
            <p className="text-muted">
              Giá bán đề xuất để duy trì biên lợi nhuận an toàn:
            </p>
            <p className="text-body mt-1 font-semibold">
              {formatCurrency(suggestedPrice)}
            </p>
          </div>
        )}

        {showPriceInput && (
          <CurrencyInput
            label="Giá bán mới"
            value={priceText}
            onChange={setPriceText}
          />
        )}

        {!isWarningOrDanger && (
          <p className="text-muted text-sm">
            Biên lợi nhuận vẫn ở mức tốt. Bạn có thể nhập kho mà không cần điều
            chỉnh giá bán.
          </p>
        )}
      </div>
    </Modal>
  );
}

function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-surface-border bg-surface-hover/30 rounded-xl border px-4 py-3">
      <p className="text-muted text-xs">{label}</p>
      <p className="text-body mt-1 text-sm font-semibold">{value}</p>
    </div>
  );
}
