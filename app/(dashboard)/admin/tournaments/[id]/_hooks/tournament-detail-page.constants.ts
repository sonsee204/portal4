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

import { TOURNAMENT } from '@/lib/strings';

export const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-500/20 text-gray-400',
  PUBLISHED: 'bg-blue-500/20 text-blue-400',
  REGISTRATION_OPEN: 'bg-green-500/20 text-green-400',
  REGISTRATION_CLOSED: 'bg-yellow-500/20 text-yellow-400',
  IN_PROGRESS: 'bg-orange-500/20 text-orange-400',
  COMPLETED: 'bg-emerald-500/20 text-emerald-400',
  CANCELLED: 'bg-red-500/20 text-red-400',
};

export const STATUS_LABELS: Record<string, string> = {
  DRAFT: TOURNAMENT.STATUS_DRAFT,
  PUBLISHED: TOURNAMENT.STATUS_PUBLISHED,
  REGISTRATION_OPEN: TOURNAMENT.STATUS_REGISTRATION_OPEN,
  REGISTRATION_CLOSED: TOURNAMENT.STATUS_REGISTRATION_CLOSED,
  IN_PROGRESS: TOURNAMENT.STATUS_IN_PROGRESS,
  COMPLETED: TOURNAMENT.STATUS_COMPLETED,
  CANCELLED: TOURNAMENT.STATUS_CANCELLED,
};
