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

import { useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { cn } from '@/lib/utils';
import type { ManualKnockoutDrawPreview } from '@/graphql/generated';
import type { DrawSlot } from '@/lib/tournament/draw/types';
import { ManualDrawBracketPreview } from './ManualDrawBracketPreview';

type PreviewTab = 'tree' | 'list';

interface ManualDrawPreviewPanelProps {
  preview: ManualKnockoutDrawPreview | null;
  previewError?: { message?: string } | null;
  loading?: boolean;
  slots: DrawSlot[];
  categoryId: string;
  categoryTitle: string;
  ageLabel: string;
}

export function ManualDrawPreviewPanel({
  preview,
  previewError,
  loading,
  slots,
  categoryId,
  categoryTitle,
  ageLabel,
}: ManualDrawPreviewPanelProps) {
  const [tab, setTab] = useState<PreviewTab>('tree');
  const r1Rows = preview?.matchupRows.filter((r) => r.meetingRound === 1) ?? [];
  const laterRows =
    preview?.matchupRows.filter((r) => r.meetingRound > 1) ?? [];
  const blocking =
    preview?.errors.filter(
      (e) => e.code !== 'SAME_CLUB_R1' && e.code !== 'LAYOUT_PLAYIN_MISMATCH'
    ) ?? [];
  const warnings =
    preview?.errors.filter(
      (e) => e.code === 'SAME_CLUB_R1' || e.code === 'LAYOUT_PLAYIN_MISMATCH'
    ) ?? [];

  return (
    <GlassPanel card className="p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-heading text-sm font-semibold">Preview bố cục</h3>
        <div className="bg-surface-elevated flex rounded-lg p-0.5">
          {(['tree', 'list'] as const).map((key) => (
            <button
              key={key}
              type="button"
              className={cn(
                'rounded-md px-3 py-1 text-xs font-medium transition-colors',
                tab === key
                  ? 'bg-primary text-white'
                  : 'text-muted hover:text-heading'
              )}
              onClick={() => setTab(key)}
            >
              {key === 'tree' ? 'Cây nhánh' : 'Danh sách trận'}
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-muted mb-3 text-xs">Đang mô phỏng...</p>}
      {previewError && (
        <p className="mb-3 text-xs text-red-400">
          Không tải được preview: {previewError.message}
        </p>
      )}

      {preview && (
        <div className="mb-3 flex flex-wrap gap-2 text-xs">
          <span
            className={cn(
              'rounded px-2 py-1',
              preview.valid
                ? 'bg-green-500/10 text-green-500'
                : 'bg-red-500/10 text-red-400'
            )}
          >
            {preview.valid ? 'Hợp lệ' : 'Chưa hợp lệ'}
          </span>
          <span className="bg-surface rounded px-2 py-1">
            Nhánh {preview.bracketSize}
          </span>
          <span className="bg-surface rounded px-2 py-1">
            V1 TvT: {preview.layoutHints.r1TvTCount}
          </span>
          <span className="bg-surface rounded px-2 py-1">
            V2: {preview.layoutHints.r2TvTCount} TvT ·{' '}
            {preview.layoutHints.r2WalkoverCount} WO
          </span>
        </div>
      )}

      {blocking.length > 0 && (
        <ul className="mb-3 space-y-1 text-xs text-red-400">
          {blocking.map((e, i) => (
            <li key={i}>{e.message}</li>
          ))}
        </ul>
      )}
      {warnings.length > 0 && (
        <ul className="mb-3 space-y-1 text-xs text-amber-500">
          {warnings.map((e, i) => (
            <li key={i}>{e.message}</li>
          ))}
        </ul>
      )}

      {preview && tab === 'tree' && (
        <ManualDrawBracketPreview
          preview={preview}
          slots={slots}
          categoryId={categoryId}
          categoryTitle={categoryTitle}
          ageLabel={ageLabel}
        />
      )}

      {preview && tab === 'list' && (
        <>
          {r1Rows.length > 0 && (
            <div className="mb-4">
              <h4 className="text-muted mb-2 text-xs font-semibold uppercase">
                Vòng 1
              </h4>
              <div className="max-h-48 space-y-1 overflow-y-auto text-xs">
                {r1Rows.map((row, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex justify-between gap-2',
                      row.isR1ByeWalkover && 'opacity-80'
                    )}
                  >
                    <span className="truncate">{row.player1Name}</span>
                    <span className="text-muted shrink-0">vs</span>
                    <span className="truncate text-right">
                      {row.player2Name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {laterRows.length > 0 && (
            <div>
              <h4 className="text-muted mb-2 text-xs font-semibold uppercase">
                Các vòng sau
              </h4>
              <div className="max-h-48 space-y-1 overflow-y-auto text-xs">
                {laterRows.map((row, i) => (
                  <div
                    key={i}
                    className={cn(row.isR1ByeWalkover && 'text-muted')}
                  >
                    <span className="text-muted">
                      {row.meetingRoundLabel}:{' '}
                    </span>
                    {row.player1Name} vs {row.player2Name}
                    {row.isR1ByeWalkover && (
                      <span className="text-faint ml-1">(walkover)</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </GlassPanel>
  );
}
