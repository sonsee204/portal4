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
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatDateTime } from '@/lib/utils';
import { CLAIM_REQUEST_STATUS_LABELS, type ClaimRequestItem } from '../types';

interface ClaimRequestDetailProps {
  request: ClaimRequestItem;
  onReview: (
    claimRequestId: string,
    approved: boolean,
    rejectionReason?: string,
    adminNotes?: string
  ) => Promise<void>;
  loading?: boolean;
}

export function ClaimRequestDetail({
  request,
  onReview,
  loading,
}: ClaimRequestDetailProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const userName =
    request.user?.displayName || request.user?.userName || 'Unknown';
  const isActionable = request.status === 'PENDING';

  const handleApprove = () => {
    void onReview(request._id, true);
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) return;
    void onReview(request._id, false, rejectReason.trim());
    setShowRejectInput(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Venue info */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          <div className="bg-surface-hover flex h-10 w-10 items-center justify-center rounded-full">
            <IonIcon
              name="hand-left-outline"
              className="text-primary text-lg"
            />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-heading text-sm font-semibold">
              {request.venueName}
            </p>
            {request.venueAddress && (
              <p className="text-faint text-xs">{request.venueAddress}</p>
            )}
          </div>
        </div>

        <div className="mt-3 flex items-center gap-4 text-xs">
          <span className="text-faint flex items-center gap-1">
            <IonIcon name="person-outline" size="xs" className="text-primary" />
            Người yêu cầu: @{userName}
          </span>
        </div>

        {request.notes && (
          <p className="text-body bg-surface-hover mt-3 rounded-lg p-3 text-sm leading-relaxed">
            &ldquo;{request.notes}&rdquo;
          </p>
        )}
      </GlassPanel>

      {/* Proof documents */}
      {request.proofDocuments && request.proofDocuments.length > 0 && (
        <GlassPanel card>
          <h4 className="text-heading mb-3 text-sm font-bold">
            Tài liệu chứng minh ({request.proofDocuments.length})
          </h4>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {request.proofDocuments.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface-hover hover:bg-surface-border relative block h-24 overflow-hidden rounded-lg transition-colors"
              >
                <Image
                  src={url}
                  alt={`Proof ${i + 1}`}
                  fill
                  sizes="(max-width: 640px) 50vw, 33vw"
                  className="object-cover"
                  unoptimized
                />
              </a>
            ))}
          </div>
        </GlassPanel>
      )}

      {/* Request info */}
      <GlassPanel card>
        <h4 className="text-heading mb-3 text-sm font-bold">
          Thông tin yêu cầu
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-faint">Trạng thái</span>
            <Badge
              variant={
                request.status === 'PENDING'
                  ? 'warning'
                  : request.status === 'APPROVED'
                    ? 'success'
                    : request.status === 'REJECTED'
                      ? 'danger'
                      : 'neutral'
              }
            >
              {CLAIM_REQUEST_STATUS_LABELS[request.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID yêu cầu</span>
            <span className="text-faint font-mono text-xs">{request._id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID sân</span>
            <span className="text-faint font-mono text-xs">
              {request.venueId}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">Số điện thoại</span>
            <span className="text-body">{request.phoneNumber}</span>
          </div>
          {request.email && (
            <div className="flex justify-between">
              <span className="text-faint">Email</span>
              <span className="text-body">{request.email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-faint">Người yêu cầu</span>
            <span className="text-body">@{userName}</span>
          </div>
          {request.user?._id && (
            <div className="flex justify-between">
              <span className="text-faint">ID người yêu cầu</span>
              <Link
                href={`/users/${request.user._id}`}
                className="text-primary hover:text-primary/80 text-xs transition-colors"
              >
                {request.user._id}
              </Link>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-faint">Ngày gửi</span>
            <span className="text-body">
              {formatDateTime(request.createdAt)}
            </span>
          </div>
          {request.reviewer && (
            <div className="flex justify-between">
              <span className="text-faint">Người duyệt</span>
              <span className="text-body">
                {request.reviewer.displayName ?? '—'}
              </span>
            </div>
          )}
          {request.reviewedAt && (
            <div className="flex justify-between">
              <span className="text-faint">Ngày duyệt</span>
              <span className="text-body">
                {formatDateTime(request.reviewedAt)}
              </span>
            </div>
          )}
          {request.rejectionReason && (
            <div className="flex flex-col gap-1">
              <span className="text-faint">Lý do từ chối</span>
              <span className="text-body bg-surface-hover rounded-lg p-2 text-xs">
                {request.rejectionReason}
              </span>
            </div>
          )}
          {request.adminNotes && (
            <div className="flex flex-col gap-1">
              <span className="text-faint">Ghi chú admin</span>
              <span className="text-body bg-surface-hover rounded-lg p-2 text-xs">
                {request.adminNotes}
              </span>
            </div>
          )}
        </div>
      </GlassPanel>

      {/* Reject reason input */}
      {showRejectInput && (
        <GlassPanel card>
          <label className="text-heading mb-2 block text-sm font-bold">
            Lý do từ chối
          </label>
          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="bg-surface-hover text-body border-surface-border w-full rounded-lg border p-3 text-sm"
            rows={3}
            placeholder="Nhập lý do từ chối..."
          />
        </GlassPanel>
      )}

      {/* Action bar */}
      {isActionable && (
        <div className="border-surface-border bg-surface/95 sticky bottom-0 flex items-center gap-3 rounded-xl border p-4 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="sm"
            iconLeft="close-circle-outline"
            className="flex-1 text-red-400 hover:bg-red-500/10"
            onClick={handleReject}
            disabled={loading || (showRejectInput && !rejectReason.trim())}
          >
            {showRejectInput ? 'Xác nhận từ chối' : 'Từ chối'}
          </Button>
          <Button
            size="sm"
            iconLeft="checkmark-circle-outline"
            className="flex-1 bg-emerald-500 hover:bg-emerald-600"
            onClick={handleApprove}
            disabled={loading}
          >
            Duyệt
          </Button>
        </div>
      )}
    </div>
  );
}
