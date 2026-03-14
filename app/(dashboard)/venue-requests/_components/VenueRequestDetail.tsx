'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Avatar } from '@/components/atoms/Avatar';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { formatDateTime } from '@/lib/utils';
import {
  VENUE_REQUEST_STATUS_LABELS,
  type VenueRequestItem,
  type VenueRequestStatus,
} from '../types';

interface VenueRequestDetailProps {
  request: VenueRequestItem;
  onApprove: (requestId: string, adminNote?: string) => Promise<void>;
  onReject: (requestId: string, reason: string) => Promise<void>;
  loading?: boolean;
}

export function VenueRequestDetail({
  request,
  onApprove,
  onReject,
  loading,
}: VenueRequestDetailProps) {
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);

  const requesterName =
    request.requester?.displayName || request.requester?.userName || 'Unknown';
  const requesterInitial = requesterName[0]?.toUpperCase() ?? 'U';
  const isActionable = request.status === 'PENDING';
  const locationText = [
    request.location.address,
    request.location.ward,
    request.location.district,
    request.location.city,
  ]
    .filter(Boolean)
    .join(', ');

  const handleApprove = () => {
    void onApprove(request._id);
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    if (!rejectReason.trim()) return;
    void onReject(request._id, rejectReason.trim());
    setShowRejectInput(false);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Venue info card */}
      <GlassPanel card>
        <div className="border-surface-border flex items-center gap-3 border-b pb-3">
          {request.coverImageUrl ? (
            <img
              src={request.coverImageUrl}
              alt={request.name}
              className="h-12 w-12 rounded-lg object-cover"
            />
          ) : (
            <div className="bg-surface-hover flex h-12 w-12 items-center justify-center rounded-lg">
              <IonIcon
                name="business-outline"
                className="text-primary text-xl"
              />
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-heading text-sm font-semibold">
              {request.name}
            </p>
            <p className="text-faint text-xs">{locationText}</p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className="text-faint flex items-center gap-1">
            <IonIcon
              name="person-outline"
              size="xs"
              className="text-primary"
            />
            Người đăng ký: @{requesterName}
          </span>
          {request.sportTypes.map((sport) => (
            <Badge key={sport} variant="info" className="text-[10px]">
              {sport}
            </Badge>
          ))}
        </div>

        {request.description && (
          <p className="text-body bg-surface-hover mt-3 rounded-lg p-3 text-sm leading-relaxed">
            {request.description}
          </p>
        )}
      </GlassPanel>

      {/* Courts */}
      {request.courts.length > 0 && (
        <GlassPanel card>
          <h4 className="text-heading mb-3 text-sm font-bold">
            Sân ({request.courts.length})
          </h4>
          <div className="space-y-2">
            {request.courts.map((court, i) => (
              <div
                key={i}
                className="bg-surface-hover flex items-center justify-between rounded-lg p-2 text-sm"
              >
                <div>
                  <span className="text-body font-medium">{court.name}</span>
                  <span className="text-faint ml-2 text-xs">
                    {court.sportType}
                    {court.isIndoor ? ' · Trong nhà' : ' · Ngoài trời'}
                  </span>
                </div>
                <span className="text-body text-xs">
                  {court.pricePerHour.toLocaleString()}đ/h
                </span>
              </div>
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
              {VENUE_REQUEST_STATUS_LABELS[request.status]}
            </Badge>
          </div>
          <div className="flex justify-between">
            <span className="text-faint">ID yêu cầu</span>
            <span className="text-faint font-mono text-xs">
              {request._id}
            </span>
          </div>
          {request.phoneNumber && (
            <div className="flex justify-between">
              <span className="text-faint">Số điện thoại</span>
              <span className="text-body">{request.phoneNumber}</span>
            </div>
          )}
          {request.email && (
            <div className="flex justify-between">
              <span className="text-faint">Email</span>
              <span className="text-body">{request.email}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-faint">Người đăng ký</span>
            <span className="text-body">@{requesterName}</span>
          </div>
          {request.requester?._id && (
            <div className="flex justify-between">
              <span className="text-faint">ID người đăng ký</span>
              <Link
                href={`/users/${request.requester._id}`}
                className="text-primary hover:text-primary/80 text-xs transition-colors"
              >
                {request.requester._id}
              </Link>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-faint">Ngày gửi</span>
            <span className="text-body">
              {formatDateTime(request.createdAt)}
            </span>
          </div>
          {request.reviewedByAdmin && (
            <div className="flex justify-between">
              <span className="text-faint">Người duyệt</span>
              <span className="text-body">
                {request.reviewedByAdmin.displayName ?? '—'}
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
          {request.adminNote && (
            <div className="flex flex-col gap-1">
              <span className="text-faint">Ghi chú admin</span>
              <span className="text-body bg-surface-hover rounded-lg p-2 text-xs">
                {request.adminNote}
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
