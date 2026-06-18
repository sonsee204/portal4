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

'use client';

import { Button } from '@/components/atoms/Button';
import {
  RegistrationStatus,
  type TournamentRegistration,
} from '@/graphql/generated';
import type { RegistrationsPageActions } from '../_hooks/useRegistrationsPageActions';

interface RegistrationDetailFooterActionsProps {
  registration: TournamentRegistration;
  actions: Pick<
    RegistrationsPageActions,
    'isActionLoading' | 'approve' | 'handleReject' | 'handleDelete'
  >;
}

export function RegistrationDetailFooterActions({
  registration,
  actions,
}: RegistrationDetailFooterActionsProps) {
  const { isActionLoading, approve, handleReject, handleDelete } = actions;
  const status = registration.registrationStatus;

  const canApprove =
    status === RegistrationStatus.Pending ||
    status === RegistrationStatus.Waitlisted;
  const canReject = status === RegistrationStatus.Pending;

  if (!canApprove && !canReject) {
    return (
      <Button
        variant="danger"
        size="sm"
        iconLeft="trash-outline"
        disabled={isActionLoading}
        onClick={() => handleDelete(registration)}
      >
        Xoá
      </Button>
    );
  }

  return (
    <div className="flex flex-wrap justify-end gap-2">
      {canApprove && (
        <Button
          size="sm"
          iconLeft="checkmark-circle-outline"
          disabled={isActionLoading}
          onClick={() => void approve(registration._id)}
        >
          Duyệt
        </Button>
      )}
      {canReject && (
        <Button
          variant="danger"
          size="sm"
          iconLeft="close-circle-outline"
          disabled={isActionLoading}
          onClick={() => handleReject(registration)}
        >
          Từ chối
        </Button>
      )}
      <Button
        variant="ghost"
        size="sm"
        iconLeft="trash-outline"
        disabled={isActionLoading}
        onClick={() => handleDelete(registration)}
      >
        Xoá
      </Button>
    </div>
  );
}
