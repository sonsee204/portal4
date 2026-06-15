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
import { NOTIFICATION_FRAGMENT } from '@/graphql/notification/fragments';

export const NOTIFICATION_CREATED_SUBSCRIPTION = gql`
  subscription NotificationCreated($userId: ID!) {
    notificationCreated(userId: $userId) {
      ...NotificationFields
    }
  }
  ${NOTIFICATION_FRAGMENT}
`;
