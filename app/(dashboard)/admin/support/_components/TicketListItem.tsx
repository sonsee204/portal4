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

import { cn } from '@/lib/utils';
import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import type { ContactInquiry } from '@/types';
import { InquiryStatusEnum, ContactSubjectEnum } from '@/types';
import { SUPPORT, TIME } from '@/lib/strings';

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

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return TIME.JUST_NOW;
  if (diffMin < 60) return TIME.MINUTES(diffMin);
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return TIME.HOURS(diffHour);
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return TIME.DAYS(diffDay);
  return date.toLocaleDateString('vi-VN');
}

export function TicketListItem({
  inquiry,
  active,
  onClick,
}: {
  inquiry: ContactInquiry;
  active: boolean;
  onClick: () => void;
}) {
  const isNew = inquiry.status === InquiryStatusEnum.NEW;

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-xl p-3 text-left transition-colors',
        active
          ? 'bg-primary/10 border-primary/30 border'
          : 'hover:bg-surface-hover border border-transparent'
      )}
    >
      <div className="flex items-start gap-3">
        <Avatar fallback={inquiry.name[0]} size="sm" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <p
              className={cn(
                'truncate text-sm',
                isNew ? 'text-heading font-bold' : 'text-body'
              )}
            >
              {subjectLabel[inquiry.subject]}
            </p>
            {isNew && (
              <span className="bg-primary h-2 w-2 shrink-0 rounded-full" />
            )}
          </div>
          <p className="text-faint mt-0.5 text-xs">{inquiry.name}</p>
          <p className="text-muted mt-1 truncate text-xs">{inquiry.message}</p>
          <div className="mt-1.5 flex items-center justify-between">
            <Badge
              variant={statusVariant[inquiry.status]}
              className="text-[10px]"
            >
              {statusLabel[inquiry.status]}
            </Badge>
            <span className="text-faint text-[10px]">
              {formatRelativeTime(inquiry.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
