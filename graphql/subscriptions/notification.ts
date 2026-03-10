import { gql } from 'graphql-tag';
import { NOTIFICATION_FRAGMENT } from '../fragments/notification';

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
  subscription NotificationCreated($userId: ID!) {
    notificationCreated(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
