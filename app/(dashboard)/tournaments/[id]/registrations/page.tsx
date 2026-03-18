'use client';

import { use, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/organisms/PageHeader';
import { Button } from '@/components/atoms/Button';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Pagination } from '@/components/organisms/Pagination';
import { TOURNAMENT } from '@/lib/strings';
import {
  useRegistrations,
  useApproveRegistration,
  useRejectRegistration,
  useDeleteRegistration,
  useBulkRegistrationActions,
  useUpdatePaymentStatus,
  useUpdateBibNumber,
} from '@/hooks/tournament';
import { useTournament, useTournamentCategories } from '@/hooks/tournament';
import { IonIcon } from '@/components/atoms/IonIcon';
import { ExportButton } from './_components/ExportButton';
import { ImportModal } from './_components/ImportModal';
import { RegistrationDetailModal } from './_components/RegistrationDetailModal';
import { RejectModal } from './_components/RejectModal';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';

const PAGE_SIZE = 20;
import {
  RegistrationStatus,
  TournamentPaymentStatus,
  TournamentStatus,
  CategoryStatus,
  type TournamentRegistration,
} from '@/graphql/generated';

const ALL_STATUS = 'ALL' as const;
type StatusFilterValue = RegistrationStatus | typeof ALL_STATUS;

const STATUS_FILTERS: { label: string; value: StatusFilterValue }[] = [
  { label: 'Tất cả', value: ALL_STATUS },
  {
    label: TOURNAMENT.REG_STATUS_PENDING,
    value: RegistrationStatus.Pending,
  },
  {
    label: TOURNAMENT.REG_STATUS_APPROVED,
    value: RegistrationStatus.Approved,
  },
  {
    label: TOURNAMENT.REG_STATUS_REJECTED,
    value: RegistrationStatus.Rejected,
  },
];

const REG_STATUS_COLORS: Record<RegistrationStatus, string> = {
  [RegistrationStatus.Pending]: 'bg-yellow-500/20 text-yellow-400',
  [RegistrationStatus.Approved]: 'bg-green-500/20 text-green-400',
  [RegistrationStatus.Rejected]: 'bg-red-500/20 text-red-400',
  [RegistrationStatus.Waitlisted]: 'bg-blue-500/20 text-blue-400',
};

const PAYMENT_COLORS: Record<TournamentPaymentStatus, string> = {
  [TournamentPaymentStatus.Unpaid]: 'bg-gray-500/20 text-gray-400',
  [TournamentPaymentStatus.Verifying]: 'bg-yellow-500/20 text-yellow-400',
  [TournamentPaymentStatus.Paid]: 'bg-green-500/20 text-green-400',
  [TournamentPaymentStatus.Refunded]: 'bg-blue-500/20 text-blue-400',
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

function formatDateShort(dateStr?: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function formatCurrency(amount?: number | null) {
  if (amount == null) return '—';
  return new Intl.NumberFormat('vi-VN').format(amount) + ' ₫';
}

export default function RegistrationsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: tournamentId } = use(params);
  const router = useRouter();
  const [statusFilter, setStatusFilter] =
    useState<StatusFilterValue>(ALL_STATUS);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleStatusFilterChange = useCallback((value: StatusFilterValue) => {
    setStatusFilter(value);
    setPage(1);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
    setSelectedIds(new Set());
  }, []);
  const [importOpen, setImportOpen] = useState(false);
  const [detailReg, setDetailReg] = useState<TournamentRegistration | null>(
    null
  );
  const [rejectingReg, setRejectingReg] =
    useState<TournamentRegistration | null>(null);
  const [deletingReg, setDeletingReg] = useState<TournamentRegistration | null>(
    null
  );

  const { tournament } = useTournament(tournamentId);
  const { categories } = useTournamentCategories(tournamentId);
  const canImport = useMemo(() => {
    if (!tournament) return false;
    if (tournament.status !== TournamentStatus.RegistrationOpen) return false;
    const drawnStatuses = [
      CategoryStatus.DrawCompleted,
      CategoryStatus.InProgress,
      CategoryStatus.Completed,
    ];
    return !categories.some((c) => drawnStatuses.includes(c.status));
  }, [tournament, categories]);
  const categoryMap = useMemo(
    () => new Map(categories?.map((c) => [c._id, c.title]) ?? []),
    [categories]
  );
  const categoryMatchTypeMap = useMemo(
    () => new Map(categories?.map((c) => [c._id, c.matchType]) ?? []),
    [categories]
  );

  const {
    registrations,
    total,
    page: currentPage,
    totalPages,
    loading,
    refetch,
  } = useRegistrations({
    tournamentId,
    filter:
      statusFilter === ALL_STATUS
        ? undefined
        : { registrationStatus: statusFilter },
    pagination: { page, limit: PAGE_SIZE },
  });

  const onSuccess = useCallback(() => {
    setSelectedIds(new Set());
    void refetch();
  }, [refetch]);

  const { approve, loading: approving } = useApproveRegistration(tournamentId, {
    onSuccess,
  });
  const { reject, loading: rejecting } = useRejectRegistration(tournamentId, {
    onSuccess: () => {
      setRejectingReg(null);
      onSuccess();
    },
  });
  const { deleteRegistration, loading: deleting } = useDeleteRegistration(
    tournamentId,
    {
      onSuccess: () => {
        setDeletingReg(null);
        onSuccess();
      },
    }
  );
  const {
    bulkApprove,
    bulkReject,
    loading: bulkLoading,
  } = useBulkRegistrationActions(tournamentId, { onSuccess });
  const { updatePayment, loading: paymentUpdating } = useUpdatePaymentStatus(
    tournamentId,
    { onSuccess }
  );
  const { updateBibNumber, loading: bibUpdating } =
    useUpdateBibNumber(tournamentId);

  const [editingBibId, setEditingBibId] = useState<string | null>(null);
  const [bibInputValue, setBibInputValue] = useState<string>('');

  const handleBibEdit = (reg: TournamentRegistration) => {
    setEditingBibId(reg._id);
    setBibInputValue(reg.bibNumber != null ? String(reg.bibNumber) : '');
  };

  const handleBibSave = async (registrationId: string) => {
    const val = bibInputValue.trim();
    const num = val === '' ? undefined : parseInt(val, 10);
    if (val !== '' && (isNaN(num!) || num! < 1)) return;
    await updateBibNumber(registrationId, num);
    setEditingBibId(null);
  };

  const handleBibCancel = () => {
    setEditingBibId(null);
    setBibInputValue('');
  };

  const isActionLoading =
    approving ||
    rejecting ||
    deleting ||
    bulkLoading ||
    paymentUpdating ||
    bibUpdating;

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
    setRejectingReg(reg);
  };

  const handleRejectConfirm = (reason?: string) => {
    if (rejectingReg) {
      void reject(rejectingReg._id, reason);
    }
  };

  const handleDelete = (reg: TournamentRegistration) => {
    setDeletingReg(reg);
  };

  const handleDeleteConfirm = () => {
    if (deletingReg) {
      void deleteRegistration(deletingReg._id);
    }
  };

  const handlePaymentUpdate = (
    regId: string,
    status: TournamentPaymentStatus
  ) => {
    void updatePayment(regId, status);
  };

  return (
    <>
      <PageHeader
        title="Quản lý đăng ký"
        description={`${total} đăng ký${totalPages > 1 ? ` • Trang ${currentPage}/${totalPages}` : ''}`}
      >
        <ExportButton tournamentId={tournamentId} />
        <Button
          variant="outline"
          size="sm"
          iconLeft="cloud-upload-outline"
          disabled={!canImport}
          title={!canImport ? TOURNAMENT.IMPORT_DISABLED_REASON : undefined}
          onClick={() => canImport && setImportOpen(true)}
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

      <RegistrationDetailModal
        registration={detailReg}
        categoryTitle={
          detailReg ? categoryMap.get(detailReg.categoryId) : undefined
        }
        categoryMatchType={
          detailReg ? categoryMatchTypeMap.get(detailReg.categoryId) : undefined
        }
        onClose={() => setDetailReg(null)}
      />

      <RejectModal
        open={!!rejectingReg}
        onClose={() => setRejectingReg(null)}
        onConfirm={handleRejectConfirm}
        athleteName={rejectingReg?.athleteName}
        loading={rejecting}
      />

      <ConfirmDialog
        open={!!deletingReg}
        onClose={() => setDeletingReg(null)}
        onConfirm={handleDeleteConfirm}
        title="Xoá đăng ký"
        description={
          deletingReg
            ? `Bạn có chắc muốn xoá đăng ký của ${deletingReg.athleteName}? Hành động này không thể hoàn tác.`
            : ''
        }
        confirmLabel="Xoá"
        cancelLabel="Huỷ"
        variant="danger"
        loading={deleting}
      />

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => handleStatusFilterChange(f.value)}
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
                    SBD
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Nội dung đăng ký
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    SĐT / Email
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Ngày sinh
                  </th>
                  <th className="text-secondary p-3 text-left font-medium">
                    Phí
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
                  <th className="text-secondary p-3 text-left font-medium">
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
                      <button
                        type="button"
                        onClick={() => setDetailReg(reg)}
                        className="text-left hover:underline"
                      >
                        <div className="text-heading font-medium">
                          {reg.athleteName}
                        </div>
                        {reg.school && (
                          <div className="text-secondary text-xs">
                            {reg.school}
                          </div>
                        )}
                        {reg.club && (
                          <div className="text-secondary text-xs">
                            {reg.club}
                          </div>
                        )}
                      </button>
                    </td>
                    <td className="p-3">
                      {editingBibId === reg._id ? (
                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            min={1}
                            value={bibInputValue}
                            onChange={(e) => setBibInputValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter')
                                void handleBibSave(reg._id);
                              if (e.key === 'Escape') handleBibCancel();
                            }}
                            className="border-surface-border bg-surface text-heading focus:border-primary w-16 rounded border px-1.5 py-0.5 text-xs focus:outline-none"
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => void handleBibSave(reg._id)}
                            className="text-primary hover:text-primary/80 text-xs"
                            disabled={bibUpdating}
                          >
                            ✓
                          </button>
                          <button
                            type="button"
                            onClick={handleBibCancel}
                            className="text-secondary hover:text-heading text-xs"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="text-heading text-xs font-medium">
                            {reg.bibNumber != null ? `#${reg.bibNumber}` : '—'}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleBibEdit(reg)}
                            className="text-faint hover:text-primary transition-colors"
                            title="Sửa SBD"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                              className="h-3 w-3"
                            >
                              <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {categoryMap.get(reg.categoryId) ?? reg.categoryId}
                    </td>
                    <td className="p-3">
                      <div className="text-secondary space-y-0.5 text-xs">
                        {reg.phone && (
                          <div className="flex items-center gap-1">
                            <span className="text-faint">SĐT:</span>
                            {reg.phone}
                          </div>
                        )}
                        {reg.email && (
                          <div className="flex max-w-[140px] items-center gap-1 truncate">
                            <span className="text-faint shrink-0">Email:</span>
                            <span className="truncate">{reg.email}</span>
                          </div>
                        )}
                        {!reg.phone && !reg.email && '—'}
                      </div>
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {formatDateShort(reg.dateOfBirth)}
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {formatCurrency(reg.paymentAmount)}
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
                        <option value={TournamentPaymentStatus.Unpaid}>
                          {TOURNAMENT.PAYMENT_UNPAID}
                        </option>
                        <option value={TournamentPaymentStatus.Verifying}>
                          {TOURNAMENT.PAYMENT_VERIFYING}
                        </option>
                        <option value={TournamentPaymentStatus.Paid}>
                          {TOURNAMENT.PAYMENT_PAID}
                        </option>
                        <option value={TournamentPaymentStatus.Refunded}>
                          {TOURNAMENT.PAYMENT_REFUNDED}
                        </option>
                      </select>
                    </td>
                    <td className="text-secondary p-3 text-xs">
                      {formatDate(reg.createdAt)}
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {(reg.registrationStatus ===
                          RegistrationStatus.Pending ||
                          reg.registrationStatus ===
                            RegistrationStatus.Waitlisted) && (
                          <button
                            type="button"
                            onClick={() => void approve(reg._id)}
                            disabled={isActionLoading}
                            className="text-primary hover:bg-primary/10 rounded-lg p-1.5 transition-colors disabled:opacity-50"
                            title="Duyệt"
                          >
                            <IonIcon
                              name="checkmark-circle-outline"
                              size="sm"
                            />
                          </button>
                        )}
                        {reg.registrationStatus ===
                          RegistrationStatus.Pending && (
                          <button
                            type="button"
                            onClick={() => handleReject(reg)}
                            disabled={isActionLoading}
                            className="rounded-lg p-1.5 text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
                            title="Từ chối"
                          >
                            <IonIcon name="close-circle-outline" size="sm" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDelete(reg)}
                          disabled={isActionLoading}
                          className="text-muted rounded-lg p-1.5 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                          title="Xoá"
                        >
                          <IonIcon name="trash-outline" size="sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={total}
                pageSize={PAGE_SIZE}
                onPageChange={handlePageChange}
              />
            )}
          </GlassPanel>
        )}
      </div>
    </>
  );
}
