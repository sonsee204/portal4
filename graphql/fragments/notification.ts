import { gql } from 'graphql-tag';

export const NOTIFICATION_FRAGMENT = gql`
  fragment NotificationFields on Notification {
    _id
    userId
    type
    title
    description
    icon
    imageUrl
    data {
      screen
      targetId
      action
      requesterId
      initialTab
      actionTaken
      secondaryTargetId
    }
    isRead
    readAt
    createdAt
    updatedAt
  }
`;
