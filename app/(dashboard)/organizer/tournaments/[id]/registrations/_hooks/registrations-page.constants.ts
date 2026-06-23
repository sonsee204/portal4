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
  RegistrationStatus,
  TournamentPaymentStatus,
} from '@/graphql/generated';
import { TOURNAMENT } from '@/lib/strings';

export const PAGE_SIZE = 20;

export const ALL_STATUS = 'ALL' as const;
export type StatusFilterValue = RegistrationStatus | typeof ALL_STATUS;

export const STATUS_FILTERS: { label: string; value: StatusFilterValue }[] = [
  { label: 'Tất cả', value: ALL_STATUS },
  { label: TOURNAMENT.REG_STATUS_PENDING, value: RegistrationStatus.Pending },
  { label: TOURNAMENT.REG_STATUS_APPROVED, value: RegistrationStatus.Approved },
  { label: TOURNAMENT.REG_STATUS_REJECTED, value: RegistrationStatus.Rejected },
];

export const REG_STATUS_COLORS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Pending]: 'bg-yellow-500/20 text-yellow-400',
  [RegistrationStatus.Approved]: 'bg-green-500/20 text-green-400',
  [RegistrationStatus.Rejected]: 'bg-red-500/20 text-red-400',
  [RegistrationStatus.Waitlisted]: 'bg-blue-500/20 text-blue-400',
};

export const PAYMENT_COLORS: Record<TournamentPaymentStatus, string> = {
  [TournamentPaymentStatus.Unpaid]: 'bg-gray-500/20 text-gray-400',
  [TournamentPaymentStatus.Verifying]: 'bg-yellow-500/20 text-yellow-400',
  [TournamentPaymentStatus.Paid]: 'bg-green-500/20 text-green-400',
  [TournamentPaymentStatus.Refunded]: 'bg-blue-500/20 text-blue-400',
};
