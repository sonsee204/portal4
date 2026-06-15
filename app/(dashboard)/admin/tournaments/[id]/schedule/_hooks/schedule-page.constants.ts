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
  MatchStatus,
  RefereeInviteStatus,
} from '@/graphql/generated';

export const CORRECTABLE_STATUSES = new Set<MatchStatus>([
  MatchStatus.Live,
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
]);

export const REFEREE_STATUS_CONFIG: Record<
  RefereeInviteStatus,
  { label: string; className: string }
> = {
  [RefereeInviteStatus.Pending]: {
    label: 'Chờ xác nhận',
    className: 'bg-amber-500/10 text-amber-500',
  },
  [RefereeInviteStatus.Confirmed]: {
    label: 'Đã xác nhận',
    className: 'bg-emerald-500/10 text-emerald-500',
  },
  [RefereeInviteStatus.Declined]: {
    label: 'Đã từ chối',
    className: 'bg-red-500/10 text-red-500',
  },
};

export const ALL_MATCH_STATUS = 'ALL' as const;

export const REPACK_ANCHOR_STATUSES = new Set<MatchStatus>([
  MatchStatus.Live,
  MatchStatus.Finished,
  MatchStatus.Walkover,
  MatchStatus.Retirement,
]);

export const LIST_STATUS_COLORS: Record<MatchStatus, string> = {
  [MatchStatus.NotStarted]: 'text-secondary',
  [MatchStatus.Live]: 'text-green-400',
  [MatchStatus.Finished]: 'text-emerald-400',
  [MatchStatus.Bye]: 'text-yellow-400',
  [MatchStatus.Walkover]: 'text-orange-400',
  [MatchStatus.Cancelled]: 'text-red-400',
  [MatchStatus.Retirement]: 'text-orange-400',
};

export const LIST_STATUS_TABS = [
  { label: 'Tất cả', value: ALL_MATCH_STATUS },
  { label: 'Chưa bắt đầu', value: MatchStatus.NotStarted },
  { label: 'Đang diễn ra', value: MatchStatus.Live },
  { label: 'Đã kết thúc', value: MatchStatus.Finished },
] as const;

export const VIEW_MODE_TABS = [
  { id: 'grid' as const, label: 'Lưới sân' },
  { id: 'list' as const, label: 'Danh sách' },
] as const;
