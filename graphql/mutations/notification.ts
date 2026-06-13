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

export const MARK_NOTIFICATION_AS_READ = gql`
  mutation MarkNotificationAsRead($notificationId: ID!) {
    markNotificationAsRead(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const MARK_ALL_NOTIFICATIONS_AS_READ = gql`
  mutation MarkAllNotificationsAsRead($type: NotificationType) {
    markAllNotificationsAsRead(type: $type) {
      success
      message
      count
    }
  }
`;

export const MARK_NOTIFICATION_ACTION_TAKEN = gql`
  mutation MarkNotificationActionTaken($notificationId: ID!) {
    markNotificationActionTaken(notificationId: $notificationId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;

export const DELETE_NOTIFICATION = gql`
  mutation DeleteNotification($notificationId: ID!) {
    deleteNotification(notificationId: $notificationId)
  }
`;

export const CLEAR_READ_NOTIFICATIONS = gql`
  mutation ClearReadNotifications {
    clearReadNotifications
  }
`;

export const SAVE_FCM_TOKEN = gql`
  mutation SaveFcmToken($token: String!) {
    saveFcmToken(token: $token)
  }
`;

export const REMOVE_FCM_TOKEN = gql`
  mutation RemoveFcmToken($token: String!) {
    removeFcmToken(token: $token)
  }
`;
