/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { TOURNAMENT } from '@/lib/strings';
import type { TournamentStatus } from '@/graphql/generated';

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: TOURNAMENT.STATUS_DRAFT,
  PUBLISHED: TOURNAMENT.STATUS_PUBLISHED,
  REGISTRATION_OPEN: TOURNAMENT.STATUS_REGISTRATION_OPEN,
  REGISTRATION_CLOSED: TOURNAMENT.STATUS_REGISTRATION_CLOSED,
  IN_PROGRESS: TOURNAMENT.STATUS_IN_PROGRESS,
  COMPLETED: TOURNAMENT.STATUS_COMPLETED,
  CANCELLED: TOURNAMENT.STATUS_CANCELLED,
};

export const STATUS_BADGE_VARIANT: Record<
  TournamentStatus,
  'neutral' | 'success' | 'warning' | 'danger' | 'info'
> = {
  DRAFT: 'neutral',
  PUBLISHED: 'info',
  REGISTRATION_OPEN: 'success',
  REGISTRATION_CLOSED: 'warning',
  IN_PROGRESS: 'warning',
  COMPLETED: 'success',
  CANCELLED: 'danger',
};

export function formatTournamentDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function buildTournamentListFilter(options: {
  activeTab: TournamentStatus | 'ALL';
  searchQuery?: string;
  organizerId?: string;
}) {
  const filter: {
    status?: TournamentStatus;
    searchQuery?: string;
    organizerId?: string;
  } = {};

  if (options.activeTab !== 'ALL') {
    filter.status = options.activeTab;
  }
  if (options.searchQuery?.trim()) {
    filter.searchQuery = options.searchQuery.trim();
  }
  if (options.organizerId?.trim()) {
    filter.organizerId = options.organizerId.trim();
  }

  return Object.keys(filter).length > 0 ? filter : undefined;
}
