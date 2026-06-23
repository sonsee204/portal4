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

import { useMemo } from 'react';
import { Button } from '@/components/atoms/Button';
import { DatePicker } from '@/components/molecules/DatePicker';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { EXPENSE_COVERAGE_PRESETS } from '../_hooks/owner-finance-page.constants';
import {
  applyCoveragePreset,
  diffDaysInclusive,
  estimateDailyRate,
  estimateMonthlyPreview,
  matchesCoveragePreset,
  type ExpenseCoverageMode,
} from '@/lib/finance/expense-coverage';
import { cn, formatCurrency } from '@/lib/utils';

interface ExpenseCoverageFieldsProps {
  coverageMode: ExpenseCoverageMode;
  paymentDate: Date;
  coverageFrom: Date;
  coverageTo: Date;
  parsedAmount: number;
  onModeChange: (mode: ExpenseCoverageMode) => void;
  onCoverageFromChange: (date: Date) => void;
  onCoverageToChange: (date: Date) => void;
  onApplyPreset: (months: number) => void;
}

export function ExpenseCoverageFields({
  coverageMode,
  paymentDate,
  coverageFrom,
  coverageTo,
  parsedAmount,
  onModeChange,
  onCoverageFromChange,
  onCoverageToChange,
  onApplyPreset,
}: ExpenseCoverageFieldsProps) {
  const preview = useMemo(() => {
    if (coverageMode === 'single' || parsedAmount <= 0) {
      return null;
    }

    const days = diffDaysInclusive(coverageFrom, coverageTo);
    return {
      days,
      dailyRate: estimateDailyRate(parsedAmount, coverageFrom, coverageTo),
      monthlyPreview: estimateMonthlyPreview(
        parsedAmount,
        coverageFrom,
        coverageTo
      ),
    };
  }, [coverageFrom, coverageMode, coverageTo, parsedAmount]);

  return (
    <>
      <div className="space-y-2">
        <p className="text-muted text-sm font-medium">Cách ghi nhận chi phí</p>
        <div className="bg-surface/40 flex gap-1 rounded-xl p-1">
          {(
            [
              { id: 'single', label: 'Chi phí một lần' },
              { id: 'period', label: 'Phân bổ theo kỳ' },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              className={cn(
                'flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                coverageMode === option.id
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted hover:text-body hover:bg-surface/60'
              )}
              onClick={() => onModeChange(option.id)}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {coverageMode === 'period' ? (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <DatePicker
              label="Kỳ từ ngày"
              value={coverageFrom}
              onChange={onCoverageFromChange}
            />
            <DatePicker
              label="Kỳ đến ngày"
              value={coverageTo}
              minDate={coverageFrom}
              onChange={onCoverageToChange}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {EXPENSE_COVERAGE_PRESETS.map((preset) => {
              const isActive = matchesCoveragePreset(
                coverageFrom,
                coverageTo,
                paymentDate,
                preset.months
              );

              return (
                <Button
                  key={preset.months}
                  size="sm"
                  variant={isActive ? 'primary' : 'ghost'}
                  onClick={() => onApplyPreset(preset.months)}
                >
                  {preset.label}
                </Button>
              );
            })}
          </div>
          {preview ? (
            <GlassPanel className="space-y-1 p-3">
              <p className="text-body text-sm">
                {formatCurrency(parsedAmount)} / {preview.days} ngày ≈{' '}
                {formatCurrency(preview.dailyRate)}/ngày
              </p>
              {preview.monthlyPreview ? (
                <p className="text-muted text-xs">{preview.monthlyPreview}</p>
              ) : null}
              <p className="text-faint text-xs">
                Báo cáo P&L ghi nhận theo ngày trong kỳ (phân bổ dồn tích).
              </p>
            </GlassPanel>
          ) : null}
        </div>
      ) : null}
    </>
  );
}

export { applyCoveragePreset };
