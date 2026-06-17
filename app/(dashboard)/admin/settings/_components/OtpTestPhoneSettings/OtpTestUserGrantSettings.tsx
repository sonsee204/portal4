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

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Input } from '@/components/atoms/Input';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { SearchInput } from '@/components/molecules/SearchInput';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { formatDateTime } from '@/lib/utils';
import { OTP_TEST_PHONES } from '@/lib/strings';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';
import { OTP_TEST_USER_GRANTS } from '@/lib/strings/otp-test-user-grants';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared';
import {
  createOtpTestUserGrant,
  fetchOtpTestUserGrants,
  revokeOtpTestUserGrant,
  type OtpTestUserGrant,
} from '@/lib/api/otp-test-user-grants';
import type { User } from '@/types';

function defaultExpiresLocal(): string {
  return new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

function maskPhoneDisplay(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}•••${phone.slice(-3)}`;
}

const createSchema = z.object({
  reason: z.string().min(10, 'Lý do tối thiểu 10 ký tự').max(200),
  expiresAt: z.string().min(1, 'Hết hạn là bắt buộc'),
});

type CreateForm = z.infer<typeof createSchema>;

const columns: DataTableColumn[] = [
  { key: 'user', label: OTP_TEST_USER_GRANTS.COLUMNS.USER },
  { key: 'phone', label: OTP_TEST_USER_GRANTS.COLUMNS.PHONE },
  { key: 'reason', label: OTP_TEST_USER_GRANTS.COLUMNS.REASON },
  { key: 'testCode', label: OTP_TEST_USER_GRANTS.COLUMNS.CODE },
  { key: 'expires', label: OTP_TEST_USER_GRANTS.COLUMNS.EXPIRES },
  { key: 'status', label: OTP_TEST_USER_GRANTS.COLUMNS.STATUS },
  {
    key: 'actions',
    label: OTP_TEST_USER_GRANTS.COLUMNS.ACTIONS,
    align: 'right',
  },
];

export function OtpTestUserGrantSettings() {
  const [items, setItems] = useState<OtpTestUserGrant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [revealedCode, setRevealedCode] = useState<string | null>(null);

  const form = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      reason: '',
      expiresAt: defaultExpiresLocal(),
    },
  });

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  const { users, loading: usersLoading } = useAdminUsers({
    isActive: true,
    isSuspended: false,
    searchQuery: debouncedSearch || undefined,
    pagination: { page: 1, limit: 8 },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOtpTestUserGrants({
        limit: CURSOR_PAGE_MAX,
        enabled: true,
      });
      setItems(result.items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const openCreate = () => {
    form.reset({ reason: '', expiresAt: defaultExpiresLocal() });
    setSelectedUser(null);
    setSearchInput('');
    setRevealedCode(null);
    setShowCreate(true);
  };

  const closeCreate = () => {
    setShowCreate(false);
    setSelectedUser(null);
  };

  const onCreate = async (data: CreateForm) => {
    if (!selectedUser) {
      showError('Vui lòng chọn user');
      return;
    }
    if (!selectedUser.phone?.trim()) {
      showError(OTP_TEST_USER_GRANTS.USER_PICKER.PHONE_MISSING);
      return;
    }

    setSubmitting(true);
    try {
      const grant = await createOtpTestUserGrant({
        userId: selectedUser._id,
        reason: data.reason.trim(),
        expiresAt: new Date(data.expiresAt).toISOString(),
      });
      showSuccess(OTP_TEST_USER_GRANTS.SUCCESS_CREATE);
      setRevealedCode(grant.testCode);
      setShowCreate(false);
      setSelectedUser(null);
      await load();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleRevoke = async (row: OtpTestUserGrant) => {
    const ok = window.confirm(OTP_TEST_USER_GRANTS.CONFIRM_REVOKE);
    if (!ok) return;
    try {
      await revokeOtpTestUserGrant(row._id);
      showSuccess(OTP_TEST_USER_GRANTS.SUCCESS_REVOKE);
      await load();
    } catch (err) {
      showError(formatMutationError(err));
    }
  };

  const handleCopyCode = (code: string) => {
    void navigator.clipboard.writeText(code);
    showSuccess(OTP_TEST_USER_GRANTS.COPIED_CODE);
  };

  const pickerUsers = useMemo(
    () => users.filter((u) => u.phone?.trim()),
    [users]
  );

  const renderRow = (row: OtpTestUserGrant) => (
    <tr key={row._id} className="hover:bg-surface-hover transition-colors">
      <td className="px-4 py-3">
        <p className="text-heading text-sm font-medium">
          {row.userDisplayName}
        </p>
        <p className="text-faint text-xs">{row.userRole}</p>
      </td>
      <td className="px-4 py-3 font-mono text-sm">
        {maskPhoneDisplay(row.phone)}
      </td>
      <td className="text-muted px-4 py-3 text-xs">{row.reason}</td>
      <td className="px-4 py-3">
        <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs">
          {row.testCode}
        </code>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {formatDateTime(row.expiresAt)}
      </td>
      <td className="px-4 py-3">
        <Badge variant={row.enabled ? 'success' : 'danger'}>
          {row.enabled
            ? OTP_TEST_USER_GRANTS.STATUS_ENABLED
            : OTP_TEST_USER_GRANTS.STATUS_DISABLED}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            onClick={() => handleCopyCode(row.testCode)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={OTP_TEST_USER_GRANTS.COPIED_CODE}
          >
            <IonIcon name="copy-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => void handleRevoke(row)}
            className="rounded p-1.5 text-red-400 transition-colors hover:text-red-500"
            title={OTP_TEST_USER_GRANTS.REVOKE}
          >
            <IonIcon name="close-circle-outline" size="sm" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      <GlassPanel card className="border-red-500/30 bg-red-500/5">
        <div className="flex gap-3">
          <IonIcon
            name="shield-outline"
            className="mt-0.5 shrink-0 text-red-400"
          />
          <div>
            <p className="text-heading text-sm font-medium">
              {OTP_TEST_USER_GRANTS.BANNER_TITLE}
            </p>
            <p className="text-muted mt-1 text-xs leading-relaxed">
              {OTP_TEST_USER_GRANTS.BANNER_BODY}
            </p>
          </div>
        </div>
      </GlassPanel>

      {revealedCode && (
        <GlassPanel card className="border-emerald-500/30 bg-emerald-500/5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-heading text-sm font-medium">
                {OTP_TEST_USER_GRANTS.CODE_REVEAL_TITLE}
              </p>
              <p className="text-muted mt-1 text-xs">
                {OTP_TEST_USER_GRANTS.CODE_REVEAL_BODY}
              </p>
              <code className="mt-3 inline-block rounded border border-emerald-500/30 bg-black/20 px-3 py-2 font-mono text-lg tracking-widest">
                {revealedCode}
              </code>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="ghost"
                iconLeft="copy-outline"
                onClick={() => handleCopyCode(revealedCode)}
              >
                Copy
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setRevealedCode(null)}
              >
                Đóng
              </Button>
            </div>
          </div>
        </GlassPanel>
      )}

      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-heading text-lg font-semibold">
            {OTP_TEST_USER_GRANTS.SECTION_TITLE}
          </h3>
          <p className="text-faint text-xs">
            {OTP_TEST_USER_GRANTS.SECTION_DESCRIPTION}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          iconLeft={showCreate ? 'close-outline' : 'add-outline'}
          onClick={() => (showCreate ? closeCreate() : openCreate())}
        >
          {showCreate
            ? OTP_TEST_PHONES.TOGGLE_HIDE
            : OTP_TEST_USER_GRANTS.CREATE}
        </Button>
      </div>

      {showCreate && (
        <GlassPanel card className="max-w-2xl space-y-4">
          <div className="space-y-3">
            <p className="text-heading text-sm font-medium">
              {OTP_TEST_USER_GRANTS.FORM.SEARCH_USER}
            </p>
            <SearchInput
              placeholder={OTP_TEST_USER_GRANTS.FORM.SEARCH_PLACEHOLDER}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <div className="border-surface-border max-h-48 overflow-y-auto rounded border">
              {usersLoading && (
                <p className="text-muted px-4 py-3 text-xs">Đang tìm...</p>
              )}
              {!usersLoading && pickerUsers.length === 0 && (
                <p className="text-muted px-4 py-3 text-xs">
                  {OTP_TEST_USER_GRANTS.USER_PICKER.NO_RESULTS}
                </p>
              )}
              {pickerUsers.map((user) => (
                <button
                  key={user._id}
                  type="button"
                  onClick={() => setSelectedUser(user as User)}
                  className={`hover:bg-surface-hover flex w-full items-center justify-between px-4 py-3 text-left transition-colors ${
                    selectedUser?._id === user._id ? 'bg-primary/10' : ''
                  }`}
                >
                  <div>
                    <p className="text-heading text-sm">
                      {user.fullName || user.displayName || user.userName}
                    </p>
                    <p className="text-faint text-xs">
                      {user.role} ·{' '}
                      {user.phone ? maskPhoneDisplay(user.phone) : '—'}
                    </p>
                  </div>
                  <span className="text-primary text-xs">
                    {OTP_TEST_USER_GRANTS.USER_PICKER.SELECT}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {selectedUser && (
            <GlassPanel card className="bg-surface-hover/50 space-y-1">
              <p className="text-faint text-xs">
                {OTP_TEST_USER_GRANTS.FORM.SELECTED_USER}
              </p>
              <p className="text-heading text-sm font-medium">
                {selectedUser.fullName ||
                  selectedUser.displayName ||
                  selectedUser.userName}
              </p>
              <p className="text-muted text-xs">
                {selectedUser.role} · {selectedUser.phone}
              </p>
            </GlassPanel>
          )}

          <form onSubmit={form.handleSubmit(onCreate)} className="space-y-4">
            <Controller
              name="reason"
              control={form.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_USER_GRANTS.FORM.REASON}
                  placeholder={OTP_TEST_USER_GRANTS.FORM.REASON_PLACEHOLDER}
                  error={form.formState.errors.reason?.message}
                  {...field}
                />
              )}
            />
            <div>
              <p className="text-heading mb-2 text-sm font-medium">
                {OTP_TEST_USER_GRANTS.FORM.PURPOSE}
              </p>
              <Badge variant="info">
                {OTP_TEST_USER_GRANTS.FORM.PURPOSE_LOCKED}
              </Badge>
            </div>
            <Controller
              name="expiresAt"
              control={form.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_USER_GRANTS.FORM.EXPIRES}
                  type="datetime-local"
                  error={form.formState.errors.expiresAt?.message}
                  {...field}
                />
              )}
            />
            <Button type="submit" disabled={submitting || !selectedUser}>
              {submitting
                ? OTP_TEST_USER_GRANTS.SUBMITTING
                : OTP_TEST_USER_GRANTS.SUBMIT_CREATE}
            </Button>
          </form>
        </GlassPanel>
      )}

      <QueryState
        loading={loading}
        error={error ?? undefined}
        onRetry={() => void load()}
      >
        <DataTable
          columns={columns}
          data={items}
          renderRow={renderRow}
          emptyTitle={OTP_TEST_USER_GRANTS.EMPTY_TITLE}
          emptyDescription={OTP_TEST_USER_GRANTS.EMPTY_DESCRIPTION}
        />
      </QueryState>
    </div>
  );
}
