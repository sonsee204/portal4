/**
 * Ao Trình (NALee Sports)
 * Nền tảng Công nghệ Hệ sinh thái Thể thao / Sports Ecosystem Technology Platform
 *
 * @copyright 2025-2026 Lê Trung Hiếu
 * @author Lê Trung Hiếu <letrunghieu.nalee@gmail.com>
 * @license Proprietary - All rights reserved
 */

'use client';

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { PermissionGate } from '@/components/atoms/PermissionGate';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared';
import {
  fetchPortalCapabilityGrants,
  grantPortalCapability,
  revokePortalCapability,
  type PortalCapabilityGrant,
} from '@/lib/api/portal-access';
import { PortalCapability } from '@/graphql/generated';

const grantSchema = z.object({
  reason: z.string().min(10, 'Lý do tối thiểu 10 ký tự').max(200),
});

type GrantForm = z.infer<typeof grantSchema>;

const columns: DataTableColumn[] = [
  { key: 'capability', label: 'Quyền' },
  { key: 'reason', label: 'Lý do' },
  { key: 'status', label: 'Trạng thái' },
  { key: 'grantedAt', label: 'Cấp lúc' },
  { key: 'actions', label: '', align: 'center' },
];

interface PortalAccessSectionProps {
  userId: string;
  userDisplayName: string;
  activeCapabilities?: string[];
}

export function PortalAccessSection({
  userId,
  userDisplayName,
  activeCapabilities = [],
}: PortalAccessSectionProps) {
  const [grants, setGrants] = useState<PortalCapabilityGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [showGrantDialog, setShowGrantDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const hasActiveOrganizer = activeCapabilities.includes('TOURNAMENT_ORGANIZER');

  const form = useForm<GrantForm>({
    resolver: zodResolver(grantSchema),
    defaultValues: { reason: '' },
  });

  const loadGrants = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const items = await fetchPortalCapabilityGrants({ userId, limit: 20 });
      setGrants(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Không tải được lịch sử grant'));
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    void loadGrants();
  }, [loadGrants]);

  const activeGrant = grants.find(
    (g) => g.capability === 'TOURNAMENT_ORGANIZER' && g.enabled,
  );

  async function handleGrant(values: GrantForm) {
    setSubmitting(true);
    try {
      await grantPortalCapability({
        userId,
        capability: PortalCapability.TournamentOrganizer,
        reason: values.reason.trim(),
      });
      showSuccess(`Đã cấp quyền Ban tổ chức giải cho ${userDisplayName}`);
      setShowGrantDialog(false);
      form.reset();
      await loadGrants();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRevoke(grantId: string) {
    setSubmitting(true);
    try {
      await revokePortalCapability(grantId);
      showSuccess('Đã thu hồi quyền Ban tổ chức giải');
      await loadGrants();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  }

  const renderRow = (row: PortalCapabilityGrant) => (
    <tr key={row._id} className="border-surface-border border-b last:border-0">
      <td className="px-4 py-3 text-sm">Ban tổ chức giải</td>
      <td className="text-muted px-4 py-3 text-xs">{row.reason}</td>
      <td className="px-4 py-3">
        <Badge variant={row.enabled ? 'success' : 'neutral'}>
          {row.enabled ? 'Đang hoạt động' : 'Đã thu hồi'}
        </Badge>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {row.grantedAt
          ? new Date(row.grantedAt).toLocaleString('vi-VN')
          : '—'}
      </td>
      <td className="px-4 py-3 text-center">
        {row.enabled ? (
          <Button
            size="sm"
            variant="ghost"
            disabled={submitting}
            onClick={() => void handleRevoke(row._id)}
          >
            Thu hồi
          </Button>
        ) : null}
      </td>
    </tr>
  );

  return (
    <PermissionGate permission="users.manage">
      <GlassPanel card className="mt-6 space-y-4 p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-xl">
              <IonIcon name="trophy-outline" className="text-primary text-xl" />
            </div>
            <div>
              <h2 className="text-heading font-semibold">Quyền Portal</h2>
              <p className="text-secondary text-sm">
                Cấp quyền Ban tổ chức giải (workspace /organizer).
              </p>
            </div>
          </div>
          <Badge variant={hasActiveOrganizer ? 'success' : 'neutral'}>
            {hasActiveOrganizer ? 'BTO đang bật' : 'Chưa cấp BTO'}
          </Badge>
        </div>

        <div className="flex flex-wrap gap-2">
          {!hasActiveOrganizer && !activeGrant && (
            <Button
              size="sm"
              variant="primary"
              iconLeft="add-outline"
              onClick={() => setShowGrantDialog(true)}
            >
              Cấp Ban tổ chức giải
            </Button>
          )}
        </div>

        {showGrantDialog && (
          <form
            className="border-surface-border space-y-3 rounded-xl border p-4"
            onSubmit={form.handleSubmit((v) => void handleGrant(v))}
          >
            <Input
              label="Lý do / ticket (tối thiểu 10 ký tự)"
              {...form.register('reason')}
              error={form.formState.errors.reason?.message}
            />
            <div className="flex gap-2">
              <Button type="submit" size="sm" disabled={submitting}>
                Xác nhận cấp quyền
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setShowGrantDialog(false)}
              >
                Hủy
              </Button>
            </div>
          </form>
        )}

        <QueryState loading={loading} error={error} onRetry={() => void loadGrants()}>
          <DataTable
            columns={columns}
            data={grants}
            renderRow={renderRow}
            emptyTitle="Chưa có lịch sử grant"
          />
        </QueryState>
      </GlassPanel>
    </PermissionGate>
  );
}
