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

import { useMemo, useState } from 'react';
import { PageHeader } from '@/components/organisms/PageHeader';
import {
  DataTable,
  DATA_TABLE_ACTIONS_CELL_CLASS,
  DATA_TABLE_ACTIONS_COLUMN,
} from '@/components/organisms/DataTable';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { FilterChips } from '@/components/molecules/FilterChips';
import { QueryState } from '@/components/molecules/QueryState';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useOwnerStaff,
  useVenuePendingInvitations,
  type VenueStaffNode,
} from '@/hooks/owner';
import { VenueStaffStatus } from '@/graphql/generated';
import { formatVenuePermissionSummary } from '@/lib/venue/venue-action-labels';
import { getStaffRemoveDialogCopy } from '@/lib/venue/staff-row-actions';
import { useDataTableSortUrl } from '@/hooks/shared/useDataTableSortUrl';
import { toSortByOrder } from '@/hooks/shared/useDataTableSort';
import {
  STAFF_STATUS_CHIPS,
  type StaffStatusFilterValue,
} from './_hooks/owner-staff-page.constants';
import { AddStaffModal } from './_components/AddStaffModal';
import { EditStaffModal } from './_components/EditStaffModal';
import { PendingInvitationsPanel } from './_components/PendingInvitationsPanel';
import { StaffRowActions } from './_components/StaffRowActions';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

const STAFF_SORT_FIELDS = ['joinedAt', 'isOwner', 'createdAt'] as const;

const STATUS_LABEL: Record<VenueStaffStatus, string> = {
  [VenueStaffStatus.Active]: 'Đang hoạt động',
  [VenueStaffStatus.Inactive]: 'Ngưng hoạt động',
  [VenueStaffStatus.Pending]: 'Chờ xác nhận',
};

const STATUS_VARIANT: Record<
  VenueStaffStatus,
  'success' | 'warning' | 'neutral'
> = {
  [VenueStaffStatus.Active]: 'success',
  [VenueStaffStatus.Inactive]: 'neutral',
  [VenueStaffStatus.Pending]: 'warning',
};

export default function OwnerStaffPage() {
  const { selectedVenueId, loading: venueLoading } = useVenueContext();

  const sort = useDataTableSortUrl({
    allowedFields: STAFF_SORT_FIELDS,
    defaultField: 'joinedAt',
    defaultDir: 'asc',
  });

  const sortInput = useMemo(
    () => toSortByOrder(sort.sortField, sort.sortDir),
    [sort.sortField, sort.sortDir]
  );

  const {
    staff,
    totalCount,
    hasNextPage,
    loadMore,
    isLoadingMore,
    loading,
    error,
    refetch,
    addStaff,
    updateStaff,
    removeStaff,
    adding,
    updatingPermissions,
    updatingTitle,
    removing,
  } = useOwnerStaff(selectedVenueId, sortInput, { limit: 20 });

  const {
    invitations,
    loading: invitationsLoading,
    refetch: refetchInvitations,
  } = useVenuePendingInvitations(selectedVenueId);

  const [addStaffOpen, setAddStaffOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] =
    useState<StaffStatusFilterValue>('ALL');
  const [editTarget, setEditTarget] = useState<VenueStaffNode | null>(null);
  const [removeTarget, setRemoveTarget] = useState<VenueStaffNode | null>(null);

  const ownerMember = useMemo(
    () => staff.find((member) => member.isOwner) ?? null,
    [staff]
  );

  const tableStaff = useMemo(() => {
    const nonOwners = staff.filter((member) => !member.isOwner);
    if (!ownerMember) return nonOwners;
    return [ownerMember, ...nonOwners];
  }, [ownerMember, staff]);

  const statusChips = useMemo(
    () =>
      STAFF_STATUS_CHIPS.map((chip) => ({
        ...chip,
        count:
          chip.value === 'ALL'
            ? tableStaff.length
            : tableStaff.filter((member) => member.status === chip.value)
                .length,
      })),
    [tableStaff]
  );

  const staffRows = useMemo(() => {
    let rows = tableStaff;

    if (statusFilter !== 'ALL') {
      rows = rows.filter((member) => member.status === statusFilter);
    }

    const normalizedSearch = searchQuery.trim().toLowerCase();
    if (normalizedSearch) {
      rows = rows.filter((member) => {
        const name = member.user?.displayName?.toLowerCase() ?? '';
        return name.includes(normalizedSearch);
      });
    }

    return rows;
  }, [tableStaff, searchQuery, statusFilter]);

  const trimmedSearch = searchQuery.trim();
  const hasClientFilters = trimmedSearch.length > 0 || statusFilter !== 'ALL';
  const rowActionsDisabled = updatingPermissions || updatingTitle || removing;
  const removeDialogCopy = removeTarget
    ? getStaffRemoveDialogCopy(removeTarget)
    : null;

  const handleRemove = async () => {
    if (!removeTarget?.user?._id) return;
    const ok = await removeStaff(removeTarget.user._id);
    if (ok) {
      setRemoveTarget(null);
      await refetchInvitations();
    }
  };

  const showEmptyStaff =
    tableStaff.length === 0 &&
    invitations.length === 0 &&
    !!selectedVenueId &&
    !loading &&
    !invitationsLoading;

  return (
    <VenueActionGate
      ownerOnly
      fallback={
        <GlassPanel card className="mt-6">
          <p className="text-muted text-sm">
            Chỉ chủ sân mới có thể quản lý nhân viên.
          </p>
        </GlassPanel>
      }
    >
      <PageHeader
        title="Quản lý nhân viên"
        description="Thêm, chỉnh sửa quyền và xóa nhân viên theo từng cơ sở."
        actions={
          <Button
            iconLeft="person-add-outline"
            onClick={() => setAddStaffOpen(true)}
            disabled={!selectedVenueId}
          >
            Thêm nhân viên
          </Button>
        }
      />

      <div className="mt-6 space-y-4">
        <PendingInvitationsPanel
          invitations={invitations}
          disabled={rowActionsDisabled}
          onCancel={setRemoveTarget}
        />

        <GlassPanel card className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <FilterChips
              chips={statusChips}
              active={statusFilter}
              onChange={(value) =>
                setStatusFilter(value as StaffStatusFilterValue)
              }
            />
            <Input
              className="max-w-xs shrink-0"
              placeholder="Tìm tên nhân viên..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              leftIcon="search-outline"
              disabled={!selectedVenueId}
            />
          </div>

          <QueryState
            loading={
              (loading || venueLoading || invitationsLoading) &&
              tableStaff.length === 0 &&
              invitations.length === 0 &&
              !!selectedVenueId
            }
            error={error}
            empty={!selectedVenueId}
            emptyMessage="Chọn cơ sở để xem danh sách nhân viên."
            onRetry={() => void Promise.all([refetch(), refetchInvitations()])}
          >
            <DataTable
              columns={[
                {
                  key: 'name',
                  label: 'Nhân viên',
                  sortable: true,
                  sortField: 'joinedAt',
                },
                { key: 'contact', label: 'Liên hệ' },
                { key: 'permissions', label: 'Quyền' },
                { key: 'status', label: 'Trạng thái', align: 'center' },
                DATA_TABLE_ACTIONS_COLUMN,
              ]}
              stickyHeader
              className={TABLE_SCROLL_CLASS_NAME}
              data={staffRows}
              sortKey={sort.sortField}
              sortDir={sort.sortDir}
              onSort={sort.handleSort}
              sortLoading={
                loading && tableStaff.length > 0 && !hasClientFilters
              }
              emptyTitle={
                hasClientFilters
                  ? 'Không tìm thấy nhân viên'
                  : showEmptyStaff
                    ? 'Chưa có nhân viên'
                    : 'Không tìm thấy nhân viên'
              }
              emptyDescription={
                hasClientFilters
                  ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'
                  : showEmptyStaff
                    ? 'Thêm nhân viên để phân quyền quản lý cơ sở.'
                    : 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'
              }
              infiniteScroll={
                hasClientFilters
                  ? undefined
                  : {
                      loadedCount: tableStaff.length,
                      totalCount,
                      hasNextPage,
                      onLoadMore: () => void loadMore(),
                      loading: loading && tableStaff.length === 0,
                      loadingMore: isLoadingMore,
                    }
              }
              renderRow={(member) => (
                <tr
                  key={member._id}
                  className="border-surface-border hover:bg-surface-hover border-b transition-colors"
                >
                  <td className="text-body px-4 py-3 text-sm">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-medium">
                        {member.user?.displayName ?? '—'}
                      </span>
                      {member.isOwner ? (
                        <Badge variant="info">Chủ sân</Badge>
                      ) : null}
                    </div>
                    {member.customTitle && !member.isOwner ? (
                      <div className="text-faint text-xs">
                        {member.customTitle}
                      </div>
                    ) : null}
                  </td>
                  <td className="text-muted px-4 py-3 text-xs">
                    <div>{member.user?.phone ?? '—'}</div>
                    <div>{member.user?.email ?? '—'}</div>
                  </td>
                  <td className="text-muted max-w-xs px-4 py-3 text-xs">
                    {member.isOwner
                      ? 'Toàn bộ quyền'
                      : formatVenuePermissionSummary(member.permissions)}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <Badge variant={STATUS_VARIANT[member.status]}>
                      {STATUS_LABEL[member.status]}
                    </Badge>
                  </td>
                  <td className={DATA_TABLE_ACTIONS_CELL_CLASS}>
                    <StaffRowActions
                      member={member}
                      disabled={rowActionsDisabled}
                      onEdit={setEditTarget}
                      onRemove={setRemoveTarget}
                    />
                  </td>
                </tr>
              )}
            />
          </QueryState>
        </GlassPanel>
      </div>

      <AddStaffModal
        open={addStaffOpen}
        loading={adding}
        onClose={() => setAddStaffOpen(false)}
        onSubmit={async ({ userId, permissions, customTitle }) => {
          const ok = await addStaff(userId, permissions, customTitle);
          if (ok) await refetchInvitations();
          return ok;
        }}
      />

      <EditStaffModal
        staff={editTarget}
        open={Boolean(editTarget)}
        loading={updatingPermissions || updatingTitle}
        onClose={() => setEditTarget(null)}
        onSave={async (userId, input, current) => {
          return updateStaff(userId, input, current);
        }}
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => void handleRemove()}
        title={removeDialogCopy?.title ?? 'Xóa nhân viên'}
        description={
          removeDialogCopy?.description ??
          'Bạn có chắc muốn thực hiện thao tác này?'
        }
        confirmLabel={removeDialogCopy?.confirmLabel ?? 'Xác nhận'}
        variant="danger"
        loading={removing}
      />
    </VenueActionGate>
  );
}
