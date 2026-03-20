'use client';

import { useState, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Button } from '@/components/atoms/Button';
import { TOURNAMENT } from '@/lib/strings';
import { useExportRegistrations } from '@/hooks/tournament';
import {
  RegistrationStatus,
  TournamentPaymentStatus,
  MatchType,
  TournamentFormat,
  TournamentGender,
  type RegistrationFilterInput,
  type ExportTournamentRegistrationsQuery,
} from '@/graphql/generated';

interface ExportButtonProps {
  tournamentId: string;
  tournamentName?: string;
  filter?: RegistrationFilterInput;
}

type RegistrationExportRow =
  ExportTournamentRegistrationsQuery['exportTournamentRegistrations'][number];

const REGISTRATION_STATUS_LABELS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Pending]: 'Chờ duyệt',
  [RegistrationStatus.Approved]: 'Đã duyệt',
  [RegistrationStatus.Rejected]: 'Bị từ chối',
  [RegistrationStatus.Waitlisted]: 'Danh sách chờ',
};

const PAYMENT_STATUS_LABELS: Record<TournamentPaymentStatus, string> = {
  [TournamentPaymentStatus.Unpaid]: 'Chưa thanh toán',
  [TournamentPaymentStatus.Verifying]: 'Đang xác minh',
  [TournamentPaymentStatus.Paid]: 'Đã thanh toán',
  [TournamentPaymentStatus.Refunded]: 'Đã hoàn tiền',
};

const MATCH_TYPE_LABELS: Record<MatchType, string> = {
  [MatchType.Singles]: 'Đơn',
  [MatchType.Doubles]: 'Đôi',
  [MatchType.Team]: 'Đội',
};

const FORMAT_LABELS: Record<TournamentFormat, string> = {
  [TournamentFormat.SingleElimination]: 'Loại trực tiếp',
  [TournamentFormat.DoubleElimination]: 'Loại kép',
  [TournamentFormat.RoundRobin]: 'Vòng tròn',
  [TournamentFormat.GroupKnockout]: 'Bảng + Loại trực tiếp',
};

const GENDER_LABELS: Record<TournamentGender, string> = {
  [TournamentGender.Male]: 'Nam',
  [TournamentGender.Female]: 'Nữ',
  [TournamentGender.Mixed]: 'Hỗn hợp',
  [TournamentGender.Open]: 'Không giới hạn',
};

function formatDateVN(dateStr?: string | null): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

function toExcelRows(registrations: RegistrationExportRow[]) {
  return registrations.map((r, i) => {
    const partner = r.members && r.members.length > 1 ? r.members[1] : null;
    const cat = r.category;
    return {
      STT: i + 1,
      'Nội dung': cat?.title ?? '',
      'Nhóm tuổi': cat?.ageLabel ?? '',
      'Giới tính (nội dung)': cat?.gender
        ? (GENDER_LABELS[cat.gender] ?? cat.gender)
        : '',
      'Thể thức': cat?.matchType
        ? (MATCH_TYPE_LABELS[cat.matchType] ?? cat.matchType)
        : '',
      'Thể loại giải': cat?.format
        ? (FORMAT_LABELS[cat.format] ?? cat.format)
        : '',
      'Hạt giống': r.seed ?? '',
      'Số báo danh': r.bibNumber ?? '',
      'Tên VĐV': r.athleteName,
      SĐT: r.phone ?? '',
      Email: r.email ?? '',
      'Ngày sinh': r.dateOfBirth ? formatDateVN(r.dateOfBirth) : '',
      'CLB / Đội': r.club ?? '',
      Trường: r.school ?? '',
      'Tên đồng đội': partner?.name ?? '',
      'SĐT đồng đội': partner?.phone ?? '',
      'Tên phụ huynh': r.guardianName ?? '',
      'SĐT phụ huynh': r.guardianPhone ?? '',
      'Trạng thái':
        REGISTRATION_STATUS_LABELS[r.registrationStatus] ??
        r.registrationStatus,
      'Thanh toán': PAYMENT_STATUS_LABELS[r.paymentStatus] ?? r.paymentStatus,
      'Phí đăng ký': r.paymentAmount ?? 0,
      'Ghi chú': r.notes ?? '',
      'Lý do từ chối': r.rejectionReason ?? '',
      'Ngày đăng ký': formatDateVN(r.createdAt),
    };
  });
}

export function ExportButton({
  tournamentId,
  tournamentName = 'giai-dau',
  filter,
}: ExportButtonProps) {
  const [exporting, setExporting] = useState(false);
  const { fetchForExport } = useExportRegistrations(tournamentId);

  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const result = await fetchForExport(filter);
      const registrations = result?.data?.exportTournamentRegistrations ?? [];

      const rows = toExcelRows(registrations);
      const ws = XLSX.utils.json_to_sheet(rows);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Danh sách đăng ký');

      // Auto-column width
      const colWidths = Object.keys(rows[0] ?? {}).map((key) => ({
        wch: Math.max(
          key.length,
          ...rows.map(
            (r) => String((r as Record<string, unknown>)[key] ?? '').length,
          ),
        ),
      }));
      ws['!cols'] = colWidths;

      const slug = tournamentName
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '');
      const date = new Date().toISOString().split('T')[0];
      const filename = TOURNAMENT.EXPORT_FILENAME(slug, date!);
      XLSX.writeFile(wb, filename);
    } finally {
      setExporting(false);
    }
  }, [fetchForExport, filter, tournamentName]);

  return (
    <Button
      variant="outline"
      size="sm"
      iconLeft="download-outline"
      disabled={exporting}
      onClick={() => void handleExport()}
    >
      {exporting ? 'Đang xuất...' : TOURNAMENT.EXPORT_BUTTON}
    </Button>
  );
}
