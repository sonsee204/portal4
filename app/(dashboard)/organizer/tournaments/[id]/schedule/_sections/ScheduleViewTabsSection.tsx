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

import { VIEW_MODE_TABS } from '../_hooks/schedule-page.constants';
import type { ScheduleViewMode } from '../_hooks/useScheduleData';

interface ScheduleViewTabsSectionProps {
  viewMode: ScheduleViewMode;
  onViewModeChange: (mode: ScheduleViewMode) => void;
}

export function ScheduleViewTabsSection({
  viewMode,
  onViewModeChange,
}: ScheduleViewTabsSectionProps) {
  return (
    <div className="mt-4 flex gap-2">
      {VIEW_MODE_TABS.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onViewModeChange(tab.id)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-colors ${
            viewMode === tab.id
              ? 'bg-primary text-white'
              : 'bg-surface-elevated text-secondary hover:text-primary'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
