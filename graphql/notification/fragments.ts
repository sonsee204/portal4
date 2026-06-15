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
