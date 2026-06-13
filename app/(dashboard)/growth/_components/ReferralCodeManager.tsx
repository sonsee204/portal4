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

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/atoms/Button';
import { Badge } from '@/components/atoms/Badge';
import { IonIcon } from '@/components/atoms/IonIcon';
import { Input } from '@/components/atoms/Input';
import {
  DataTable,
  type DataTableColumn,
} from '@/components/organisms/DataTable';
import {
  useReferralCodes,
  useCreateReferralCode,
  useToggleReferralCode,
} from '@/hooks/referral';
import { showSuccess } from '@/lib/toast';
import { GROWTH } from '@/lib/strings';
import {
  createReferralCodeSchema,
  type CreateReferralCodeFormData,
} from '@/lib/validation/schemas';
import type { ReferralCode } from '@/types';

const columns: DataTableColumn[] = [
  { key: 'code', label: GROWTH.REFERRAL.COLUMNS.CODE },
  { key: 'owner', label: GROWTH.REFERRAL.COLUMNS.OWNER },
  { key: 'status', label: GROWTH.REFERRAL.COLUMNS.STATUS },
  { key: 'usage', label: GROWTH.REFERRAL.COLUMNS.USAGE, align: 'right' },
  { key: 'signups', label: GROWTH.REFERRAL.COLUMNS.SIGNUPS, align: 'right' },
  { key: 'revenue', label: GROWTH.REFERRAL.COLUMNS.REVENUE, align: 'right' },
  { key: 'actions', label: '', align: 'center' },
];

export function ReferralCodeManager() {
  const [showCreateForm, setShowCreateForm] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateReferralCodeFormData>({
    resolver: zodResolver(createReferralCodeSchema),
    defaultValues: {
      code: '',
      ownerId: '',
      ownerName: '',
      ownerRole: '',
      maxUses: '',
    },
  });

  const { codes, loading, refetch } = useReferralCodes();

  const { createCode, loading: creating } = useCreateReferralCode({
    onSuccess: () => {
      reset();
      setShowCreateForm(false);
      void refetch();
    },
  });

  const { toggleCode } = useToggleReferralCode({
    onSuccess: () => {
      void refetch();
    },
  });

  const onSubmit = (data: CreateReferralCodeFormData) => {
    createCode({
      code: data.code.toUpperCase(),
      ownerId: data.ownerId,
      ownerName: data.ownerName,
      ownerRole: data.ownerRole || undefined,
      maxUses: data.maxUses ? parseInt(data.maxUses, 10) : undefined,
    });
  };

  const handleToggle = useCallback(
    (id: string, isActive: boolean) => {
      toggleCode(id, isActive);
    },
    [toggleCode]
  );

  const handleCopyCode = useCallback((code: string) => {
    void navigator.clipboard.writeText(code);
    showSuccess(GROWTH.REFERRAL.COPIED_CODE(code));
  }, []);

  const handleCopyLink = useCallback((code: string) => {
    const link = `https://aotrinh.vn/download?ref=${code}`;
    void navigator.clipboard.writeText(link);
    showSuccess(GROWTH.REFERRAL.COPIED_LINK);
  }, []);

  const renderRow = (code: ReferralCode) => (
    <tr key={code._id} className="hover:bg-surface-hover transition-colors">
      <td className="px-4 py-3">
        <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs font-semibold">
          {code.code}
        </code>
      </td>

      <td className="px-4 py-3">
        <div>
          <p className="text-heading text-sm font-medium">{code.ownerName}</p>
          {code.ownerRole && (
            <p className="text-faint text-xs">{code.ownerRole}</p>
          )}
        </div>
      </td>

      <td className="px-4 py-3">
        <Badge variant={code.isActive ? 'success' : 'danger'}>
          {code.isActive
            ? GROWTH.REFERRAL.STATUS_ACTIVE
            : GROWTH.REFERRAL.STATUS_INACTIVE}
        </Badge>
      </td>

      <td className="text-heading px-4 py-3 text-right text-sm">
        {code.currentUses}
        {code.maxUses ? ` / ${code.maxUses}` : ''}
      </td>

      <td className="text-heading px-4 py-3 text-right text-sm font-medium">
        {code.totalSignups.toLocaleString()}
      </td>

      <td className="text-heading px-4 py-3 text-right text-sm">
        {code.totalRevenue > 0
          ? code.totalRevenue.toLocaleString('vi-VN')
          : '-'}
      </td>

      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => handleCopyCode(code.code)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={GROWTH.REFERRAL.ACTION_COPY_CODE}
          >
            <IonIcon name="copy-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleCopyLink(code.code)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={GROWTH.REFERRAL.ACTION_COPY_LINK}
          >
            <IonIcon name="link-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(code._id, code.isActive)}
            className={`rounded p-1.5 transition-colors ${
              code.isActive
                ? 'text-red-400 hover:text-red-500'
                : 'text-emerald-400 hover:text-emerald-500'
            }`}
            title={
              code.isActive
                ? GROWTH.REFERRAL.ACTION_DEACTIVATE
                : GROWTH.REFERRAL.ACTION_ACTIVATE
            }
          >
            <IonIcon
              name={
                code.isActive
                  ? 'close-circle-outline'
                  : 'checkmark-circle-outline'
              }
              size="sm"
            />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-heading text-lg font-semibold">
          {GROWTH.REFERRAL.SECTION_TITLE}
        </h3>
        <Button
          variant="primary"
          size="sm"
          iconLeft={showCreateForm ? 'close-outline' : 'add-outline'}
          onClick={() => setShowCreateForm(!showCreateForm)}
        >
          {showCreateForm
            ? GROWTH.REFERRAL.TOGGLE_HIDE
            : GROWTH.REFERRAL.TOGGLE_SHOW}
        </Button>
      </div>

      {/* Create Form (inline panel) */}
      {showCreateForm && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-surface border-surface-border rounded-xl border p-5 shadow-sm"
        >
          <h4 className="text-heading mb-4 font-semibold">
            {GROWTH.REFERRAL.CREATE_TITLE}
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Controller
              name="code"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={GROWTH.REFERRAL.FORM.CODE}
                  placeholder={GROWTH.REFERRAL.FORM.CODE_PLACEHOLDER}
                  error={errors.code?.message}
                  onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                />
              )}
            />
            <Controller
              name="ownerId"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={GROWTH.REFERRAL.FORM.OWNER_ID}
                  placeholder={GROWTH.REFERRAL.FORM.OWNER_ID_PLACEHOLDER}
                  error={errors.ownerId?.message}
                />
              )}
            />
            <Controller
              name="ownerName"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={GROWTH.REFERRAL.FORM.OWNER_NAME}
                  placeholder={GROWTH.REFERRAL.FORM.OWNER_NAME_PLACEHOLDER}
                  error={errors.ownerName?.message}
                />
              )}
            />
            <Controller
              name="ownerRole"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={GROWTH.REFERRAL.FORM.ROLE}
                  placeholder={GROWTH.REFERRAL.FORM.ROLE_PLACEHOLDER}
                  error={errors.ownerRole?.message}
                />
              )}
            />
            <Controller
              name="maxUses"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  label={GROWTH.REFERRAL.FORM.MAX_USES}
                  placeholder={GROWTH.REFERRAL.FORM.MAX_USES_PLACEHOLDER}
                  type="number"
                  error={errors.maxUses?.message}
                />
              )}
            />
            <div className="flex items-end">
              <Button
                type="submit"
                variant="primary"
                size="md"
                iconLeft="checkmark-outline"
                disabled={creating}
                className="w-full"
              >
                {creating ? GROWTH.REFERRAL.SUBMITTING : GROWTH.REFERRAL.SUBMIT}
              </Button>
            </div>
          </div>
        </form>
      )}

      {/* Codes Table */}
      <div className="bg-surface border-surface-border overflow-hidden rounded-xl border shadow-sm">
        {loading ? (
          <div className="space-y-3 p-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-surface-hover h-12 animate-pulse rounded"
              />
            ))}
          </div>
        ) : (
          <DataTable<ReferralCode>
            columns={columns}
            data={codes}
            renderRow={renderRow}
            emptyTitle={GROWTH.REFERRAL.EMPTY_TITLE}
            emptyDescription={GROWTH.REFERRAL.EMPTY_DESCRIPTION}
          />
        )}

        {/* Footer */}
        <div className="border-surface-border text-faint border-t px-6 py-3 text-xs">
          {GROWTH.REFERRAL.TOTAL_CODES(codes.length)}
        </div>
      </div>
    </div>
  );
}
