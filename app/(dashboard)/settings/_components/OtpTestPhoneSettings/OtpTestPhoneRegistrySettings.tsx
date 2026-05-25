'use client';

import { useCallback, useEffect, useState } from 'react';
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
import { OTP_TEST_PHONES } from '@/lib/strings';
import { showError, showSuccess } from '@/lib/toast';
import { formatMutationError } from '@/hooks/shared';
import {
  createOtpTestPhone,
  fetchOtpTestPhones,
  formatFirebaseTestNumber,
  setOtpTestPhoneEnabled,
  updateOtpTestPhone,
  type OtpTestPhone,
  type OtpTestPhonePurpose,
} from '@/lib/api/otp-test-phones';

const PURPOSE_OPTIONS: { label: string; value: OtpTestPhonePurpose }[] = [
  { label: 'Đăng ký', value: 'SIGN_UP_PHONE' },
  { label: 'Đăng nhập', value: 'SIGN_IN_PHONE' },
  { label: 'Quên mật khẩu', value: 'PASSWORD_RESET_PHONE' },
  { label: 'Đổi SĐT', value: 'PHONE_CHANGE' },
];

const createSchema = z.object({
  phone: z.string().min(9, 'Số điện thoại không hợp lệ'),
  testCode: z.string().regex(/^\d{6}$/, 'Mã OTP phải đúng 6 chữ số'),
  label: z.string().min(1, 'Nhãn là bắt buộc').max(120),
  allowedPurposes: z.array(z.string()).optional(),
  expiresAt: z.string().optional(),
});

const editSchema = createSchema.omit({ phone: true });

type CreateForm = z.infer<typeof createSchema>;
type EditForm = z.infer<typeof editSchema>;

const columns: DataTableColumn[] = [
  { key: 'phone', label: OTP_TEST_PHONES.COLUMNS.PHONE },
  { key: 'label', label: OTP_TEST_PHONES.COLUMNS.LABEL },
  { key: 'testCode', label: OTP_TEST_PHONES.COLUMNS.CODE },
  { key: 'purposes', label: OTP_TEST_PHONES.COLUMNS.PURPOSES },
  { key: 'status', label: OTP_TEST_PHONES.COLUMNS.STATUS },
  { key: 'expires', label: OTP_TEST_PHONES.COLUMNS.EXPIRES },
  { key: 'actions', label: OTP_TEST_PHONES.COLUMNS.ACTIONS, align: 'center' },
];

function maskPhoneDisplay(phone: string): string {
  if (phone.length <= 6) return phone;
  return `${phone.slice(0, 4)}•••${phone.slice(-3)}`;
}

function formatPurposes(purposes: string[]): string {
  if (!purposes.length) return OTP_TEST_PHONES.ALL_PURPOSES;
  return purposes
    .map((p) => PURPOSE_OPTIONS.find((o) => o.value === p)?.label ?? p)
    .join(', ');
}

export function OtpTestPhoneRegistrySettings() {
  const [items, setItems] = useState<OtpTestPhone[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dialogMode, setDialogMode] = useState<'create' | 'edit' | null>(null);
  const [editing, setEditing] = useState<OtpTestPhone | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const createForm = useForm<CreateForm>({
    resolver: zodResolver(createSchema),
    defaultValues: {
      phone: '',
      testCode: '',
      label: '',
      allowedPurposes: [],
      expiresAt: '',
    },
  });

  const editForm = useForm<EditForm>({
    resolver: zodResolver(editSchema),
    defaultValues: {
      testCode: '',
      label: '',
      allowedPurposes: [],
      expiresAt: '',
    },
  });

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchOtpTestPhones({ limit: 100 });
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
    createForm.reset();
    setEditing(null);
    setDialogMode('create');
  };

  const openEdit = (row: OtpTestPhone) => {
    setEditing(row);
    editForm.reset({
      testCode: row.testCode,
      label: row.label,
      allowedPurposes: row.allowedPurposes ?? [],
      expiresAt: row.expiresAt
        ? new Date(row.expiresAt).toISOString().slice(0, 16)
        : '',
    });
    setDialogMode('edit');
  };

  const closeDialog = () => {
    setDialogMode(null);
    setEditing(null);
  };

  const onCreate = async (data: CreateForm) => {
    setSubmitting(true);
    try {
      await createOtpTestPhone({
        phone: data.phone,
        testCode: data.testCode,
        label: data.label,
        allowedPurposes: (data.allowedPurposes ?? []) as OtpTestPhonePurpose[],
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : undefined,
      });
      showSuccess(OTP_TEST_PHONES.SUCCESS_CREATE);
      closeDialog();
      await load();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const onEdit = async (data: EditForm) => {
    if (!editing) return;
    setSubmitting(true);
    try {
      await updateOtpTestPhone(editing._id, {
        testCode: data.testCode,
        label: data.label,
        allowedPurposes: (data.allowedPurposes ?? []) as OtpTestPhonePurpose[],
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt).toISOString()
          : null,
      });
      showSuccess(OTP_TEST_PHONES.SUCCESS_UPDATE);
      closeDialog();
      await load();
    } catch (err) {
      showError(formatMutationError(err));
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (row: OtpTestPhone) => {
    const next = !row.enabled;
    const ok = window.confirm(
      next ? OTP_TEST_PHONES.CONFIRM_ENABLE : OTP_TEST_PHONES.CONFIRM_DISABLE
    );
    if (!ok) return;
    try {
      await setOtpTestPhoneEnabled(row._id, next);
      showSuccess(OTP_TEST_PHONES.SUCCESS_TOGGLE);
      await load();
    } catch (err) {
      showError(formatMutationError(err));
    }
  };

  const handleCopyFirebase = (row: OtpTestPhone) => {
    void navigator.clipboard.writeText(
      formatFirebaseTestNumber(row.phone, row.testCode)
    );
    showSuccess(OTP_TEST_PHONES.COPIED_FIREBASE);
  };

  const renderRow = (row: OtpTestPhone) => (
    <tr key={row._id} className="hover:bg-surface-hover transition-colors">
      <td className="px-4 py-3 font-mono text-sm">
        {maskPhoneDisplay(row.phone)}
      </td>
      <td className="text-heading px-4 py-3 text-sm">{row.label}</td>
      <td className="px-4 py-3">
        <code className="bg-surface-hover border-surface-border rounded border px-2 py-1 font-mono text-xs">
          {row.testCode}
        </code>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {formatPurposes(row.allowedPurposes ?? [])}
      </td>
      <td className="px-4 py-3">
        <Badge variant={row.enabled ? 'success' : 'danger'}>
          {row.enabled
            ? OTP_TEST_PHONES.STATUS_ENABLED
            : OTP_TEST_PHONES.STATUS_DISABLED}
        </Badge>
      </td>
      <td className="text-muted px-4 py-3 text-xs">
        {row.expiresAt
          ? new Date(row.expiresAt).toLocaleString('vi-VN')
          : OTP_TEST_PHONES.NO_EXPIRY}
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={OTP_TEST_PHONES.ACTION_EDIT}
          >
            <IonIcon name="create-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleCopyFirebase(row)}
            className="text-muted hover:text-heading rounded p-1.5 transition-colors"
            title={OTP_TEST_PHONES.ACTION_COPY_FIREBASE}
          >
            <IonIcon name="copy-outline" size="sm" />
          </button>
          <button
            type="button"
            onClick={() => handleToggle(row)}
            className={`rounded p-1.5 transition-colors ${
              row.enabled
                ? 'text-red-400 hover:text-red-500'
                : 'text-emerald-400 hover:text-emerald-500'
            }`}
            title={
              row.enabled
                ? OTP_TEST_PHONES.ACTION_DISABLE
                : OTP_TEST_PHONES.ACTION_ENABLE
            }
          >
            <IonIcon
              name={
                row.enabled
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

  const createPurposes = createForm.watch('allowedPurposes') ?? [];
  const editPurposes = editForm.watch('allowedPurposes') ?? [];
  const purposesValue = dialogMode === 'create' ? createPurposes : editPurposes;

  return (
    <div className="space-y-4">
      <GlassPanel card className="border-amber-500/30 bg-amber-500/5">
        <div className="flex gap-3">
          <IonIcon
            name="warning-outline"
            className="mt-0.5 shrink-0 text-amber-400"
          />
          <div>
            <p className="text-heading text-sm font-medium">
              {OTP_TEST_PHONES.BANNER_TITLE}
            </p>
            <p className="text-muted mt-1 text-xs leading-relaxed">
              {OTP_TEST_PHONES.BANNER_BODY}
            </p>
          </div>
        </div>
      </GlassPanel>

      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-heading text-lg font-semibold">
            {OTP_TEST_PHONES.SECTION_TITLE}
          </h3>
          <p className="text-faint text-xs">
            {OTP_TEST_PHONES.SECTION_DESCRIPTION}
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          iconLeft={dialogMode === 'create' ? 'close-outline' : 'add-outline'}
          onClick={() =>
            dialogMode === 'create' ? closeDialog() : openCreate()
          }
        >
          {dialogMode === 'create'
            ? OTP_TEST_PHONES.TOGGLE_HIDE
            : OTP_TEST_PHONES.CREATE}
        </Button>
      </div>

      {dialogMode === 'create' && (
        <GlassPanel card className="max-w-xl space-y-4">
          <form
            onSubmit={createForm.handleSubmit(onCreate)}
            className="space-y-4"
          >
            <Controller
              name="phone"
              control={createForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.PHONE}
                  placeholder={OTP_TEST_PHONES.FORM.PHONE_PLACEHOLDER}
                  error={createForm.formState.errors.phone?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="testCode"
              control={createForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.CODE}
                  placeholder={OTP_TEST_PHONES.FORM.CODE_PLACEHOLDER}
                  maxLength={6}
                  error={createForm.formState.errors.testCode?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="label"
              control={createForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.LABEL}
                  placeholder={OTP_TEST_PHONES.FORM.LABEL_PLACEHOLDER}
                  error={createForm.formState.errors.label?.message}
                  {...field}
                />
              )}
            />
            <div>
              <p className="text-heading mb-2 text-sm font-medium">
                {OTP_TEST_PHONES.FORM.PURPOSES}
              </p>
              <div className="flex flex-wrap gap-2">
                {PURPOSE_OPTIONS.map((opt) => {
                  const checked = purposesValue.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="border-surface-border flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...purposesValue, opt.value]
                            : purposesValue.filter((v) => v !== opt.value);
                          createForm.setValue('allowedPurposes', next);
                        }}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </div>
            <Controller
              name="expiresAt"
              control={createForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.EXPIRES}
                  type="datetime-local"
                  {...field}
                />
              )}
            />
            <Button type="submit" disabled={submitting}>
              {submitting
                ? OTP_TEST_PHONES.SUBMITTING
                : OTP_TEST_PHONES.SUBMIT_CREATE}
            </Button>
          </form>
        </GlassPanel>
      )}

      {dialogMode === 'edit' && editing && (
        <GlassPanel card className="max-w-xl space-y-4">
          <p className="text-faint text-xs">
            {OTP_TEST_PHONES.FORM.PHONE_READONLY}
          </p>
          <p className="text-heading font-mono text-sm">{editing.phone}</p>
          <form onSubmit={editForm.handleSubmit(onEdit)} className="space-y-4">
            <Controller
              name="testCode"
              control={editForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.CODE}
                  maxLength={6}
                  error={editForm.formState.errors.testCode?.message}
                  {...field}
                />
              )}
            />
            <Controller
              name="label"
              control={editForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.LABEL}
                  error={editForm.formState.errors.label?.message}
                  {...field}
                />
              )}
            />
            <div>
              <p className="text-heading mb-2 text-sm font-medium">
                {OTP_TEST_PHONES.FORM.PURPOSES}
              </p>
              <div className="flex flex-wrap gap-2">
                {PURPOSE_OPTIONS.map((opt) => {
                  const checked = purposesValue.includes(opt.value);
                  return (
                    <label
                      key={opt.value}
                      className="border-surface-border flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) => {
                          const next = e.target.checked
                            ? [...purposesValue, opt.value]
                            : purposesValue.filter((v) => v !== opt.value);
                          editForm.setValue('allowedPurposes', next);
                        }}
                      />
                      {opt.label}
                    </label>
                  );
                })}
              </div>
            </div>
            <Controller
              name="expiresAt"
              control={editForm.control}
              render={({ field }) => (
                <Input
                  label={OTP_TEST_PHONES.FORM.EXPIRES}
                  type="datetime-local"
                  {...field}
                />
              )}
            />
            <div className="flex gap-2">
              <Button type="submit" disabled={submitting}>
                {submitting
                  ? OTP_TEST_PHONES.SUBMITTING
                  : OTP_TEST_PHONES.SUBMIT_UPDATE}
              </Button>
              <Button type="button" variant="ghost" onClick={closeDialog}>
                {OTP_TEST_PHONES.TOGGLE_HIDE}
              </Button>
            </div>
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
          emptyTitle={OTP_TEST_PHONES.EMPTY_TITLE}
          emptyDescription={OTP_TEST_PHONES.EMPTY_DESCRIPTION}
        />
      </QueryState>
    </div>
  );
}
