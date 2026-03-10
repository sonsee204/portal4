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
