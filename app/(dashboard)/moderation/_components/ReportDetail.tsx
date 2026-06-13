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

import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatDateTime } from '@/lib/utils';
import { PostReportStatus } from '@/graphql/generated';
import { POST_REPORT_REASON_LABELS, POST_REPORT_STATUS_LABELS } from '../types';
import type { ModerationReport } from '../types';

interface ReportDetailProps {
  report: ModerationReport;
  onUpdateStatus: (
    reportId: string,
    status: PostReportStatus,
    notes?: string
  ) => Promise<void>;
  onDeletePost: (postId: string) => Promise<void>;
  onSuspendUser: (userId: string, reason?: string) => Promise<void>;
  loading?: boolean;
}

export function ReportDetail({
  report,
  onUpdateStatus,
  onDeletePost,
  onSuspendUser,
  loading,
}: ReportDetailProps) {
  const authorName =
    report.post?.author?.displayName ||
    report.post?.author?.userName ||
    'Unknown';
  const authorInitial = authorName[0]?.toUpperCase() ?? 'U';
  const content = report.post?.content || report.description || '';
  const reporterName =
    report.reporter?.displayName || report.reporter?.userName || 'Ẩn danh';
  const isActionable =
    report.status === PostReportStatus.Pending ||
    report.status === PostReportStatus.Reviewed;

  const handleDismiss = () => {
    void onUpdateStatus(report._id, PostReportStatus.Dismissed);
  };

  const handleKeep = () => {
    void onUpdateStatus(
      report._id,
      PostReportStatus.Dismissed,
      'Nội dung hợp lệ'
    );
  };

  const handleDeletePost = () => {
    const postId = report.post?._id;
    if (!postId) return;
    void onDeletePost(postId);
  };

  const handleSuspend = async () => {
    const authorId = report.post?.author?._id;
    if (!authorId) return;
    const confirmed = window.confirm(
      `Khóa tài khoản @${authorName}? Hành động này sẽ đình chỉ tài khoản.`
    );
    if (!confirmed) return;
    try {
      await onSuspendUser(
        authorId,
        `Vi phạm: ${POST_REPORT_REASON_LABELS[report.reason]}`
      );
      await onUpdateStatus(
        report._id,
        PostReportStatus.Resolved,
        'Tài khoản đã bị khóa'
      );
    } catch {
      // Errors are handled by mutation options (toast), no need to rethrow
    }
  };

  return (
    <div className="space-y-6">
      {/* Post card */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          <Avatar
            fallback={authorInitial}
            src={report.post?.author?.photoURL ?? undefined}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-heading text-sm font-medium">@{authorName}</p>
              {report.post?.author?._id && (
                <Link
                  href={`/users/${report.post.author._id}`}
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs transition-colors"
                >
                  <IonIcon name="open-outline" size="xs" />
                  Xem hồ sơ
                </Link>
              )}
            </div>
            <p className="text-faint text-xs">
              {formatDateTime(report.createdAt)}
            </p>
          </div>
        </div>
        <p className="text-body mt-3 text-sm leading-relaxed">{content}</p>
        <div className="text-faint mt-3 flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            <IonIcon name="flag-outline" size="xs" className="text-red-400" />
            Báo cáo bởi @{reporterName}
          </span>
          <Badge variant="danger" className="text-[10px]">
            {POST_REPORT_REASON_LABELS[report.reason]}
          </Badge>
        </div>
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
                report.status === PostReportStatus.Pending
                  ? 'warning'
                  : report.status === PostReportStatus.Resolved
                    ? 'success'
                    : 'neutral'
              }
            >
              {POST_REPORT_STATUS_LABELS[report.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">Lý do</span>
            <span className="text-body">
              {POST_REPORT_REASON_LABELS[report.reason]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID báo cáo</span>
            <span className="text-faint font-mono text-xs">{report._id}</span>
          </div>
          {report.post?._id && (
            <div className="flex justify-between">
              <span className="text-faint">ID bài viết</span>
              <span className="text-faint font-mono text-xs">
                {report.post._id}
              </span>
            </div>
          )}
          {report.post?.author?._id && (
            <div className="flex justify-between">
              <span className="text-faint">ID tác giả</span>
              <span className="text-faint font-mono text-xs">
                {report.post.author._id}
              </span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-faint">Người báo cáo</span>
            <span className="text-body">@{reporterName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID người báo cáo</span>
            <span className="text-faint font-mono text-xs">
              {report.reporterId}
            </span>
          </div>
          {report.description && (
            <div className="flex justify-between">
              <span className="text-faint">Mô tả</span>
              <span className="text-body">{report.description}</span>
            </div>
          )}
          {report.reviewer && (
            <div className="flex justify-between">
              <span className="text-faint">Người xem xét</span>
              <span className="text-body">
                {report.reviewer.displayName ?? '—'}
              </span>
            </div>
          )}
          {report.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-faint">Ngày xem xét</span>
              <span className="text-body">
                {formatDateTime(report.reviewedAt)}
              </span>
            </div>
          )}
          {report.notes && (
            <div className="flex justify-between">
              <span className="text-faint">Ghi chú</span>
              <span className="text-body">{report.notes}</span>
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
            iconLeft="checkmark-outline"
            className="flex-1 text-emerald-400 hover:bg-emerald-500/10"
            onClick={handleKeep}
            disabled={loading}
          >
            Giữ lại
          </Button>
          <Button
            variant="ghost"
            size="sm"
            iconLeft="trash-outline"
            className="flex-1 text-red-400 hover:bg-red-500/10"
            onClick={handleDeletePost}
            disabled={loading}
          >
            Xoá
          </Button>
          <Button
            size="sm"
            iconLeft="lock-closed-outline"
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={handleSuspend}
            disabled={loading || !report.post?.author?._id}
          >
            Khoá TK
          </Button>
        </div>
      )}
    </div>
  );
}
