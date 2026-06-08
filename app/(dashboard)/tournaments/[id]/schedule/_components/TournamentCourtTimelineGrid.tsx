'use client';

import { useMemo, useCallback, type ReactNode } from 'react';
import { useDroppable } from '@dnd-kit/react';
import { cn } from '@/lib/utils';
import { IonIcon } from '@/components/atoms/IonIcon';
import type { ScheduleMatch, ScheduleCourt } from '@/types/tournament-schedule';
import { minutesToTime } from '../_utils/schedule-helpers';
import {
  resolveTimelineDropFromClick,
  TIMELINE_TOP_INSET_PX,
} from '@/lib/tournament/resolve-timeline-drop';
import { courtDropId } from '@/lib/tournament/schedule-dnd-ids';
import { canDragScheduledMatch } from '@/lib/tournament/validate-schedule-drop';
import { useScheduleDnd, previewTopPx } from './ScheduleDndContext';
import type { ScheduleDropPreview } from './schedule-dnd-types';
import { ScheduleDropSnapLine } from './ScheduleDropSnapLine';
import { ScheduleCourtDropHighlight } from './ScheduleCourtDropHighlight';
import { ScheduleDraggableMatchWrapper } from './ScheduleDraggableMatchWrapper';
import { hasTimeOverlap } from '@/lib/tournament/schedule-court-conflicts';
import {
  ScheduleMatchSearchHighlightOverlay,
  resolveScheduleSearchHighlight,
  scheduleMatchSearchDimClass,
  scheduleMatchSearchElevatedClass,
} from '@/components/tournament/schedule-match-search-highlight';
import {
  type TimelineCardSizing,
  type TimelinePlacedMatch,
  TIMELINE_CARD_GAP_PX,
  TIMELINE_COLUMN_INSET_PX,
  DEFAULT_TIMELINE_CARD_ESTIMATE_PX,
  computeEffectivePxPerMinute,
  buildTimelinePlacedMatches,
  courtColumnHeightPx,
} from './timeline-card-layout';

export {
  TIMELINE_PX_PER_MINUTE,
  TIMELINE_CARD_GAP_PX,
} from './timeline-card-layout';
export type { TimelinePlacedMatch } from './timeline-card-layout';

const LABEL_INTERVAL = 60;
const GRIDLINE_INTERVAL = 30;
const TIMELINE_HEADER_ROW_PX = 44;

export { TIMELINE_TOP_INSET_PX };

export interface TournamentCourtTimelineGridProps {
  courts: ScheduleCourt[];
  matches: ScheduleMatch[];
  /** [startMinutesOfDay, endMinutesOfDay] */
  dayRange: [number, number];
  renderMatchCard: (
    match: ScheduleMatch,
    layout: {
      topPx: number;
      visualTopPx: number;
      slotMinHeightPx: number;
      heightPx: number;
      isConflict: boolean;
      cardSizing: TimelineCardSizing;
    }
  ) => ReactNode;
  onClickEmpty?: (courtId: string, time: string) => void;
  /** Fixed court column width; when omitted, columns flex to fill available width. */
  courtColWidthPx?: number;
  /** Min width per court column in fluid mode (also drives horizontal scroll threshold). */
  courtColMinWidthPx?: number;
  timeColPx?: number;
  showMaintenanceLegend?: boolean;
  emptyColumnHint?: string;
  highlightedMatchIds?: ReadonlySet<string>;
  dimUnhighlighted?: boolean;
  /**
   * `content` — card cao theo nội dung, trục thời gian giãn theo px/phút động.
   * `slot` — ép card vào chiều cao slot theo thời lượng (legacy).
   */
  cardSizing?: TimelineCardSizing;
  /** Ước lượng chiều cao card khi tính px/phút (`content`). */
  estimatedCardHeightPx?: number;
  /** Court buffer between matches — aligns conflict detection with backend repack. */
  courtBufferMinutes?: number;
  /** Enable drag-and-drop rescheduling (requires ScheduleDndProvider ancestor). */
  dragDropEnabled?: boolean;
  selectedDate?: string;
  isPastDate?: boolean;
}

export {
  computeTimelineDayRange,
  DEFAULT_TRAILING_PADDING_MINUTES,
} from '@/lib/tournament/compute-timeline-day-range';
export type { ComputeTimelineDayRangeOptions } from '@/lib/tournament/compute-timeline-day-range';

export function TournamentCourtTimelineGrid({
  courts,
  matches,
  dayRange,
  renderMatchCard,
  onClickEmpty,
  courtColWidthPx,
  courtColMinWidthPx,
  timeColPx = 64,
  showMaintenanceLegend = true,
  emptyColumnHint = 'Nhấn để xếp lịch',
  highlightedMatchIds,
  dimUnhighlighted = false,
  cardSizing = 'content',
  estimatedCardHeightPx = DEFAULT_TIMELINE_CARD_ESTIMATE_PX,
  courtBufferMinutes,
  dragDropEnabled = false,
  selectedDate = '',
  isPastDate = false,
}: TournamentCourtTimelineGridProps) {
  const { enabled: dndActive, registerCourtColumn, preview } = useScheduleDnd();
  const dndOn = dragDropEnabled && dndActive;

  const activeCourts = courts.filter((c) => c.status !== 'maintenance');

  const [dayStart, dayEnd] = dayRange;
  const totalMinutes = dayEnd - dayStart;

  const pxPerMinute = useMemo(
    () =>
      computeEffectivePxPerMinute(matches, estimatedCardHeightPx, cardSizing),
    [matches, estimatedCardHeightPx, cardSizing]
  );

  const timelineHeightPx = totalMinutes * pxPerMinute;

  const placedByCourt = useMemo(
    () =>
      buildTimelinePlacedMatches(courts, matches, dayStart, {
        sizing: cardSizing,
        estimatedCardHeightPx,
        pxPerMinute,
        isConflict: (m, courtMatches) =>
          courtMatches.some((o) => hasTimeOverlap(m, o, courtBufferMinutes)),
      }),
    [
      courts,
      matches,
      dayStart,
      cardSizing,
      estimatedCardHeightPx,
      pxPerMinute,
      courtBufferMinutes,
    ]
  );

  const columnHeights = useMemo(() => {
    const heights = new Map<string, number>();
    for (const court of activeCourts) {
      const placed = placedByCourt.get(court.id) ?? [];
      heights.set(
        court.id,
        courtColumnHeightPx(
          placed,
          timelineHeightPx,
          estimatedCardHeightPx,
          cardSizing
        )
      );
    }
    return heights;
  }, [
    activeCourts,
    placedByCourt,
    timelineHeightPx,
    estimatedCardHeightPx,
    cardSizing,
  ]);

  const gridContentHeightPx = useMemo(() => {
    let max = timelineHeightPx;
    columnHeights.forEach((h) => {
      if (h > max) max = h;
    });
    return max + TIMELINE_TOP_INSET_PX;
  }, [columnHeights, timelineHeightPx]);

  const timeLabels = useMemo(() => {
    const labels: { minutes: number; topPx: number; isHour: boolean }[] = [];
    const firstLine =
      Math.ceil(dayStart / GRIDLINE_INTERVAL) * GRIDLINE_INTERVAL;
    for (let min = firstLine; min < dayEnd; min += GRIDLINE_INTERVAL) {
      labels.push({
        minutes: min,
        topPx: (min - dayStart) * pxPerMinute,
        isHour: min % LABEL_INTERVAL === 0,
      });
    }
    return labels;
  }, [dayStart, dayEnd, pxPerMinute]);

  const handleColumnClick = useCallback(
    (courtId: string, e: React.MouseEvent<HTMLDivElement>) => {
      if (!onClickEmpty) return;
      const { time } = resolveTimelineDropFromClick(
        e,
        dayStart,
        dayEnd,
        pxPerMinute
      );
      onClickEmpty(courtId, time);
    },
    [dayStart, dayEnd, onClickEmpty, pxPerMinute]
  );

  if (activeCourts.length === 0) {
    return (
      <div className="bg-surface border-surface-border flex items-center justify-center rounded-xl border px-6 py-16">
        <p className="text-muted text-sm">Không có sân nào khả dụng.</p>
      </div>
    );
  }

  const isFluidCourts = courtColWidthPx == null;
  const colMinWidth =
    courtColMinWidthPx ?? Math.max(160, Math.floor(800 / activeCourts.length));
  const colWidth = courtColWidthPx ?? colMinWidth;
  const gridMinWidth = timeColPx + activeCourts.length * colMinWidth;

  return (
    <div className="bg-surface border-surface-border overflow-hidden rounded-xl border shadow-sm dark:shadow-none">
      <div
        className="overflow-x-auto overflow-y-auto"
        style={{ maxHeight: '72vh' }}
      >
        <div
          className={cn(!isFluidCourts && 'flex w-full')}
          style={
            isFluidCourts
              ? {
                  // Rộng tối thiểu đủ cho mỗi sân; tránh w-full + minmax(360px) gây cột cuối giãn lệch
                  width: `max(100%, ${gridMinWidth}px)`,
                  display: 'grid',
                  gridTemplateColumns: `${timeColPx}px repeat(${activeCourts.length}, minmax(0, 1fr))`,
                }
              : { minWidth: gridMinWidth }
          }
        >
          <div
            className="border-surface-border bg-surface sticky left-0 z-30 min-w-0 shrink-0 border-r"
            style={isFluidCourts ? undefined : { width: timeColPx }}
          >
            <div
              className="border-surface-border bg-bg-secondary sticky top-0 left-0 z-50 flex items-center justify-end border-b pr-2"
              style={{ height: TIMELINE_HEADER_ROW_PX }}
            >
              <span className="text-muted text-xs font-medium">Giờ</span>
            </div>
            <div
              className="bg-surface relative"
              style={{ height: gridContentHeightPx }}
            >
              {timeLabels
                .filter((l) => l.isHour)
                .map(({ minutes, topPx }) => (
                  <div
                    key={minutes}
                    className="absolute right-0 left-0 flex items-center pr-2"
                    style={{ top: TIMELINE_TOP_INSET_PX + topPx - 8 }}
                  >
                    <span className="text-muted w-full text-right text-[11px] leading-none font-semibold">
                      {minutesToTime(minutes)}
                    </span>
                  </div>
                ))}
            </div>
          </div>

          {activeCourts.map((court) => {
            const isMaintenance = court.status === 'maintenance';
            const placed = placedByCourt.get(court.id) ?? [];
            const columnHeight =
              columnHeights.get(court.id) ?? gridContentHeightPx;

            return (
              <div
                key={court.id}
                className={cn(
                  'border-surface-border relative min-w-0 border-l',
                  !isFluidCourts && 'flex-1'
                )}
                style={
                  isFluidCourts
                    ? undefined
                    : {
                        minWidth: colMinWidth,
                        width: colWidth,
                        flex: '0 0 auto',
                      }
                }
              >
                <div
                  className="border-surface-border bg-bg-secondary sticky top-0 z-40 flex items-center justify-center gap-1.5 border-b px-2"
                  style={{ height: TIMELINE_HEADER_ROW_PX }}
                >
                  <span className="text-heading truncate text-xs font-semibold">
                    {court.name}
                  </span>
                  {court.status === 'reserved' && (
                    <span className="text-muted shrink-0 text-[10px]">
                      ({court.notes})
                    </span>
                  )}
                </div>

                <CourtTimelineColumn
                  courtId={court.id}
                  isMaintenance={isMaintenance}
                  columnHeight={columnHeight}
                  onClickEmpty={onClickEmpty}
                  onColumnClick={
                    isMaintenance || !onClickEmpty
                      ? undefined
                      : (e) => handleColumnClick(court.id, e)
                  }
                  dndOn={dndOn}
                  registerCourtColumn={registerCourtColumn}
                  dropPreview={preview?.courtId === court.id ? preview : null}
                  dayStart={dayStart}
                  pxPerMinute={pxPerMinute}
                  emptyColumnHint={emptyColumnHint}
                  timeLabels={timeLabels}
                  placed={placed}
                  cardSizing={cardSizing}
                  highlightedMatchIds={highlightedMatchIds}
                  dimUnhighlighted={dimUnhighlighted}
                  renderMatchCard={renderMatchCard}
                  dragDropEnabled={dndOn}
                  selectedDate={selectedDate}
                  isPastDate={isPastDate}
                />
              </div>
            );
          })}
        </div>
      </div>

      {showMaintenanceLegend &&
        courts.some((c) => c.status === 'maintenance') && (
          <div className="border-surface-border border-t px-4 py-3">
            <div className="text-faint flex items-center gap-2 text-xs">
              <span className="h-2 w-2 rounded-full bg-slate-400" />
              <span>
                {courts
                  .filter((c) => c.status === 'maintenance')
                  .map((c) => `${c.name}: ${c.notes}`)
                  .join(' · ')}
              </span>
            </div>
          </div>
        )}
    </div>
  );
}

function CourtTimelineColumn({
  courtId,
  isMaintenance,
  columnHeight,
  onClickEmpty,
  onColumnClick,
  dndOn,
  registerCourtColumn,
  dropPreview,
  dayStart,
  pxPerMinute,
  emptyColumnHint,
  timeLabels,
  placed,
  cardSizing,
  highlightedMatchIds,
  dimUnhighlighted,
  renderMatchCard,
  dragDropEnabled,
  selectedDate,
  isPastDate,
}: {
  courtId: string;
  isMaintenance: boolean;
  columnHeight: number;
  onClickEmpty?: (courtId: string, time: string) => void;
  onColumnClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  dndOn: boolean;
  registerCourtColumn: (courtId: string, el: HTMLElement | null) => void;
  dropPreview: ScheduleDropPreview | null;
  dayStart: number;
  pxPerMinute: number;
  emptyColumnHint: string;
  timeLabels: { minutes: number; topPx: number; isHour: boolean }[];
  placed: TimelinePlacedMatch[];
  cardSizing: TimelineCardSizing;
  highlightedMatchIds?: ReadonlySet<string>;
  dimUnhighlighted?: boolean;
  renderMatchCard: TournamentCourtTimelineGridProps['renderMatchCard'];
  dragDropEnabled: boolean;
  selectedDate: string;
  isPastDate: boolean;
}) {
  const { ref: dropRef } = useDroppable({
    id: courtDropId(courtId),
    disabled: isMaintenance || !dndOn,
  });

  const setRef = useCallback(
    (el: HTMLElement | null) => {
      dropRef(el);
      if (dndOn) registerCourtColumn(courtId, el);
    },
    [dropRef, dndOn, registerCourtColumn, courtId]
  );

  return (
    <div
      ref={setRef}
      className={cn(
        'relative w-full min-w-0 overflow-hidden select-none',
        onColumnClick && !isMaintenance && 'cursor-pointer'
      )}
      style={{ height: columnHeight + TIMELINE_TOP_INSET_PX }}
      onClick={onColumnClick}
    >
      {dropPreview ? (
        <>
          <ScheduleCourtDropHighlight
            severity={dropPreview.severity}
            isActive
          />
          <ScheduleDropSnapLine
            topPx={previewTopPx(dropPreview, dayStart, pxPerMinute)}
            time={dropPreview.time}
          />
        </>
      ) : null}

      {timeLabels.map(({ minutes, topPx, isHour }) => (
        <div
          key={minutes}
          className={cn(
            'border-surface-border pointer-events-none absolute right-0 left-0 border-t',
            isHour ? '' : 'border-dashed opacity-80'
          )}
          style={{ top: TIMELINE_TOP_INSET_PX + topPx }}
        />
      ))}

      {isMaintenance && (
        <div className="bg-surface-hover/80 absolute inset-0 flex items-center justify-center backdrop-blur-[1px]">
          <span className="text-faint pointer-events-none rotate-[-25deg] text-xs font-semibold tracking-widest uppercase select-none">
            Bảo trì
          </span>
        </div>
      )}

      {!isMaintenance && placed.length === 0 && onClickEmpty && (
        <div className="text-faint pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1.5 opacity-40">
          <IonIcon name="calendar-outline" className="h-7 w-7" />
          <span className="text-[11px]">{emptyColumnHint}</span>
        </div>
      )}

      {placed.map((pm) => (
        <TimelineMatchSlot
          key={pm.match.id}
          pm={pm}
          cardSizing={cardSizing}
          highlightedMatchIds={highlightedMatchIds}
          dimUnhighlighted={dimUnhighlighted}
          renderMatchCard={renderMatchCard}
          dragDropEnabled={dragDropEnabled}
          selectedDate={selectedDate}
          isPastDate={isPastDate}
        />
      ))}
    </div>
  );
}

function TimelineMatchSlot({
  pm,
  cardSizing,
  highlightedMatchIds,
  dimUnhighlighted,
  renderMatchCard,
  dragDropEnabled = false,
  selectedDate = '',
  isPastDate = false,
}: {
  pm: TimelinePlacedMatch;
  cardSizing: TimelineCardSizing;
  highlightedMatchIds?: ReadonlySet<string>;
  dimUnhighlighted?: boolean;
  renderMatchCard: TournamentCourtTimelineGridProps['renderMatchCard'];
  dragDropEnabled?: boolean;
  selectedDate?: string;
  isPastDate?: boolean;
}) {
  const isContent = cardSizing === 'content';
  const slotTop = pm.visualTopPx;
  const slotHeight = isContent
    ? undefined
    : Math.max(pm.heightPx - TIMELINE_CARD_GAP_PX * 2, 28);

  const { shouldDim, showOverlay } = resolveScheduleSearchHighlight(
    pm.match.id,
    highlightedMatchIds,
    dimUnhighlighted
  );

  const layout = {
    topPx: pm.topPx,
    visualTopPx: pm.visualTopPx,
    slotMinHeightPx: pm.slotMinHeightPx,
    heightPx: slotHeight ?? pm.slotMinHeightPx,
    isConflict: pm.isConflict,
    cardSizing,
  };

  const inset = TIMELINE_COLUMN_INSET_PX;

  return (
    <div
      data-match-id={pm.match.id}
      className={cn(
        'absolute box-border',
        scheduleMatchSearchElevatedClass(showOverlay),
        scheduleMatchSearchDimClass(shouldDim)
      )}
      style={{
        top: TIMELINE_TOP_INSET_PX + slotTop,
        left: inset,
        right: inset,
        width: `calc(100% - ${inset * 2}px)`,
        ...(isContent
          ? { minHeight: pm.slotMinHeightPx, height: 'auto' }
          : { height: slotHeight }),
      }}
      onClick={(e) => e.stopPropagation()}
    >
      {pm.isConflict && (
        <div className="absolute -top-1 -right-1 z-20 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 shadow">
          <IonIcon
            name="alert-circle-outline"
            className="h-2.5 w-2.5 text-white"
          />
        </div>
      )}
      <div
        className={cn(
          'relative box-border w-full max-w-full min-w-0',
          isContent ? 'h-auto' : 'h-full',
          pm.isConflict &&
            'rounded-lg ring-2 ring-red-400/60 dark:ring-red-500/50'
        )}
      >
        {dragDropEnabled ? (
          <ScheduleDraggableMatchWrapper
            matchId={pm.match.id}
            source="grid"
            showDragHandle={cardSizing === 'slot'}
            disabled={
              !canDragScheduledMatch(pm.match, selectedDate, isPastDate)
            }
          >
            {renderMatchCard(pm.match, layout)}
          </ScheduleDraggableMatchWrapper>
        ) : (
          renderMatchCard(pm.match, layout)
        )}
        {showOverlay ? <ScheduleMatchSearchHighlightOverlay /> : null}
      </div>
    </div>
  );
}
