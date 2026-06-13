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

export enum NotificationType {
  BOOKING = 'booking',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_PASS = 'booking_pass',
  TOURNAMENT = 'tournament',
  PAYMENT = 'payment',
  SOCIAL = 'social',
  SYSTEM = 'system',
  NEW_MESSAGE = 'new_message',
  GROUP_INVITE = 'group_invite',
  POST_REPORT = 'post_report',
  ORDER = 'order',
}

export interface NotificationData {
  screen?: string;
  targetId?: string;
  action?: string;
  requesterId?: string;
  initialTab?: string;
  actionTaken?: boolean;
  secondaryTargetId?: string;
}

export interface Notification {
  _id: string;
  userId: string;
  type: NotificationType;
  title: string;
  description: string;
  icon: string;
  imageUrl?: string;
  data?: NotificationData;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationList {
  notifications: Notification[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

export interface MarkAllAsReadResponse {
  success: boolean;
  message: string;
  count: number;
}
