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
