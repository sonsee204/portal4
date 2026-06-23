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

import { IonIcon } from '@/components/atoms/IonIcon';
import { Button } from '@/components/atoms/Button';
import type { DrawPageActions } from '../_hooks/useDrawActions';
import type { DrawPageData } from '../_hooks/useDrawData';
import type { ManualDrawState } from '../_hooks/useManualDrawState';
import { ManualDrawModeToggle } from '../_components/manual-draw/ManualDrawModeToggle';

interface DrawToolbarSectionProps {
  data: DrawPageData;
  actions: DrawPageActions;
  manual: ManualDrawState;
}

export function DrawStatsSection({ data }: { data: DrawPageData }) {
  const {
    activeCategoryId,
    approvedCount,
    matches,
    isGroupKnockout,
    isRoundRobin,
    groupCount,
    advancingPerGroup,
    totalGroupMatches,
    roundRobinMatchCount,
    effectiveBracketSize,
    expectedByes,
  } = data;

  if (!activeCategoryId || (approvedCount ?? 0) <= 0 || matches.length > 0) {
    return null;
  }

  return (
    <div className="mt-4 flex flex-wrap gap-4 text-xs">
      <div className="bg-surface-elevated rounded-lg px-3 py-2">
        <span className="text-secondary">VĐV đã duyệt:</span>{' '}
        <span className="text-heading font-semibold">{approvedCount}</span>
      </div>
      {isGroupKnockout ? (
        <>
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">Số bảng:</span>{' '}
            <span className="text-heading font-semibold">{groupCount}</span>
          </div>
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">VĐV đi tiếp / bảng:</span>{' '}
            <span className="text-heading font-semibold">
              {advancingPerGroup}
            </span>
          </div>
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">Tổng trận vòng bảng:</span>{' '}
            <span className="text-heading font-semibold">
              ~{totalGroupMatches}
            </span>
          </div>
        </>
      ) : isRoundRobin ? (
        <div className="bg-surface-elevated rounded-lg px-3 py-2">
          <span className="text-secondary">Tổng số trận:</span>{' '}
          <span className="text-heading font-semibold">
            {roundRobinMatchCount}
          </span>
        </div>
      ) : (
        <>
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">Nhánh đấu:</span>{' '}
            <span className="text-heading font-semibold">
              {effectiveBracketSize} slot
            </span>
          </div>
          <div className="bg-surface-elevated rounded-lg px-3 py-2">
            <span className="text-secondary">Số BYE dự kiến:</span>{' '}
            <span className="text-heading font-semibold">{expectedByes}</span>
          </div>
        </>
      )}
    </div>
  );
}

export function DrawPendingWarningSection({ data }: { data: DrawPageData }) {
  const { pendingCount, matches } = data;
  if (pendingCount <= 0 || matches.length > 0) return null;

  return (
    <div className="mt-3 flex items-start gap-2 rounded-lg bg-amber-500/10 px-4 py-2">
      <IonIcon
        name="warning-outline"
        size="sm"
        className="mt-0.5 shrink-0 text-amber-500"
      />
      <span className="text-xs text-amber-600 dark:text-amber-400">
        Có {pendingCount} đăng ký chưa duyệt. Chỉ những VĐV đã duyệt mới được xếp
        vào bảng đấu.
      </span>
    </div>
  );
}

export function DrawToolbarSection({ data, actions, manual }: DrawToolbarSectionProps) {
  const {
    activeCategoryId,
    matches,
    isGroupKnockout,
    isRoundRobin,
    allGroupMatchesDone,
    knockoutSeeded,
  } = data;
  const {
    isLoading,
    generating,
    seeding,
    handleGenerateBracket,
    handleSeedKnockout,
    handleReset,
  } = actions;

  const showModeToggle = manual.canManualDraw && matches.length === 0;
  const hideAutoGenerate = showModeToggle && manual.drawMode === 'manual';

  return (
    <div className="mt-4 space-y-3">
      {showModeToggle && (
        <ManualDrawModeToggle
          mode={manual.drawMode}
          onChange={manual.setDrawMode}
        />
      )}
      <div className="flex flex-wrap items-center gap-3">
      <Button
        size="sm"
        disabled={isLoading || !activeCategoryId || matches.length > 0 || hideAutoGenerate}
        onClick={handleGenerateBracket}
      >
        {generating
          ? 'Đang tạo...'
          : isGroupKnockout
            ? 'Tạo bảng đấu'
            : isRoundRobin
              ? 'Tạo lịch đấu vòng tròn'
              : 'Tạo nhánh đấu'}
      </Button>

      {isGroupKnockout &&
        allGroupMatchesDone &&
        !knockoutSeeded &&
        matches.length > 0 && (
          <Button
            size="sm"
            variant="primary"
            iconLeft="git-branch-outline"
            disabled={seeding}
            onClick={handleSeedKnockout}
          >
            {seeding ? 'Đang xếp...' : 'Xếp VĐV vào vòng loại trực tiếp'}
          </Button>
        )}

      {matches.length > 0 && (
        <Button
          size="sm"
          variant="ghost"
          disabled={isLoading}
          onClick={handleReset}
          className="text-red-400"
        >
          {isGroupKnockout
            ? 'Xoá bảng đấu'
            : isRoundRobin
              ? 'Xoá lịch đấu'
              : 'Xoá nhánh đấu'}
        </Button>
      )}
      </div>
    </div>
  );
}
