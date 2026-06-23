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

import {
  CategoryStatus,
  TournamentStatus,
  type TournamentCategory,
} from '@/graphql/generated';
import {
  toggleSelectAllIds,
  toggleSelectionSet,
} from '@/hooks/shared/selection-set';

export { toggleSelectAllIds, toggleSelectionSet };

export function formatRegistrationDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDateShort(dateStr?: string | null): string {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function formatCurrency(amount?: number | null): string {
  if (amount == null) return '—';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export function canImportRegistrations(
  tournament: { status: TournamentStatus } | null | undefined,
  categories: ReadonlyArray<{ status: CategoryStatus }>,
): boolean {
  if (!tournament) return false;
  if (tournament.status !== TournamentStatus.RegistrationOpen) return false;
  const drawnStatuses = [
    CategoryStatus.DrawCompleted,
    CategoryStatus.InProgress,
    CategoryStatus.Completed,
  ];
  return !categories.some((c) => drawnStatuses.includes(c.status));
}

export function buildCategoryTitleMap(
  categories: ReadonlyArray<TournamentCategory> | undefined,
): Map<string, string> {
  return new Map(categories?.map((c) => [c._id, c.title]) ?? []);
}

export function buildCategoryMatchTypeMap(
  categories: ReadonlyArray<TournamentCategory> | undefined,
): Map<string, TournamentCategory['matchType']> {
  return new Map(categories?.map((c) => [c._id, c.matchType]) ?? []);
}

export function parseBibNumberInput(value: string): number | undefined {
  const val = value.trim();
  if (val === '') return undefined;
  const num = parseInt(val, 10);
  if (isNaN(num) || num < 1) return undefined;
  return num;
}

