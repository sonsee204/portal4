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
