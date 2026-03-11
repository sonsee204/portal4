'use client';

import { use, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { TOURNAMENT } from '@/lib/strings';
import {
  useRegistrations,
  useApproveRegistration,
  useRejectRegistration,
  useBulkRegistrationActions,
  useUpdatePaymentStatus,
} from '@/hooks/tournament';
import { useTournamentCategories } from '@/hooks/tournament';
import { ExportButton } from './_components/ExportButton';
import { ImportModal } from './_components/ImportModal';
import type {
  RegistrationStatus,
  TournamentPaymentStatus,
  TournamentRegistration,
} from '@/graphql/generated';

const STATUS_FILTERS: { label: string; value: RegistrationStatus | 'ALL' }[] = [
  { label: 'Tất cả', value: 'ALL' },
  {
    label: TOURNAMENT.REG_STATUS_PENDING,
    value: 'PENDING' as RegistrationStatus,
  },
  {
    label: TOURNAMENT.REG_STATUS_APPROVED,
    value: 'APPROVED' as RegistrationStatus,
  },
  {
    label: TOURNAMENT.REG_STATUS_REJECTED,
    value: 'REJECTED' as RegistrationStatus,
  },
];

const REG_STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-500/20 text-yellow-400',
  APPROVED: 'bg-green-500/20 text-green-400',
  REJECTED: 'bg-red-500/20 text-red-400',
  WAITLISTED: 'bg-blue-500/20 text-blue-400',
};

const PAYMENT_COLORS: Record<string, string> = {
  UNPAID: 'bg-gray-500/20 text-gray-400',
  VERIFYING: 'bg-yellow-500/20 text-yellow-400',
  PAID: 'bg-green-500/20 text-green-400',
  REFUNDED: 'bg-blue-500/20 text-blue-400',
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function RegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<RegistrationStatus | 'ALL'>(
    'ALL'
  );
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [importOpen, setImportOpen] = useState(false);

  const { categories } = useTournamentCategories(tournamentId);

  const { registrations, total, loading, refetch } = useRegistrations({
    tournamentId,
    filter:
      statusFilter === 'ALL'
        ? undefined
        : { registrationStatus: statusFilter as RegistrationStatus },
    pagination: { page: 1, limit: 50 },
  });

  const onSuccess = useCallback(() => {
    setSelectedIds(new Set());
    void refetch();
  }, [refetch]);

  const { approve, loading: approving } = useApproveRegistration(tournamentId, {
    onSuccess,
  });
  const { reject, loading: rejecting } = useRejectRegistration(tournamentId, {
    onSuccess,
  });
  const {
    bulkApprove,
    bulkReject,
    loading: bulkLoading,
  } = useBulkRegistrationActions(tournamentId, { onSuccess });
  const { updatePayment, loading: paymentUpdating } = useUpdatePaymentStatus(
    tournamentId,
    { onSuccess }
  );

  const isActionLoading =
    approving || rejecting || bulkLoading || paymentUpdating;

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === registrations.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(registrations.map((r) => r._id)));
    }
  };

  const handleReject = (reg: TournamentRegistration) => {
    const reason = window.prompt('Lý do từ chối (tùy chọn):');
    void reject(reg._id, reason ?? undefined);
  };

  const handlePaymentUpdate = (
    regId: string,
    status: TournamentPaymentStatus
  ) => {
    void updatePayment(regId, status);
  };

  const pendingCount = registrations.filter(
    (r) => r.registrationStatus === 'PENDING'
  ).length;
  const approvedCount = registrations.filter(
    (r) => r.registrationStatus === 'APPROVED'
  ).length;

  return (
    <>
      <PageHeader
        title="Quản lý đăng ký"
        description={`${total} đăng ký • ${pendingCount} chờ duyệt • ${approvedCount} đã duyệt`}
      >
        <ExportButton tournamentId={tournamentId} />
        <Button
          variant="outline"
          size="sm"
          iconLeft="cloud-upload-outline"
          onClick={() => setImportOpen(true)}
        >
          Import VĐV
        </Button>
        <Button
          variant="ghost"
          size="sm"
          iconLeft="arrow-back-outline"
          onClick={() => router.push('/tournaments')}
        >
          Quay lại
        </Button>
      </PageHeader>

      <ImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        tournamentId={tournamentId}
        categories={categories}
        onSuccess={onSuccess}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setStatusFilter(f.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                statusFilter === f.value
                  ? 'bg-primary text-white'
                  : 'bg-surface-elevated text-secondary hover:text-primary'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {selectedIds.size > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-secondary text-sm">
              {selectedIds.size} đã chọn
            </span>
            <Button
              size="sm"
              variant="outline"
              disabled={isActionLoading}
              onClick={() => void bulkApprove([...selectedIds])}
            >
              Duyệt tất cả
            </Button>
            <Button
              size="sm"
              variant="ghost"
              disabled={isActionLoading}
              onClick={() => void bulkReject([...selectedIds])}
              className="text-red-400"
            >
              Từ chối tất cả
            </Button>
          </div>
        )}
      </div>

      <div className="mt-4">
        {loading && registrations.length === 0 ? (
          <GlassPanel card>
            <div className="flex items-center justify-center py-12">
              <div className="border-primary h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
            </div>
          </GlassPanel>
        ) : registrations.length === 0 ? (
          <GlassPanel card>
            <div className="py-12 text-center">
              <p className="text-secondary">{TOURNAMENT.EMPTY_REGISTRATIONS}</p>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel card className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-surface-border border-b">
                  <th className="p-3 text-left">
                    <input
                      type="checkbox"
                      checked={
                        selectedIds.size === registrations.length &&
                        registrations.length > 0
                      }
                      onChange={toggleSelectAll}
                      className="accent-primary"
                    />
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Vận động viên
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Trạng thái
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Thanh toán
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Ngày đăng ký
                  </th>
                  <th className="text-secondary p-3 text-right font-medium">
                    Thao tác
                  </th>
                </tr>
              </thead>
              <tbody>
                {registrations.map((reg) => (
                  <tr
                    key={reg._id}
                    className="border-surface-border border-b last:border-0 hover:bg-white/5"
                  >
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={selectedIds.has(reg._id)}
                        onChange={() => toggleSelect(reg._id)}
                        className="accent-primary"
                      />
                    </td>
                    <td className="p-3">
                      <div className="text-heading font-medium">
                        {reg.athleteName}
                      </div>
                      {reg.school && (
                        <div className="text-secondary text-xs">
                          {reg.school}
                        </div>
                      )}
                      {reg.club && (
                        <div className="text-secondary text-xs">{reg.club}</div>
                      )}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${REG_STATUS_COLORS[reg.registrationStatus] ?? ''}`}
                      >
                        {(TOURNAMENT[
                          `REG_STATUS_${reg.registrationStatus}` as keyof typeof TOURNAMENT
                        ] as string | undefined) ?? reg.registrationStatus}
                      </span>
                    </td>
                    <td className="p-3">
                      <select
                        value={reg.paymentStatus}
                        onChange={(e) =>
                          handlePaymentUpdate(
                            reg._id,
                            e.target.value as TournamentPaymentStatus
                          )
                        }
                        disabled={isActionLoading}
                        className={`rounded-full border-0 px-2 py-0.5 text-xs font-medium ${PAYMENT_COLORS[reg.paymentStatus] ?? ''}`}
                      >
                        <option value="UNPAID">
                          {TOURNAMENT.PAYMENT_UNPAID}
                        </option>
                        <option value="VERIFYING">
                          {TOURNAMENT.PAYMENT_VERIFYING}
                        </option>
                        <option value="PAID">{TOURNAMENT.PAYMENT_PAID}</option>
                        <option value="REFUNDED">
                          {TOURNAMENT.PAYMENT_REFUNDED}
                        </option>
                      </select>
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {formatDate(reg.createdAt)}
                    </td>
                    <td className="p-3 text-right">
                      {reg.registrationStatus === 'PENDING' && (
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={isActionLoading}
                            onClick={() => void approve(reg._id)}
                          >
                            Duyệt
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            disabled={isActionLoading}
                            onClick={() => handleReject(reg)}
                            className="text-red-400"
                          >
                            Từ chối
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </GlassPanel>
        )}
      </div>
    </>
  );
}
