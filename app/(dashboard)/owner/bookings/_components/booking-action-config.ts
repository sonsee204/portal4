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

import type { BookingConfirmAction } from '../types';
import { getBookingActionAvailability } from '../types';

export const BOOKING_ACTION_BUTTONS: Array<{
  action: BookingConfirmAction;
  label: string;
  icon: string;
  tone?: 'primary' | 'danger';
  key: keyof ReturnType<typeof getBookingActionAvailability>;
}> = [
    {
      action: 'approveHold',
      label: 'Duyệt giữ chỗ',
      icon: 'checkmark-circle-outline',
      tone: 'primary',
      key: 'canApproveHold',
    },
    {
      action: 'confirmHold',
      label: 'Xác nhận giữ chỗ',
      icon: 'ticket-outline',
      tone: 'primary',
      key: 'canConfirmHold',
    },
    {
      action: 'confirm',
      label: 'Xác nhận',
      icon: 'checkmark-outline',
      tone: 'primary',
      key: 'canConfirm',
    },
    {
      action: 'reject',
      label: 'Từ chối',
      icon: 'close-circle-outline',
      tone: 'danger',
      key: 'canReject',
    },
    {
      action: 'rejectHold',
      label: 'Từ chối giữ chỗ',
      icon: 'close-circle-outline',
      tone: 'danger',
      key: 'canRejectHold',
    },
    {
      action: 'checkIn',
      label: 'Check-in',
      icon: 'enter-outline',
      tone: 'primary',
      key: 'canCheckIn',
    },
    {
      action: 'complete',
      label: 'Hoàn thành',
      icon: 'flag-outline',
      tone: 'primary',
      key: 'canComplete',
    },
    {
      action: 'markNoShow',
      label: 'Vắng mặt',
      icon: 'person-remove-outline',
      tone: 'danger',
      key: 'canMarkNoShow',
    },
    {
      action: 'cancel',
      label: 'Hủy',
      icon: 'trash-outline',
      tone: 'danger',
      key: 'canCancel',
    },
  ];
