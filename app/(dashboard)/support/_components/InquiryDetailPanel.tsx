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

import { useState } from 'react';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { useUpdateInquiryStatus } from '@/hooks/contact';
import { formatMutationError } from '@/hooks/shared';
import { showSuccess, showError } from '@/lib/toast';
import type { ContactInquiry } from '@/types';
import { InquiryStatusEnum, ContactSubjectEnum } from '@/types';
import { SUPPORT } from '@/lib/strings';

const statusVariant: Record<
  InquiryStatusEnum,
  'danger' | 'warning' | 'success' | 'neutral'
> = {
  [InquiryStatusEnum.NEW]: 'danger',
  [InquiryStatusEnum.IN_PROGRESS]: 'warning',
  [InquiryStatusEnum.REPLIED]: 'success',
  [InquiryStatusEnum.CLOSED]: 'neutral',
};

const statusLabel: Record<InquiryStatusEnum, string> = {
  [InquiryStatusEnum.NEW]: SUPPORT.STATUS.NEW,
  [InquiryStatusEnum.IN_PROGRESS]: SUPPORT.STATUS.IN_PROGRESS,
  [InquiryStatusEnum.REPLIED]: SUPPORT.STATUS.REPLIED,
  [InquiryStatusEnum.CLOSED]: SUPPORT.STATUS.CLOSED,
};

const subjectLabel: Record<ContactSubjectEnum, string> = {
  [ContactSubjectEnum.COOPERATION]: SUPPORT.SUBJECT.COOPERATION,
  [ContactSubjectEnum.SUPPORT]: SUPPORT.SUBJECT.SUPPORT,
  [ContactSubjectEnum.RECRUITMENT]: SUPPORT.SUBJECT.RECRUITMENT,
  [ContactSubjectEnum.OTHER]: SUPPORT.SUBJECT.OTHER,
};

const statusTransitions: Record<InquiryStatusEnum, InquiryStatusEnum[]> = {
  [InquiryStatusEnum.NEW]: [
    InquiryStatusEnum.IN_PROGRESS,
    InquiryStatusEnum.REPLIED,
    InquiryStatusEnum.CLOSED,
  ],
  [InquiryStatusEnum.IN_PROGRESS]: [
    InquiryStatusEnum.REPLIED,
    InquiryStatusEnum.CLOSED,
  ],
  [InquiryStatusEnum.REPLIED]: [InquiryStatusEnum.CLOSED],
  [InquiryStatusEnum.CLOSED]: [],
};

export function InquiryDetailPanel({
  inquiry,
  onStatusUpdated,
}: {
  inquiry: ContactInquiry;
  onStatusUpdated: (updated: ContactInquiry) => void;
}) {
  const [adminNote, setAdminNote] = useState(inquiry.adminNote ?? '');
  const { updateStatus, loading } = useUpdateInquiryStatus();

  const allowedTransitions = statusTransitions[inquiry.status] ?? [];

  const handleStatusUpdate = async (newStatus: InquiryStatusEnum) => {
    try {
      const updated = await updateStatus(inquiry._id, {
        status: newStatus,
        ...(adminNote.trim() && { adminNote: adminNote.trim() }),
      });
      showSuccess(SUPPORT.DETAIL.STATUS_UPDATED(statusLabel[newStatus]));
      if (updated) {
        onStatusUpdated(updated);
      }
    } catch (err) {
      showError(formatMutationError(err));
    }
  };

  const handleSaveNote = async () => {
    try {
      const updated = await updateStatus(inquiry._id, {
        status: inquiry.status,
        adminNote: adminNote.trim(),
      });
      showSuccess(SUPPORT.DETAIL.NOTE_SAVED);
      if (updated) {
        onStatusUpdated(updated);
      }
    } catch (err) {
      showError(formatMutationError(err));
    }
  };

  return (
    <GlassPanel card className="flex h-full flex-col">
      {/* Header */}
      <div className="border-surface-border flex items-center justify-between border-b pb-4">
        <div>
          <h3 className="text-heading text-sm font-bold">
            {subjectLabel[inquiry.subject]}
          </h3>
          <p className="text-faint text-xs">
            {inquiry.name} &middot;{' '}
            {new Date(inquiry.createdAt).toLocaleString('vi-VN')}
          </p>
        </div>
        <Badge variant={statusVariant[inquiry.status]} dot>
          {statusLabel[inquiry.status]}
        </Badge>
      </div>

      {/* Message content */}
      <div className="flex-1 overflow-y-auto py-6">
        <div className="space-y-5">
          {/* Contact info summary */}
          <div className="bg-surface grid grid-cols-2 gap-3 rounded-xl p-4">
            <div className="flex items-center gap-2 text-xs">
              <IonIcon name="person-outline" size="sm" className="text-muted" />
              <span className="text-heading font-medium">{inquiry.name}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <IonIcon name="call-outline" size="sm" className="text-muted" />
              <span className="text-heading">{inquiry.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <IonIcon name="mail-outline" size="sm" className="text-muted" />
              <span className="text-heading">{inquiry.email}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <IonIcon
                name="pricetag-outline"
                size="sm"
                className="text-muted"
              />
              <span className="text-heading">
                {subjectLabel[inquiry.subject]}
              </span>
            </div>
          </div>

          {/* Message body */}
          <div>
            <p className="text-faint mb-2 text-xs font-bold tracking-wider uppercase">
              {SUPPORT.DETAIL.MESSAGE_LABEL}
            </p>
            <div className="border-surface-border bg-surface/50 rounded-xl border p-4">
              <p className="text-body text-sm leading-relaxed whitespace-pre-wrap">
                {inquiry.message}
              </p>
            </div>
          </div>

          {/* Admin replied info */}
          {inquiry.repliedByUser && inquiry.repliedAt && (
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs text-emerald-400">
                {SUPPORT.DETAIL.REPLIED_BY}{' '}
                <span className="font-medium">
                  {inquiry.repliedByUser.fullName}
                </span>{' '}
                &middot; {new Date(inquiry.repliedAt).toLocaleString('vi-VN')}
              </p>
            </div>
          )}

          {/* Admin note */}
          <div>
            <p className="text-faint mb-2 text-xs font-bold tracking-wider uppercase">
              {SUPPORT.DETAIL.ADMIN_NOTE_LABEL}
            </p>
            <textarea
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder={SUPPORT.DETAIL.ADMIN_NOTE_PLACEHOLDER}
              rows={3}
              className="border-surface-border bg-surface text-heading placeholder-faint focus:border-primary/50 focus:ring-primary/50 w-full resize-none rounded-xl border px-4 py-3 text-sm outline-none focus:ring-2"
            />
            {adminNote !== (inquiry.adminNote ?? '') && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-2"
                onClick={handleSaveNote}
                disabled={loading}
              >
                {SUPPORT.DETAIL.SAVE_NOTE}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Status actions */}
      {allowedTransitions.length > 0 && (
        <div className="border-surface-border border-t pt-4">
          <p className="text-faint mb-2 text-xs">
            {SUPPORT.DETAIL.UPDATE_STATUS_LABEL}
          </p>
          <div className="flex flex-wrap gap-2">
            {allowedTransitions.map((status) => (
              <Button
                key={status}
                size="sm"
                variant={
                  status === InquiryStatusEnum.CLOSED ? 'ghost' : 'primary'
                }
                onClick={() => handleStatusUpdate(status)}
                disabled={loading}
              >
                {statusLabel[status]}
              </Button>
            ))}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}
