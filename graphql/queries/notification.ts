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

import { gql } from 'graphql-tag';
import { NOTIFICATION_FRAGMENT } from '../fragments/notification';

export const GET_NOTIFICATIONS = gql`
  query GetNotifications(
    $filter: NotificationFilterInput
    $pagination: PaginationInput
  ) {
    getNotifications(filter: $filter, pagination: $pagination) {
      notifications {
        ...NotificationFields
      }
      total
      unreadCount
      hasMore
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const GET_UNREAD_NOTIFICATION_COUNT = gql`
  query GetUnreadNotificationCount {
    getUnreadNotificationCount
  }
`;

export const GET_NOTIFICATION = gql`
  query GetNotification($notificationId: ID!) {
    getNotification(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
