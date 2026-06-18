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
import { ConnectionPager } from '@/components/molecules/ConnectionPager';
import { ConfirmDialog } from '@/components/molecules/ConfirmDialog';
import { VenueActionGate } from '@/components/atoms/VenueActionGate';
import { useVenueContext } from '@/components/providers/VenueContextProvider';
import {
  useOwnerStaff,
  useVenuePendingInvitations,
  type VenueStaffNode,
} from '@/hooks/owner';
import { VenueStaffStatus } from '@/graphql/generated';
import { formatVenuePermissions } from '@/lib/venue/venue-action-labels';
import {
  STAFF_STATUS_CHIPS,
  type StaffStatusFilterValue,
} from './_hooks/owner-staff-page.constants';
import { AddStaffModal } from './_components/AddStaffModal';
import { EditStaffPermissionsModal } from './_components/EditStaffPermissionsModal';
import { StaffRowActions } from './_components/StaffRowActions';

const TABLE_SCROLL_CLASS_NAME =
  'max-h-[min(70vh,calc(100dvh-15rem))] min-h-[240px]';

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
  const {
    staff,
    totalCount,
    hasNextPage,
    loadMore,
    loading,
    error,
    refetch,
    addStaff,
    updatePermissions,
    removeStaff,
    adding,
    updatingPermissions,
    removing,
  } = useOwnerStaff(selectedVenueId, { limit: 20 });

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

  const allStaffRows = useMemo(() => {
    const activeStaff = staff.filter((member) => !member.isOwner);
    const pendingOnly = invitations.filter(
      (invitation) =>
        !activeStaff.some((member) => member._id === invitation._id)
    );
    return [...activeStaff, ...pendingOnly];
  }, [invitations, staff]);

  const statusChips = useMemo(
    () =>
      STAFF_STATUS_CHIPS.map((chip) => ({
        ...chip,
        count:
          chip.value === 'ALL'
            ? allStaffRows.length
            : allStaffRows.filter((member) => member.status === chip.value)
                .length,
      })),
    [allStaffRows]
  );

  const staffRows = useMemo(() => {
    let rows = allStaffRows;

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
  }, [allStaffRows, searchQuery, statusFilter]);

  const trimmedSearch = searchQuery.trim();
  const hasClientFilters = trimmedSearch.length > 0 || statusFilter !== 'ALL';

  const handleRemove = async () => {
    if (!removeTarget?.user?._id) return;
    const ok = await removeStaff(removeTarget.user._id);
    if (ok) {
      setRemoveTarget(null);
      await refetchInvitations();
    }
  };

  const rowActionsDisabled = updatingPermissions || removing;

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

      <GlassPanel card className="mt-6 space-y-4">
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
            allStaffRows.length === 0 &&
            !!selectedVenueId
          }
          error={error}
          empty={!selectedVenueId}
          emptyMessage="Chọn cơ sở để xem danh sách nhân viên."
          onRetry={() => void Promise.all([refetch(), refetchInvitations()])}
        >
          <DataTable
            columns={[
              { key: 'name', label: 'Nhân viên' },
              { key: 'contact', label: 'Liên hệ' },
              { key: 'permissions', label: 'Quyền' },
              { key: 'status', label: 'Trạng thái', align: 'center' },
              DATA_TABLE_ACTIONS_COLUMN,
            ]}
            stickyHeader
            className={TABLE_SCROLL_CLASS_NAME}
            data={staffRows}
            emptyTitle={
              hasClientFilters
                ? 'Không tìm thấy nhân viên'
                : 'Chưa có nhân viên'
            }
            emptyDescription={
              hasClientFilters
                ? 'Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm.'
                : 'Thêm nhân viên để phân quyền quản lý cơ sở.'
            }
            renderRow={(member) => (
              <tr
                key={member._id}
                className="border-surface-border hover:bg-surface-hover border-b transition-colors"
              >
                <td className="text-body px-4 py-3 text-sm">
                  <div className="font-medium">
                    {member.user?.displayName ?? '—'}
                  </div>
                  {member.customTitle && (
                    <div className="text-faint text-xs">
                      {member.customTitle}
                    </div>
                  )}
                </td>
                <td className="text-muted px-4 py-3 text-xs">
                  <div>{member.user?.phone ?? '—'}</div>
                  <div>{member.user?.email ?? '—'}</div>
                </td>
                <td className="text-muted max-w-xs px-4 py-3 text-xs">
                  {formatVenuePermissions(member.permissions)}
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
        {!hasClientFilters ? (
          <ConnectionPager
            loadedCount={allStaffRows.length}
            totalCount={totalCount}
            hasNextPage={hasNextPage}
            onNext={() => void loadMore()}
            loading={loading}
          />
        ) : null}
      </GlassPanel>

      <AddStaffModal
        open={addStaffOpen}
        loading={adding}
        onClose={() => setAddStaffOpen(false)}
        onSubmit={async (userId, permissions) => {
          const ok = await addStaff(userId, permissions);
          if (ok) await refetchInvitations();
          return ok;
        }}
      />

      <EditStaffPermissionsModal
        staff={editTarget}
        open={Boolean(editTarget)}
        loading={updatingPermissions}
        onClose={() => setEditTarget(null)}
        onSave={updatePermissions}
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => setRemoveTarget(null)}
        onConfirm={() => void handleRemove()}
        title="Xóa nhân viên"
        description={`Bạn có chắc muốn xóa ${removeTarget?.user?.displayName ?? 'nhân viên này'} khỏi sân?`}
        confirmLabel="Xóa nhân viên"
        variant="danger"
        loading={removing}
      />
    </VenueActionGate>
  );
}
