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

import { Avatar } from '@/components/atoms/Avatar';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import type { ContactInquiry } from '@/types';
import { ContactSubjectEnum } from '@/types';

const subjectLabel: Record<ContactSubjectEnum, string> = {
  [ContactSubjectEnum.COOPERATION]: 'Hợp tác',
  [ContactSubjectEnum.SUPPORT]: 'Hỗ trợ',
  [ContactSubjectEnum.RECRUITMENT]: 'Tuyển dụng',
  [ContactSubjectEnum.OTHER]: 'Khác',
};

export function UserDetailPanel({ inquiry }: { inquiry: ContactInquiry }) {
  return (
    <GlassPanel card className="space-y-5">
      {/* Sender info */}
      <div className="flex flex-col items-center text-center">
        <Avatar fallback={inquiry.name[0]} />
        <p className="text-heading mt-2 text-sm font-bold">{inquiry.name}</p>
        <Badge variant="info" className="mt-1">
          {subjectLabel[inquiry.subject]}
        </Badge>
      </div>

      {/* Contact details */}
      <div className="border-surface-border space-y-3 border-t pt-4">
        <p className="text-faint text-xs font-bold tracking-wider uppercase">
          Thông tin liên hệ
        </p>
        <div className="text-muted flex items-center gap-2 text-xs">
          <IonIcon name="mail-outline" size="sm" />
          <a
            href={`mailto:${inquiry.email}`}
            className="hover:text-heading transition-colors"
          >
            {inquiry.email}
          </a>
        </div>
        <div className="text-muted flex items-center gap-2 text-xs">
          <IonIcon name="call-outline" size="sm" />
          <a
            href={`tel:${inquiry.phone}`}
            className="hover:text-heading transition-colors"
          >
            {inquiry.phone}
          </a>
        </div>
      </div>

      {/* Inquiry metadata */}
      <div className="border-surface-border space-y-2 border-t pt-4">
        <p className="text-faint text-xs font-bold tracking-wider uppercase">
          Thông tin yêu cầu
        </p>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Ngày gửi</span>
          <span className="text-heading font-medium">
            {new Date(inquiry.createdAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted">Cập nhật</span>
          <span className="text-heading font-medium">
            {new Date(inquiry.updatedAt).toLocaleDateString('vi-VN')}
          </span>
        </div>
        {inquiry.repliedByUser && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted">Người trả lời</span>
            <span className="text-heading font-medium">
              {inquiry.repliedByUser.fullName}
            </span>
          </div>
        )}
      </div>

      {/* Admin note preview */}
      {inquiry.adminNote && (
        <div className="border-surface-border space-y-2 border-t pt-4">
          <p className="text-faint text-xs font-bold tracking-wider uppercase">
            Ghi chú nội bộ
          </p>
          <p className="text-muted text-xs whitespace-pre-wrap">
            {inquiry.adminNote}
          </p>
        </div>
      )}
    </GlassPanel>
  );
}
