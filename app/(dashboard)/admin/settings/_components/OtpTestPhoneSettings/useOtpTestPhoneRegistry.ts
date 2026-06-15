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
import { OTP_TEST_PHONES } from '@/lib/strings';
import { CURSOR_PAGE_MAX } from '@/lib/constants/pagination';
import { showError, showSuccess } from '@/lib/toast';

import {
  createSchema,
  editSchema,
  type CreateForm,
  type EditForm,
} from './otp-test-phone-registry.schemas';

export function useOtpTestPhoneRegistry() {
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
      const result = await fetchOtpTestPhones({ limit: CURSOR_PAGE_MAX });
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

  const createPurposes = createForm.watch('allowedPurposes') ?? [];
  const editPurposes = editForm.watch('allowedPurposes') ?? [];
  const purposesValue = dialogMode === 'create' ? createPurposes : editPurposes;

  return {
    items,
    loading,
    error,
    dialogMode,
    editing,
    submitting,
    createForm,
    editForm,
    purposesValue,
    load,
    openCreate,
    openEdit,
    closeDialog,
    onCreate,
    onEdit,
    handleToggle,
    handleCopyFirebase,
  };
}
