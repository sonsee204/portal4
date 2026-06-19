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

import { PromotionStatus } from '@/graphql/generated';
import { isPromotionExpired } from './promotion-status';

export type PromotionWorkflowAction =
  | 'activate'
  | 'pause'
  | 'cancel'
  | 'delete'
  | 'approve'
  | 'reject'
  | 'edit';

export type PromotionRowActionAvailability = {
  canActivate: boolean;
  canPause: boolean;
  canCancel: boolean;
  canDelete: boolean;
  canApprove: boolean;
  canReject: boolean;
  canEdit: boolean;
};

export function getPromotionRowActionAvailability(input: {
  status: PromotionStatus;
  endDate: string;
  isVenueOwner: boolean;
}): PromotionRowActionAvailability {
  const { status, endDate, isVenueOwner } = input;
  const expired = isPromotionExpired(endDate);

  const canActivate =
    isVenueOwner &&
    (status === PromotionStatus.Draft || status === PromotionStatus.Paused) &&
    !expired;

  const canPause = isVenueOwner && status === PromotionStatus.Active;
  const canCancel =
    isVenueOwner &&
    (status === PromotionStatus.Active || status === PromotionStatus.Paused);
  const canDelete =
    isVenueOwner &&
    (status === PromotionStatus.Draft ||
      status === PromotionStatus.Paused ||
      status === PromotionStatus.Expired ||
      status === PromotionStatus.Cancelled);
  const canApprove = isVenueOwner && status === PromotionStatus.PendingApproval;
  const canReject = canApprove;
  const canEdit =
    status === PromotionStatus.Draft || status === PromotionStatus.Paused;

  return {
    canActivate,
    canPause,
    canCancel,
    canDelete,
    canApprove,
    canReject,
    canEdit,
  };
}

export function getPromotionActionDialogCopy(
  action: PromotionWorkflowAction,
): {
  title: string;
  description: string;
  confirmLabel: string;
  destructive: boolean;
} {
  switch (action) {
    case 'activate':
      return {
        title: 'Kích hoạt khuyến mãi',
        description: 'Bạn có chắc muốn kích hoạt khuyến mãi này?',
        confirmLabel: 'Kích hoạt',
        destructive: false,
      };
    case 'pause':
      return {
        title: 'Tạm dừng khuyến mãi',
        description: 'Bạn có chắc muốn tạm dừng khuyến mãi này?',
        confirmLabel: 'Tạm dừng',
        destructive: false,
      };
    case 'cancel':
      return {
        title: 'Hủy khuyến mãi',
        description:
          'Bạn có chắc muốn hủy khuyến mãi này? Hành động này không thể hoàn tác.',
        confirmLabel: 'Hủy khuyến mãi',
        destructive: true,
      };
    case 'delete':
      return {
        title: 'Xóa khuyến mãi',
        description:
          'Bạn có chắc muốn xóa khuyến mãi này? Hành động này không thể hoàn tác.',
        confirmLabel: 'Xóa',
        destructive: true,
      };
    case 'approve':
      return {
        title: 'Duyệt khuyến mãi',
        description: 'Bạn có chắc muốn duyệt và kích hoạt khuyến mãi này?',
        confirmLabel: 'Duyệt',
        destructive: false,
      };
    case 'reject':
      return {
        title: 'Từ chối khuyến mãi',
        description: 'Bạn có chắc muốn từ chối khuyến mãi này?',
        confirmLabel: 'Từ chối',
        destructive: true,
      };
    default:
      return {
        title: 'Xác nhận',
        description: 'Bạn có chắc muốn tiếp tục?',
        confirmLabel: 'Xác nhận',
        destructive: false,
      };
  }
}

export function getPromotionActionSuccessMessage(
  action: PromotionWorkflowAction,
): string {
  switch (action) {
    case 'activate':
      return 'Đã kích hoạt khuyến mãi';
    case 'pause':
      return 'Đã tạm dừng khuyến mãi';
    case 'cancel':
      return 'Đã hủy khuyến mãi';
    case 'delete':
      return 'Đã xóa khuyến mãi';
    case 'approve':
      return 'Đã duyệt khuyến mãi';
    case 'reject':
      return 'Đã từ chối khuyến mãi';
    default:
      return 'Thao tác thành công';
  }
}
