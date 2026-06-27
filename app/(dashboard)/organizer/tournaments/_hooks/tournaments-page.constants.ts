/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

import { TOURNAMENT } from '@/lib/strings';
import { TournamentStatus } from '@/graphql/generated';

export type TournamentStatusTab = TournamentStatus | 'ALL';

export const STATUS_TABS: { label: string; value: TournamentStatusTab }[] = [
  { label: 'Tất cả', value: 'ALL' },
  { label: TOURNAMENT.STATUS_DRAFT, value: TournamentStatus.Draft },
  { label: TOURNAMENT.STATUS_PUBLISHED, value: TournamentStatus.Published },
  {
    label: TOURNAMENT.STATUS_REGISTRATION_OPEN,
    value: TournamentStatus.RegistrationOpen,
  },
  {
    label: TOURNAMENT.STATUS_IN_PROGRESS,
    value: TournamentStatus.InProgress,
  },
  { label: TOURNAMENT.STATUS_COMPLETED, value: TournamentStatus.Completed },
];

export const PLATFORM_PAGE_SIZE = 20;
export const ORGANIZER_PAGE_SIZE = 20;
