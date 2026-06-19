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

import { Button } from '@/components/atoms/Button';
import { IonIcon } from '@/components/atoms/IonIcon';
import { GlassPanel } from '@/components/molecules/GlassPanel';
import { QueryState } from '@/components/molecules/QueryState';
import { OTP_TEST_PHONES } from '@/lib/strings';

import {
  OtpTestPhoneCreateForm,
  OtpTestPhoneEditForm,
} from './OtpTestPhoneCreateForm';
import { OtpTestPhoneRegistryTable } from './OtpTestPhoneRegistryTable';
import { useOtpTestPhoneRegistry } from './useOtpTestPhoneRegistry';

export function OtpTestPhoneRegistrySettings() {
  const {
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
    closeDialog,
    onCreate,
    onEdit,
    openEdit,
    handleToggle,
    handleCopyFirebase,
    sortField,
    sortDir,
    handleSort,
  } = useOtpTestPhoneRegistry();

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
        <OtpTestPhoneCreateForm
          form={createForm}
          purposesValue={purposesValue}
          submitting={submitting}
          onSubmit={onCreate}
        />
      )}

      {dialogMode === 'edit' && editing && (
        <OtpTestPhoneEditForm
          editing={editing}
          form={editForm}
          purposesValue={purposesValue}
          submitting={submitting}
          onSubmit={onEdit}
          onCancel={closeDialog}
        />
      )}

      <QueryState
        loading={loading}
        error={error ?? undefined}
        onRetry={() => void load()}
      >
        <OtpTestPhoneRegistryTable
          items={items}
          onEdit={openEdit}
          onCopyFirebase={handleCopyFirebase}
          onToggle={handleToggle}
          sortKey={sortField}
          sortDir={sortDir}
          onSort={handleSort}
        />
      </QueryState>
    </div>
  );
}
