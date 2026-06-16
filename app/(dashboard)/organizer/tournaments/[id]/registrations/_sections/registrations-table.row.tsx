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

import { IonIcon } from '@/components/atoms/IonIcon';
import { TOURNAMENT } from '@/lib/strings';
import {
  RegistrationStatus,
  TournamentPaymentStatus,
  type TournamentRegistration,
} from '@/graphql/generated';
import {
  PAYMENT_COLORS,
  REG_STATUS_COLORS,
} from '../_hooks/registrations-page.constants';
import {
  formatCurrency,
  formatDateShort,
  formatRegistrationDate,
} from '../_hooks/registrations-page.derived';
import type { RegistrationsPageActions } from '../_hooks/useRegistrationsPageActions';
import type { RegistrationsPageData } from '../_hooks/useRegistrationsPageData';

export interface RegistrationTableColumnContext {
  data: RegistrationsPageData;
  actions: RegistrationsPageActions;
}

interface RegistrationTableRowProps {
  reg: TournamentRegistration;
  ctx: RegistrationTableColumnContext;
}

export function RegistrationTableRow({ reg, ctx }: RegistrationTableRowProps) {
  const {
    selectedIds,
    categoryMap,
    editingBibId,
    bibInputValue,
    setBibInputValue,
    setDetailReg,
  } = ctx.data;
  const {
    isActionLoading,
    bibUpdating,
    toggleSelect,
    handleBibEdit,
    handleBibSave,
    handleBibCancel,
    handlePaymentUpdate,
    handleReject,
    handleDelete,
    approve,
  } = ctx.actions;

  return (
    <tr className="border-surface-border border-b last:border-0 hover:bg-white/5">
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
          <div className="text-heading font-medium">{reg.athleteName}</div>
          {reg.school && (
            <div className="text-secondary text-xs">{reg.school}</div>
          )}
          {reg.club && (
            <div className="text-secondary text-xs">{reg.club}</div>
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
                if (e.key === 'Enter') void handleBibSave(reg._id);
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
              e.target.value as TournamentPaymentStatus,
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
        {formatRegistrationDate(reg.createdAt)}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-1">
          {(reg.registrationStatus === RegistrationStatus.Pending ||
            reg.registrationStatus === RegistrationStatus.Waitlisted) && (
            <button
              type="button"
              onClick={() => void approve(reg._id)}
              disabled={isActionLoading}
              className="text-primary hover:bg-primary/10 rounded-lg p-1.5 transition-colors disabled:opacity-50"
              title="Duyệt"
            >
              <IonIcon name="checkmark-circle-outline" size="sm" />
            </button>
          )}
          {reg.registrationStatus === RegistrationStatus.Pending && (
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
  );
}
