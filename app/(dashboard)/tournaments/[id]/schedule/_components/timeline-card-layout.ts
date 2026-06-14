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

import type { ScheduleMatch } from '@/types/tournament-schedule';
import { timeToMinutes } from '@/lib/tournament/schedule-time';
import {
  getEffectiveDurationMinutes,
  getTimelineStartTime,
} from '@/lib/tournament/schedule-timeline-slot';

export const TIMELINE_PX_PER_MINUTE = 2;
export const TIMELINE_CARD_GAP_PX = 3;
export const TIMELINE_COLUMN_INSET_PX = 4;

export const TIMELINE_STACK_GAP_PX = 6;
/** Chiều cao ước lượng để xếp chồng — card thật có thể cao hơn (height: auto). */
export const DEFAULT_TIMELINE_CARD_ESTIMATE_PX = 188;
/** Trang phân công trọng tài — header + 2 VĐV/CLB + footer trọng tài */
export const REFEREE_TIMELINE_CARD_ESTIMATE_PX = 228;

export type TimelineCardSizing = 'content' | 'slot';

export interface TimelinePlacedMatch {
  match: ScheduleMatch;
  /** Vị trí theo giờ bắt đầu trên trục thời gian */
  topPx: number;
  /** Vị trí hiển thị (content: trùng topPx; slot: có thể xếp chồng) */
  visualTopPx: number;
  /** Chiều cao tối thiểu theo thời lượng trận (gợi ý slot) */
  slotMinHeightPx: number;
  /** @deprecated Chỉ dùng cho sizing `slot` */
  heightPx: number;
  isConflict: boolean;
}

export function slotHeightFromDuration(
  durationMinutes: number,
  pxPerMinute: number,
): number {
  return Math.max(durationMinutes * pxPerMinute, 8);
}

/**
 * Tính px/phút đủ lớn để card đầy đủ không chồng khi các trận cách nhau ít phút.
 */
export function computeEffectivePxPerMinute(
  matches: ScheduleMatch[],
  estimatedCardHeightPx: number,
  sizing: TimelineCardSizing,
): number {
  if (sizing === 'slot') return TIMELINE_PX_PER_MINUTE;

  const startsByCourt = new Map<string, number[]>();
  for (const m of matches) {
    const start = getTimelineStartTime(m);
    if (!start || !m.courtId) continue;
    const list = startsByCourt.get(m.courtId) ?? [];
    list.push(timeToMinutes(start));
    startsByCourt.set(m.courtId, list);
  }

  let minGapMinutes = Infinity;
  for (const starts of startsByCourt.values()) {
    starts.sort((a, b) => a - b);
    for (let i = 1; i < starts.length; i++) {
      const gap = starts[i]! - starts[i - 1]!;
      if (gap > 0) minGapMinutes = Math.min(minGapMinutes, gap);
    }
  }

  if (!Number.isFinite(minGapMinutes)) {
    const durations = matches
      .filter((m) => getTimelineStartTime(m))
      .map((m) => getEffectiveDurationMinutes(m));
    minGapMinutes = durations.length > 0 ? Math.min(...durations) : 30;
  }

  const minGap = Math.max(minGapMinutes, 1);
  // Mỗi slot 15′ = đúng 1 card + khe nhỏ; không thêm buffer để tránh khoảng trắng giữa trận
  const cardFootprintPx = estimatedCardHeightPx + TIMELINE_STACK_GAP_PX;
  const requiredForCardStack = cardFootprintPx / minGap;

  return Math.max(TIMELINE_PX_PER_MINUTE, requiredForCardStack);
}

export function applyVisualStacking(
  placed: TimelinePlacedMatch[],
  estimatedCardHeightPx: number,
): number {
  let lastBottom = 0;

  for (const pm of placed) {
    const scheduledTop = pm.topPx + TIMELINE_CARD_GAP_PX;
    const minTop =
      lastBottom > 0 ? lastBottom + TIMELINE_STACK_GAP_PX : scheduledTop;
    // Giữ vị trí theo giờ; chỉ đẩy xuống khi card trước chồng lên slot này
    const visualTop =
      lastBottom > 0 && minTop > scheduledTop ? minTop : scheduledTop;
    pm.visualTopPx = visualTop;
    lastBottom = visualTop + estimatedCardHeightPx;
  }

  return lastBottom;
}

export function buildTimelinePlacedMatches(
  courts: { id: string; status?: string }[],
  matches: ScheduleMatch[],
  dayStart: number,
  options: {
    sizing: TimelineCardSizing;
    estimatedCardHeightPx: number;
    pxPerMinute: number;
    isConflict: (m: ScheduleMatch, courtMatches: ScheduleMatch[]) => boolean;
  },
): Map<string, TimelinePlacedMatch[]> {
  const activeCourts = courts.filter((c) => c.status !== 'maintenance');
  const map = new Map<string, TimelinePlacedMatch[]>();
  activeCourts.forEach((c) => map.set(c.id, []));

  const { pxPerMinute, sizing, estimatedCardHeightPx } = options;

  matches.forEach((m) => {
    const timelineStart = getTimelineStartTime(m);
    if (!m.courtId || !timelineStart) return;
    if (!map.has(m.courtId)) return;

    const startMin = timeToMinutes(timelineStart);
    const duration = getEffectiveDurationMinutes(m);
    const topPx = (startMin - dayStart) * pxPerMinute;
    const slotMinHeightPx = slotHeightFromDuration(duration, pxPerMinute);
    const heightPx =
      sizing === 'slot'
        ? Math.max(slotMinHeightPx, 32)
        : slotMinHeightPx;

    const courtMatches = matches.filter(
      (o) =>
        o.id !== m.id && o.courtId === m.courtId && getTimelineStartTime(o),
    );

    map.get(m.courtId)!.push({
      match: m,
      topPx,
      visualTopPx: topPx + TIMELINE_CARD_GAP_PX,
      slotMinHeightPx,
      heightPx,
      isConflict: options.isConflict(m, courtMatches),
    });
  });

  map.forEach((list) => {
    list.sort((a, b) => a.topPx - b.topPx);
    if (sizing === 'slot') {
      list.forEach((pm) => {
        pm.visualTopPx = pm.topPx + TIMELINE_CARD_GAP_PX;
      });
    } else {
      // Luôn căn theo giờ bắt đầu — không đẩy card để tránh lệch khung giờ
      list.forEach((pm) => {
        pm.visualTopPx = pm.topPx + TIMELINE_CARD_GAP_PX;
      });
    }
  });

  return map;
}

export function courtColumnHeightPx(
  placed: TimelinePlacedMatch[],
  timelineHeightPx: number,
  estimatedCardHeightPx: number,
  sizing: TimelineCardSizing,
): number {
  if (placed.length === 0) return timelineHeightPx;

  if (sizing === 'slot') {
    return timelineHeightPx;
  }

  const last = placed[placed.length - 1]!;
  const footprintPx = Math.max(estimatedCardHeightPx, last.slotMinHeightPx);
  const contentBottom = last.visualTopPx + footprintPx + 16;
  return Math.max(timelineHeightPx, contentBottom);
}
