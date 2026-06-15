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

import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Badge } from '@/components/atoms/Badge';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { DataTable } from '@/components/organisms/DataTable';
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
  userId: z.string().min(1, 'Nhập user ID'),
  reason: z.string().min(10, 'Lý do tối thiểu 10 ký tự').max(200),
});

type GrantForm = z.infer<typeof grantSchema>;

export function CapabilityGrantsSection() {
  const [grants, setGrants] = useState<PortalCapabilityGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [showGrantForm, setShowGrantForm] = useState(false);

  const form = useForm<GrantForm>({
    resolver: zodResolver(grantSchema),
    defaultValues: { userId: '', reason: '' },
  });

  const loadGrants = useCallback(async () => {
    setLoading(true);
    setError(undefined);
    try {
      const items = await fetchPortalCapabilityGrants({ limit: 50 });
      setGrants(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Không tải được grants'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGrants();
  }, [loadGrants]);

  async function handleGrant(values: GrantForm) {
    setSubmitting(true);
    try {
      await grantPortalCapability({
        userId: values.userId.trim(),
        capability: PortalCapability.TournamentOrganizer,
        reason: values.reason.trim(),
      });
      showSuccess('Đã cấp quyền Ban tổ chức giải');
      form.reset();
      setShowGrantForm(false);
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
      showSuccess('Đã thu hồi quyền');
      await loadGrants();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <GlassPanel card className="space-y-4 p-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-heading font-semibold">
            Quyền Portal (Organizer)
          </h3>
          <p className="text-muted text-sm">
            Cấp quyền workspace /organizer cho user (Ban tổ chức giải).
          </p>
        </div>
        <Button
          size="sm"
          variant="primary"
          iconLeft="add-outline"
          onClick={() => setShowGrantForm((v) => !v)}
        >
          Cấp quyền
        </Button>
      </div>

      {showGrantForm && (
        <form
          className="border-surface-border space-y-3 rounded-xl border p-4"
          onSubmit={form.handleSubmit((v) => void handleGrant(v))}
        >
          <Input
            label="User ID"
            {...form.register('userId')}
            error={form.formState.errors.userId?.message}
          />
          <Input
            label="Lý do / ticket"
            {...form.register('reason')}
            error={form.formState.errors.reason?.message}
          />
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={submitting}>
              Xác nhận
            </Button>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setShowGrantForm(false)}
            >
              Hủy
            </Button>
          </div>
        </form>
      )}

      <QueryState
        loading={loading}
        error={error}
        onRetry={() => void loadGrants()}
      >
        <DataTable
          columns={[
            { key: 'user', label: 'Người dùng' },
            { key: 'capability', label: 'Quyền' },
            { key: 'status', label: 'Trạng thái' },
            { key: 'reason', label: 'Lý do' },
            { key: 'actions', label: '', align: 'center' },
          ]}
          data={grants}
          renderRow={(row: PortalCapabilityGrant) => (
            <tr
              key={row._id}
              className="border-surface-border border-b last:border-0"
            >
              <td className="px-4 py-3 text-sm">
                <div className="text-heading font-medium">
                  {row.userDisplayName}
                </div>
                <div className="text-faint text-xs">{row.userId}</div>
              </td>
              <td className="px-4 py-3 text-sm">Ban tổ chức giải</td>
              <td className="px-4 py-3">
                <Badge variant={row.enabled ? 'success' : 'neutral'}>
                  {row.enabled ? 'Hoạt động' : 'Đã thu hồi'}
                </Badge>
              </td>
              <td className="text-muted px-4 py-3 text-xs">{row.reason}</td>
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
          )}
        />
      </QueryState>
    </GlassPanel>
  );
}
