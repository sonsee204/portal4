'use client';

import { useCallback, useRef, useState } from 'react';
import type { ScheduleMatch } from '@/types/tournament-schedule';

export interface OptimisticMove {
  matchId: string;
  previousCourtId?: string;
  previousStartTime?: string;
  previousScheduledDate?: string;
  courtId: string;
  startTime: string;
  scheduledDate: string;
}

export function useScheduleOptimisticMoves() {
  const [moves, setMoves] = useState<Map<string, OptimisticMove>>(new Map());
  const pendingIdsRef = useRef<Set<string>>(new Set());

  const applyOptimisticMove = useCallback(
    (match: ScheduleMatch, courtId: string, time: string, scheduledDate: string) => {
      setMoves((prev) => {
        const next = new Map(prev);
        next.set(match.id, {
          matchId: match.id,
          previousCourtId: match.courtId,
          previousStartTime: match.startTime,
          previousScheduledDate: match.scheduledDate,
          courtId,
          startTime: time,
          scheduledDate,
        });
        return next;
      });
      pendingIdsRef.current.add(match.id);
    },
    [],
  );

  const commitMove = useCallback((matchId: string) => {
    setMoves((prev) => {
      const next = new Map(prev);
      next.delete(matchId);
      return next;
    });
    pendingIdsRef.current.delete(matchId);
  }, []);

  const rollbackMove = useCallback((matchId: string) => {
    setMoves((prev) => {
      const next = new Map(prev);
      next.delete(matchId);
      return next;
    });
    pendingIdsRef.current.delete(matchId);
  }, []);

  const hasPendingMoves = useCallback(
    () => pendingIdsRef.current.size > 0,
    [],
  );

  const patchMatches = useCallback(
    (matches: ScheduleMatch[]): ScheduleMatch[] => {
      if (moves.size === 0) return matches;
      return matches.map((m) => {
        const move = moves.get(m.id);
        if (!move) return m;
        return {
          ...m,
          courtId: move.courtId,
          startTime: move.startTime,
          scheduledDate: move.scheduledDate,
        };
      });
    },
    [moves],
  );

  const getMove = useCallback(
    (matchId: string) => moves.get(matchId),
    [moves],
  );

  return {
    applyOptimisticMove,
    commitMove,
    rollbackMove,
    hasPendingMoves,
    patchMatches,
    getMove,
    pendingCount: moves.size,
  };
}
