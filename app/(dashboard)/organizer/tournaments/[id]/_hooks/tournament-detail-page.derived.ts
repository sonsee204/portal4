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
import { TournamentStatus } from '@/graphql/generated';

export function getEditQuickLinkLabel(status: TournamentStatus): string {
  if (
    status === TournamentStatus.RegistrationOpen ||
    status === TournamentStatus.RegistrationClosed
  ) {
    return TOURNAMENT.LABEL_MANAGE_COURTS;
  }
  return 'Chỉnh sửa';
}

export function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}
