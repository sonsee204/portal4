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

import { GlassPanel } from '@/components/molecules/GlassPanel';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { TournamentFormat } from '@/graphql/generated';
import { TOURNAMENT } from '@/lib/strings';
import { DrawGroupKnockoutSection } from './DrawGroupKnockoutSection';
import { DrawStandardFormatSection } from './DrawStandardFormatSection';
import { DrawBracketTreeSection } from './DrawBracketTreeSection';
import { DrawManualSection } from './DrawManualSection';
import type { ManualDrawState } from '../_hooks/useManualDrawState';
import type { DrawPageActions } from '../_hooks/useDrawActions';
import type { DrawPageData } from '../_hooks/useDrawData';

interface DrawMainSectionProps {
  data: DrawPageData;
  manual: ManualDrawState;
}

export function DrawMainSection({ data, manual }: DrawMainSectionProps) {
  const { bLoading, matches, isGroupKnockout, isRoundRobin, activeCategory } = data;
  const isSingleElimination =
    activeCategory?.format === TournamentFormat.SingleElimination;
  const showManualEditor =
    manual.canManualDraw &&
    manual.drawMode === 'manual' &&
    matches.length === 0;

  if (bLoading) {
    return (
      <GlassPanel card>
        <div className="flex items-center justify-center py-12">
          <div className="border-primary h-6 w-6 animate-spin rounded-full border-2 border-t-transparent" />
        </div>
      </GlassPanel>
    );
  }

  if (showManualEditor) {
    return (
      <GlassPanel card>
        <DrawManualSection data={data} manual={manual} />
      </GlassPanel>
    );
  }

  if (matches.length === 0) {
    return (
      <GlassPanel card>
        <div className="py-12 text-center">
          <p className="text-secondary">
            {isGroupKnockout
              ? 'Chưa có bảng đấu. Hãy tạo bảng đấu để bắt đầu.'
              : isRoundRobin
                ? 'Chưa có lịch đấu. Hãy tạo lịch đấu vòng tròn để bắt đầu.'
                : manual.drawMode === 'manual'
                  ? 'Chuyển sang chế độ xếp thủ công ở trên để bắt đầu.'
                  : 'Chưa có nhánh đấu. Hãy tạo nhánh đấu để bắt đầu.'}
          </p>
        </div>
      </GlassPanel>
    );
  }

  if (isGroupKnockout) {
    return <DrawGroupKnockoutSection data={data} />;
  }

  if (isSingleElimination) {
    return <DrawBracketTreeSection data={data} />;
  }

  return <DrawStandardFormatSection data={data} />;
}

interface DrawResetDialogSectionProps {
  data: DrawPageData;
  actions: DrawPageActions;
}

export function DrawResetDialogSection({
  data,
  actions,
}: DrawResetDialogSectionProps) {
  const { resetDialogOpen, setResetDialogOpen, isGroupKnockout, isRoundRobin } =
    data;
  const { handleConfirmReset, resetting } = actions;

  return (
    <ConfirmDialog
      open={resetDialogOpen}
      onClose={() => setResetDialogOpen(false)}
      onConfirm={handleConfirmReset}
      title={
        isGroupKnockout
          ? 'Xoá bảng đấu'
          : isRoundRobin
            ? 'Xoá lịch đấu'
            : 'Xoá nhánh đấu'
      }
      description={TOURNAMENT.CONFIRM_RESET_BRACKET}
      confirmLabel={
        isGroupKnockout
          ? 'Xoá bảng đấu'
          : isRoundRobin
            ? 'Xoá lịch đấu'
            : 'Xoá nhánh đấu'
      }
      variant="danger"
      loading={resetting}
    />
  );
}
