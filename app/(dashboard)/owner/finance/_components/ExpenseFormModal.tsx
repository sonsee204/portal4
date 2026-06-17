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

import { useState } from 'react';
import { Modal } from '@/components/molecules/Modal';
import { Button } from '@/components/atoms/Button';
import { CurrencyInput } from '@/components/atoms/CurrencyInput';
import { Select } from '@/components/atoms/Select';
import { Textarea } from '@/components/atoms/Textarea';
import { DatePicker } from '@/components/molecules/DatePicker';
import type { VenueExpenseNode } from '@/hooks/owner';
import {
  EXPENSE_CATEGORY_OPTIONS,
  PAYMENT_METHOD_FILTER_OPTIONS,
} from '../_hooks/owner-finance-page.constants';
import type { OwnerFinancePageActions } from '../_hooks/useOwnerFinancePageActions';
import type { OwnerFinancePageData } from '../_hooks/useOwnerFinancePageData';
import {
  CreateVenueExpenseInput,
  ExpenseCategory,
  PaymentMethod,
  UpdateVenueExpenseInput,
} from '@/graphql/generated';
import {
  parseIsoDateOrToday,
  resolveInitialCoverageMode,
  toIsoDateOrEmpty,
  type ExpenseCoverageMode,
} from '@/lib/finance/expense-coverage';
import {
  applyCoveragePreset,
  ExpenseCoverageFields,
} from './ExpenseCoverageFields';

interface ExpenseFormModalProps {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
}

function ExpenseFormModalContent({
  data,
  actions,
  editingExpense,
  defaultDate,
}: {
  data: OwnerFinancePageData;
  actions: OwnerFinancePageActions;
  editingExpense: VenueExpenseNode | null;
  defaultDate: string;
}) {
  const [category, setCategory] = useState<ExpenseCategory>(
    () => editingExpense?.category ?? ExpenseCategory.Rent
  );
  const [amount, setAmount] = useState(() =>
    editingExpense ? String(editingExpense.amount) : ''
  );
  const [paymentDate, setPaymentDate] = useState(() =>
    parseIsoDateOrToday(editingExpense?.date ?? defaultDate)
  );
  const [coverageMode, setCoverageMode] = useState<ExpenseCoverageMode>(() =>
    resolveInitialCoverageMode(editingExpense)
  );
  const [coverageFrom, setCoverageFrom] = useState(() =>
    parseIsoDateOrToday(
      editingExpense?.coverageFrom ?? editingExpense?.date ?? defaultDate
    )
  );
  const [coverageTo, setCoverageTo] = useState(() =>
    parseIsoDateOrToday(
      editingExpense?.coverageTo ??
        editingExpense?.coverageFrom ??
        editingExpense?.date ??
        defaultDate
    )
  );
  const [note, setNote] = useState(() => editingExpense?.note ?? '');
  const [paymentMethod, setPaymentMethod] = useState(
    () => editingExpense?.paymentMethod ?? ''
  );

  const parsedAmount = Number.parseInt(amount, 10) || 0;

  const handlePaymentDateChange = (nextDate: Date) => {
    setPaymentDate(nextDate);
    if (coverageMode === 'single') {
      setCoverageFrom(nextDate);
      setCoverageTo(nextDate);
      return;
    }
    setCoverageFrom(nextDate);
  };

  const handleCoverageModeChange = (mode: ExpenseCoverageMode) => {
    setCoverageMode(mode);
    if (mode === 'single') {
      setCoverageFrom(paymentDate);
      setCoverageTo(paymentDate);
      return;
    }
    const preset = applyCoveragePreset(paymentDate, 3);
    setCoverageFrom(preset.from);
    setCoverageTo(preset.to);
  };

  const handleSubmit = async () => {
    if (!data.selectedVenueId) return;
    if (!parsedAmount || parsedAmount <= 0) return;

    const date = toIsoDateOrEmpty(paymentDate);
    const from = toIsoDateOrEmpty(coverageFrom);
    const to = toIsoDateOrEmpty(coverageTo);
    if (from > to) return;

    const coveragePayload =
      coverageMode === 'period' ? { coverageFrom: from, coverageTo: to } : {};

    const payload: CreateVenueExpenseInput | UpdateVenueExpenseInput =
      editingExpense
        ? {
            expenseId: editingExpense._id,
            category,
            amount: parsedAmount,
            date,
            ...coveragePayload,
            note: note || undefined,
            ...(paymentMethod
              ? { paymentMethod: paymentMethod as PaymentMethod }
              : {}),
          }
        : {
            venueId: data.selectedVenueId,
            category,
            amount: parsedAmount,
            date,
            ...coveragePayload,
            note: note || undefined,
            ...(paymentMethod
              ? { paymentMethod: paymentMethod as PaymentMethod }
              : {}),
          };

    await actions.handleSaveExpense(payload);
  };

  return (
    <Modal
      open
      onClose={actions.closeExpenseModal}
      title={editingExpense ? 'Sửa chi phí' : 'Thêm chi phí'}
    >
      <div className="space-y-4">
        <Select
          label="Nhóm chi phí"
          options={EXPENSE_CATEGORY_OPTIONS}
          value={category}
          onChange={(event) =>
            setCategory(event.target.value as ExpenseCategory)
          }
        />
        <CurrencyInput
          label="Số tiền (VND)"
          value={amount}
          onChange={setAmount}
        />
        <DatePicker
          label="Ngày thanh toán"
          value={paymentDate}
          onChange={handlePaymentDateChange}
        />
        <ExpenseCoverageFields
          coverageMode={coverageMode}
          paymentDate={paymentDate}
          coverageFrom={coverageFrom}
          coverageTo={coverageTo}
          parsedAmount={parsedAmount}
          onModeChange={handleCoverageModeChange}
          onCoverageFromChange={setCoverageFrom}
          onCoverageToChange={setCoverageTo}
          onApplyPreset={(months) => {
            setCoverageMode('period');
            const preset = applyCoveragePreset(paymentDate, months);
            setCoverageFrom(preset.from);
            setCoverageTo(preset.to);
          }}
        />
        <Select
          label="Phương thức thanh toán"
          options={[
            { label: 'Không chọn', value: '' },
            ...PAYMENT_METHOD_FILTER_OPTIONS.filter((option) => option.value),
          ]}
          value={paymentMethod}
          onChange={(event) => setPaymentMethod(event.target.value)}
        />
        <Textarea
          label="Ghi chú"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          rows={3}
        />
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={actions.closeExpenseModal}>
            Huỷ
          </Button>
          <Button
            onClick={() => void handleSubmit()}
            disabled={actions.savingExpense}
          >
            {editingExpense ? 'Cập nhật' : 'Thêm chi phí'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}

export function ExpenseFormModal({ data, actions }: ExpenseFormModalProps) {
  if (!actions.expenseModalOpen) return null;

  return (
    <ExpenseFormModalContent
      key={actions.editingExpense?._id ?? 'new-expense'}
      data={data}
      actions={actions}
      editingExpense={actions.editingExpense}
      defaultDate={data.dateRange.to}
    />
  );
}
