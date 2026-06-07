import type { ScheduleMatch } from '@/types/tournament-schedule';
import { checkPlayerScheduleConflict } from '@/lib/tournament/schedule-player-conflicts';
import { timeToMinutes } from '@/lib/tournament/schedule-time';
import { hasTimeOverlap } from '@/lib/tournament/schedule-court-conflicts';
import { isScheduleMatchEnded } from '@/lib/tournament/match-ended';

export type DropSeverity = 'ok' | 'warn' | 'block';

export interface ScheduleDropValidation {
  severity: DropSeverity;
  messages: string[];
  canDrop: boolean;
}

export interface ValidateScheduleDropInput {
  match: ScheduleMatch;
  courtId: string;
  time: string;
  selectedDate: string;
  allMatches: ScheduleMatch[];
  courts: { id: string; status?: string }[];
  minRestMinutes?: number;
  courtBufferMinutes?: number;
  /** When false, ended matches cannot be moved (default true allows drag with warn for live). */
  allowLiveMove?: boolean;
}

function isSelectionInPast(selectedDate: string, time: string): boolean {
  const today = new Date().toLocaleDateString('en-CA');
  if (selectedDate < today) return true;
  if (selectedDate !== today) return false;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  return timeToMinutes(time) <= currentMinutes;
}

export function validateScheduleDrop({
  match,
  courtId,
  time,
  selectedDate,
  allMatches,
  courts,
  minRestMinutes = 0,
  courtBufferMinutes = 5,
  allowLiveMove = true,
}: ValidateScheduleDropInput): ScheduleDropValidation {
  const messages: string[] = [];

  if (isScheduleMatchEnded(match.status)) {
    return {
      severity: 'block',
      messages: ['Trận đã kết thúc — không thể đổi lịch'],
      canDrop: false,
    };
  }

  const court = courts.find((c) => c.id === courtId);
  if (!court || court.status === 'maintenance') {
    return {
      severity: 'block',
      messages: ['Sân đang bảo trì hoặc không khả dụng'],
      canDrop: false,
    };
  }

  if (isSelectionInPast(selectedDate, time)) {
    return {
      severity: 'block',
      messages: ['Không thể xếp vào giờ đã qua'],
      canDrop: false,
    };
  }

  if (match.status === 'live' && !allowLiveMove) {
    return {
      severity: 'block',
      messages: ['Trận đang diễn ra — không thể đổi lịch'],
      canDrop: false,
    };
  }

  const duration = match.estimatedDurationMinutes ?? 30;
  const startMin = timeToMinutes(time);

  const hypothetical: ScheduleMatch = {
    ...match,
    courtId,
    startTime: time,
    scheduledDate: selectedDate,
  };

  const sameDayScheduled = allMatches.filter(
    (m) =>
      m.id !== match.id &&
      m.courtId &&
      m.startTime &&
      (m.scheduledDate == null || m.scheduledDate === selectedDate),
  );

  const courtConflict = sameDayScheduled.find((other) =>
    hasTimeOverlap(hypothetical, other, courtBufferMinutes),
  );

  if (courtConflict) {
    messages.push(
      `Trùng sân với trận #${courtConflict.matchNumber}`,
    );
  }

  const playerConflict = checkPlayerScheduleConflict(
    match,
    startMin,
    duration,
    sameDayScheduled,
    minRestMinutes,
  );

  if (playerConflict) {
    if (playerConflict.type === 'overlap') {
      messages.push(
        `VĐV trùng lịch với trận #${playerConflict.conflictMatch.matchNumber}`,
      );
    } else {
      messages.push(
        `VĐV nghỉ < ${minRestMinutes} phút so với trận #${playerConflict.conflictMatch.matchNumber}`,
      );
    }
  }

  if (match.status === 'live') {
    messages.push('Trận đang diễn ra — cân nhắc kỹ trước khi đổi lịch');
  }

  if (messages.length === 0) {
    return { severity: 'ok', messages: [], canDrop: true };
  }

  const hasHardBlock = false;
  if (hasHardBlock) {
    return { severity: 'block', messages, canDrop: false };
  }

  return {
    severity: 'warn',
    messages,
    canDrop: true,
  };
}

/** Whether a scheduled match can be dragged from the grid. */
export function canDragScheduledMatch(
  match: ScheduleMatch,
  selectedDate: string,
  isPastDate: boolean,
): boolean {
  if (isScheduleMatchEnded(match.status)) return false;
  if (isPastDate) return false;
  if (!match.courtId || !match.startTime) return false;
  return true;
}

/** Whether dropping onto the unscheduled pool should unschedule. */
export function canUnscheduleViaDrop(match: ScheduleMatch): boolean {
  if (isScheduleMatchEnded(match.status)) return false;
  if (match.status === 'live') return false;
  return Boolean(match.courtId && match.startTime);
}
