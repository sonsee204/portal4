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

import type { NotificationData } from '@/types/notification';

export function getNotificationHref(
  data?: NotificationData,
  notificationId?: string,
): string | null {
  if (!data) return null;

  const { screen, targetId } = data;
  if (!screen) return null;

  switch (screen) {
    // Referee response notifications → navigate to tournament schedule
    case 'TournamentSchedule':
      return targetId
        ? `/admin/tournaments/${targetId}/schedule`
        : '/admin/tournaments';

    case 'BookingDetail':
    case 'Booking':
      return targetId ? `/bookings/${targetId}` : '/bookings';

    case 'VenueDetail':
    case 'Venue':
      return targetId ? `/venues/${targetId}` : '/venues';

    case 'TournamentDetail':
    case 'Tournament':
      return targetId ? `/admin/tournaments/${targetId}` : '/admin/tournaments';

    case 'UserDetail':
    case 'UserProfile':
      return targetId ? `/admin/users/${targetId}` : '/admin/users';

    case 'PostReport':
    case 'Moderation':
      return '/admin/moderation';

    case 'StaffInvitation':
      return '/settings/staff';

    case 'Notifications':
      return '/notifications';

    default:
      return null;
  }
}
