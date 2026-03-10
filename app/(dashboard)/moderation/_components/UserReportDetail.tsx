'use client';

import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatDateTime } from '@/lib/utils';
import {
  USER_REPORT_REASON_LABELS,
  USER_REPORT_STATUS_LABELS,
  type UserModerationReport,
  type UserReportStatus,
} from '../types';

interface UserReportDetailProps {
  report: UserModerationReport;
  onUpdateStatus: (
    reportId: string,
    status: UserReportStatus,
    notes?: string
  ) => Promise<void>;
  onSuspendUser: (userId: string, reason?: string) => Promise<void>;
  loading?: boolean;
}

export function UserReportDetail({
  report,
  onUpdateStatus,
  onSuspendUser,
  loading,
}: UserReportDetailProps) {
  const reportedName =
    report.reportedUser?.displayName ||
    report.reportedUser?.userName ||
    'Unknown';
  const reportedInitial = reportedName[0]?.toUpperCase() ?? 'U';
  const reporterName =
    report.reporter?.displayName || report.reporter?.userName || 'Ẩn danh';
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

  const handleSuspend = async () => {
    const userId = report.reportedUser?._id;
    if (!userId) return;
    const confirmed = window.confirm(
      `Khóa tài khoản @${reportedName}? Hành động này sẽ đình chỉ tài khoản.`
    );
    if (!confirmed) return;
    try {
      await onSuspendUser(
        userId,
        `Vi phạm: ${USER_REPORT_REASON_LABELS[report.reason]}`
      );
      await onUpdateStatus(report._id, 'RESOLVED', 'Tài khoản đã bị khóa');
    } catch {
      // Errors are handled by mutation options (toast), no need to rethrow
    }
  };

  return (
    <div className="space-y-6">
      {/* Reported user card */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          <Avatar
            fallback={reportedInitial}
            src={report.reportedUser?.photoURL ?? undefined}
          />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-heading text-sm font-semibold">
                @{reportedName}
              </p>
              {report.reportedUser?._id && (
                <Link
                  href={`/users/${report.reportedUser._id}`}
                  className="text-primary hover:text-primary/80 inline-flex items-center gap-1 text-xs transition-colors"
                >
                  <IonIcon name="open-outline" size="xs" />
                  Xem hồ sơ
                </Link>
              )}
            </div>
            <p className="text-faint text-xs">Người bị báo cáo</p>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="text-faint flex items-center gap-1">
            <IonIcon name="flag-outline" size="xs" className="text-red-400" />
            Báo cáo bởi @{reporterName}
          </span>
          <Badge variant="danger" className="text-[10px]">
            {USER_REPORT_REASON_LABELS[report.reason]}
          </Badge>
        </div>

        {report.description && (
          <p className="text-body bg-surface-hover mt-3 rounded-lg p-3 text-sm leading-relaxed">
            &ldquo;{report.description}&rdquo;
          </p>
        )}
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
              {USER_REPORT_STATUS_LABELS[report.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">Lý do</span>
            <span className="text-body">
              {USER_REPORT_REASON_LABELS[report.reason]}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID báo cáo</span>
            <span className="text-faint font-mono text-xs">{report._id}</span>
          </div>
          {report.reportedUser?._id && (
            <div className="flex justify-between">
              <span className="text-faint">ID người bị báo cáo</span>
              <span className="text-faint font-mono text-xs">
                {report.reportedUser._id}
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
          <div className="flex justify-between">
            <span className="text-faint">Ngày báo cáo</span>
            <span className="text-body">
              {formatDateTime(report.createdAt)}
            </span>
          </div>
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
            iconLeft="lock-closed-outline"
            className="flex-1 bg-red-500 hover:bg-red-600"
            onClick={handleSuspend}
            disabled={loading || !report.reportedUser?._id}
          >
            Khoá TK
          </Button>
        </div>
      )}
    </div>
  );
}
