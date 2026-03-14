'use client';

import { Modal } from '@/components/molecules/Modal';
import { IonIcon } from '@/components/atoms/IonIcon';
import {
  RegistrationStatus,
  TournamentPaymentStatus,
  type TournamentRegistration,
} from '@/graphql/generated';

interface RegistrationDetailModalProps {
  registration: TournamentRegistration | null;
  categoryTitle?: string;
  onClose: () => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatDateShort(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount?: number | null) {
  if (amount == null) return null;
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: React.ReactNode;
}) {
  if (value == null || value === '') return null;
  return (
    <div className="flex items-start gap-3 py-2">
      <IonIcon name={icon} className="text-faint mt-0.5 shrink-0" size="sm" />
      <div className="min-w-0 flex-1">
        <p className="text-faint text-xs">{label}</p>
        <p className="text-heading text-sm">{value}</p>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-surface-border border-t pt-4 first:border-0 first:pt-0">
      <h4 className="text-secondary mb-2 text-xs font-semibold tracking-wider uppercase">
        {title}
      </h4>
      {children}
    </div>
  );
}

const REG_STATUS_LABELS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Pending]: 'Chờ duyệt',
  [RegistrationStatus.Approved]: 'Đã duyệt',
  [RegistrationStatus.Rejected]: 'Bị từ chối',
  [RegistrationStatus.Waitlisted]: 'Danh sách chờ',
};

const PAYMENT_LABELS: Record<TournamentPaymentStatus, string> = {
  [TournamentPaymentStatus.Unpaid]: 'Chưa thanh toán',
  [TournamentPaymentStatus.Verifying]: 'Đang xác minh',
  [TournamentPaymentStatus.Paid]: 'Đã thanh toán',
  [TournamentPaymentStatus.Refunded]: 'Đã hoàn tiền',
};

export function RegistrationDetailModal({
  registration: reg,
  categoryTitle,
  onClose,
}: RegistrationDetailModalProps) {
  if (!reg) return null;

  return (
    <Modal
      open={!!reg}
      onClose={onClose}
      title={`Chi tiết đăng ký: ${reg.athleteName}`}
      size="lg"
    >
      <div className="space-y-4">
        <Section title="Thông tin VĐV">
          <DetailRow
            icon="person-outline"
            label="Họ tên"
            value={reg.athleteName}
          />
          <DetailRow
            icon="calendar-outline"
            label="Ngày sinh"
            value={formatDateShort(reg.dateOfBirth)}
          />
          <DetailRow icon="school-outline" label="Trường" value={reg.school} />
          <DetailRow icon="people-outline" label="CLB / Đội" value={reg.club} />
        </Section>

        <Section title="Liên hệ">
          <DetailRow
            icon="call-outline"
            label="Số điện thoại"
            value={reg.phone}
          />
          <DetailRow icon="mail-outline" label="Email" value={reg.email} />
        </Section>

        <Section title="Phụ huynh (nếu có)">
          <DetailRow
            icon="person-outline"
            label="Tên phụ huynh"
            value={reg.guardianName}
          />
          <DetailRow
            icon="call-outline"
            label="SĐT phụ huynh"
            value={reg.guardianPhone}
          />
        </Section>

        <Section title="Nội dung đăng ký">
          <DetailRow
            icon="trophy-outline"
            label="Nội dung thi đấu"
            value={categoryTitle ?? reg.categoryId}
          />
          <DetailRow
            icon="cash-outline"
            label="Phí đăng ký"
            value={formatCurrency(reg.paymentAmount)}
          />
          <DetailRow
            icon="card-outline"
            label="Trạng thái thanh toán"
            value={PAYMENT_LABELS[reg.paymentStatus] ?? reg.paymentStatus}
          />
          <DetailRow
            icon="checkmark-circle-outline"
            label="Trạng thái duyệt"
            value={
              REG_STATUS_LABELS[reg.registrationStatus] ??
              reg.registrationStatus
            }
          />
          {reg.seed && (
            <DetailRow
              icon="star-outline"
              label="Hạt giống"
              value={`#${reg.seed}`}
            />
          )}
        </Section>

        {reg.notes && (
          <Section title="Ghi chú">
            <p className="text-heading text-sm whitespace-pre-wrap">
              {reg.notes}
            </p>
          </Section>
        )}

        {reg.rejectionReason && (
          <Section title="Lý do từ chối">
            <p className="text-sm text-red-400">{reg.rejectionReason}</p>
          </Section>
        )}

        <Section title="Thời gian">
          <DetailRow
            icon="time-outline"
            label="Ngày đăng ký"
            value={formatDate(reg.createdAt)}
          />
          {reg.reviewedAt && (
            <DetailRow
              icon="checkmark-done-outline"
              label="Ngày duyệt"
              value={formatDate(reg.reviewedAt)}
            />
          )}
        </Section>

        {(reg.paymentProofUrl || reg.identityProofUrl) && (
          <Section title="Tài liệu đính kèm">
            {reg.paymentProofUrl && (
              <div className="py-2">
                <p className="text-faint text-xs">Ảnh chứng từ thanh toán</p>
                <a
                  href={reg.paymentProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  Xem ảnh
                </a>
              </div>
            )}
            {reg.identityProofUrl && (
              <div className="py-2">
                <p className="text-faint text-xs">Ảnh giấy tờ tùy thân</p>
                <a
                  href={reg.identityProofUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary text-sm hover:underline"
                >
                  Xem ảnh
                </a>
              </div>
            )}
          </Section>
        )}
      </div>
    </Modal>
  );
}
