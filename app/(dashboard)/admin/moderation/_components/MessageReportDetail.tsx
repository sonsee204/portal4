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

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatDateTime } from '@/lib/utils';
import {
  MESSAGE_REPORT_STATUS_LABELS,
  type MessageModerationReport,
  type MessageReportStatus,
} from '../types';

interface MessageReportDetailProps {
  report: MessageModerationReport;
  onUpdateStatus: (
    reportId: string,
    status: MessageReportStatus,
    notes?: string
  ) => Promise<void>;
  onDeleteMessage: (messageId: string) => Promise<void>;
  loading?: boolean;
}

export function MessageReportDetail({
  report,
  onUpdateStatus,
  onDeleteMessage,
  loading,
}: MessageReportDetailProps) {
  const isActionable =
    report.status === 'PENDING' || report.status === 'REVIEWED';

  const handleDismiss = () => {
    void onUpdateStatus(report._id, 'DISMISSED');
  };

  const handleReview = () => {
    void onUpdateStatus(report._id, 'REVIEWED', 'Đang xem xét');
  };

  const handleResolve = () => {
    void onUpdateStatus(report._id, 'RESOLVED', 'Đã xử lý vi phạm');
  };

  const handleDelete = async () => {
    if (!report.messageId) return;
    const confirmed = window.confirm(
      'Bạn có chắc chắn muốn xóa tin nhắn này? Hành động này không thể hoàn tác.'
    );
    if (!confirmed) return;
    try {
      await onDeleteMessage(report.messageId);
      await onUpdateStatus(report._id, 'RESOLVED', 'Tin nhắn đã bị xóa');
    } catch {
      // Errors handled by mutation toast
    }
  };

  return (
    <div className="space-y-6">
      {/* Message info card */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          <div className="bg-surface-hover flex h-10 w-10 items-center justify-center rounded-full">
            <IonIcon
              name="chatbubble-ellipses-outline"
              className="text-primary text-lg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-heading text-sm font-semibold">
              Báo cáo tin nhắn
            </p>
            <p className="text-faint font-mono text-xs">
              Message ID: {report.messageId}
            </p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="text-faint flex items-center gap-1">
            <IonIcon name="flag-outline" size="xs" className="text-red-400" />
            Reporter ID: {report.reporterId}
          </span>
        </div>

        <p className="text-body bg-surface-hover mt-3 rounded-lg p-3 text-sm leading-relaxed">
          Lý do: &ldquo;{report.reason}&rdquo;
        </p>
      </GlassPanel>

      {/* Report info */}
      <GlassPanel card>
        <h4 className="text-heading mb-3 text-sm font-bold">
          Thông tin báo cáo
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-faint">Trạng thái</span>
            <Badge
              variant={
                report.status === 'PENDING'
                  ? 'warning'
                  : report.status === 'RESOLVED'
                    ? 'success'
                    : 'neutral'
              }
            >
              {MESSAGE_REPORT_STATUS_LABELS[report.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID báo cáo</span>
            <span className="text-faint font-mono text-xs">{report._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID tin nhắn</span>
            <span className="text-faint font-mono text-xs">
              {report.messageId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID người báo cáo</span>
            <span className="text-faint font-mono text-xs">
              {report.reporterId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">Ngày báo cáo</span>
            <span className="text-body">
              {formatDateTime(report.createdAt)}
            </span>
          </div>
          {report.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-faint">Ngày xem xét</span>
              <span className="text-body">
                {formatDateTime(report.reviewedAt)}
              </span>
            </div>
          )}
          {report.notes && (
            <div className="flex flex-col gap-1">
              <span className="text-faint">Ghi chú</span>
              <span className="text-body bg-surface-hover rounded-lg p-2 text-xs">
                {report.notes}
              </span>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Action bar */}
      {isActionable && (
        <div className="border-surface-border bg-surface/95 sticky bottom-0 flex items-center gap-3 rounded-xl border p-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            iconLeft="play-skip-forward-outline"
            className="flex-1"
            onClick={handleDismiss}
            disabled={loading}
          >
            Bỏ qua
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="eye-outline"
            className="flex-1 text-amber-400 hover:bg-amber-500/10"
            onClick={handleReview}
            disabled={loading}
          >
            Xem xét
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="checkmark-circle-outline"
            className="flex-1 text-emerald-400 hover:bg-emerald-500/10"
            onClick={handleResolve}
            disabled={loading}
          >
            Giải quyết
          </Button>
          <Button
            size="sm"
            iconLeft="trash-outline"
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={handleDelete}
            disabled={loading}
          >
            Xóa tin nhắn
          </Button>
        </div>
      )}
    </div>
  );
}
