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

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { DateRangeValue } from '@/components/molecules/DateRangePicker';
import { FinanceCompareMode } from '@/graphql/generated';
import type { DateRangePreset } from '@/lib/finance/stat-card-trend';
import {
  getDefaultOwnerDateRangeState,
  readStoredOwnerDateRangeState,
  writeStoredOwnerDateRangeState,
  type OwnerDateRangeState,
} from '@/lib/owner/owner-date-range-storage';

interface OwnerDateRangeContextValue {
  datePreset: DateRangePreset;
  dateRange: DateRangeValue;
  compareMode: FinanceCompareMode;
  setDatePreset: (preset: DateRangePreset) => void;
  setDateRange: (range: DateRangeValue) => void;
  setCompareMode: (mode: FinanceCompareMode) => void;
}

const OwnerDateRangeContext = createContext<OwnerDateRangeContextValue | null>(
  null
);

function persistState(state: OwnerDateRangeState) {
  writeStoredOwnerDateRangeState(state);
}

export function OwnerDateRangeProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OwnerDateRangeState>(() => {
    return readStoredOwnerDateRangeState() ?? getDefaultOwnerDateRangeState();
  });

  const setDatePreset = useCallback((datePreset: DateRangePreset) => {
    setState((current) => {
      const next = { ...current, datePreset };
      persistState(next);
      return next;
    });
  }, []);

  const setDateRange = useCallback((dateRange: DateRangeValue) => {
    setState((current) => {
      const next = { ...current, dateRange };
      persistState(next);
      return next;
    });
  }, []);

  const setCompareMode = useCallback((compareMode: FinanceCompareMode) => {
    setState((current) => {
      const next = { ...current, compareMode };
      persistState(next);
      return next;
    });
  }, []);

  const value = useMemo<OwnerDateRangeContextValue>(
    () => ({
      datePreset: state.datePreset,
      dateRange: state.dateRange,
      compareMode: state.compareMode,
      setDatePreset,
      setDateRange,
      setCompareMode,
    }),
    [
      state.compareMode,
      state.datePreset,
      state.dateRange,
      setCompareMode,
      setDatePreset,
      setDateRange,
    ]
  );

  return (
    <OwnerDateRangeContext.Provider value={value}>
      {children}
    </OwnerDateRangeContext.Provider>
  );
}

export function useOwnerDateRange(): OwnerDateRangeContextValue {
  const ctx = useContext(OwnerDateRangeContext);
  if (!ctx) {
    throw new Error(
      'useOwnerDateRange must be used within OwnerDateRangeProvider'
    );
  }
  return ctx;
}
